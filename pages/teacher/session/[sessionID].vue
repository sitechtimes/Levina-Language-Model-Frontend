<template>
  <div class="flex w-full flex-col items-center px-4 py-8 sm:px-8">
    <div class="flex w-full max-w-5xl flex-col gap-6">
      <!-- Breadcrumb & Control Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-300 pb-4 dark:border-neutral-700">
        <div>
          <NuxtLink
            to="/teacher/sessions"
            class="flex items-center gap-1 text-sm font-semibold text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white mb-1"
          >
            ← Back to Sessions Hub
          </NuxtLink>
          <h1 class="text-3xl font-bold">Live Session Monitor</h1>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Auto-refresh pill -->
          <button
            class="du-btn du-btn-sm rounded-lg"
            :class="autoRefresh ? 'bg-green-accent text-white' : 'bg-neutral-200 dark:bg-neutral-700'"
            type="button"
            @click="autoRefresh = !autoRefresh"
          >
            Auto-refresh: {{ autoRefresh ? "ON (3s)" : "PAUSED" }}
          </button>

          <!-- Manual Refresh button -->
          <button
            class="du-btn du-btn-sm bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
            type="button"
            :disabled="isPolling"
            @click="pollSessionData"
          >
            <span v-if="isPolling" class="du-loading du-loading-spinner du-loading-xs"></span>
            <span v-else>Refresh Now</span>
          </button>

          <!-- End Session button -->
          <button
            v-if="session?.active"
            class="du-btn du-btn-sm bg-red-500 text-white hover:bg-red-600"
            type="button"
            @click="showEndConfirmModal = true"
          >
            End Session
          </button>
        </div>
      </div>

      <!-- Loading / Error States -->
      <div v-if="loadingInitial" class="flex w-full justify-center py-16">
        <span class="du-loading du-loading-spinner du-loading-lg text-green-accent"></span>
      </div>

      <div v-else-if="fetchError" class="flex flex-col items-center justify-center p-8 text-center text-red-500">
        <p class="font-bold">{{ fetchError }}</p>
        <NuxtLink to="/teacher/sessions" class="mt-4 du-btn du-btn-sm bg-neutral-200">Return to Sessions Hub</NuxtLink>
      </div>

      <!-- Live Session Content -->
      <template v-else-if="session">
        <TeacherSessionJoinCodeDisplay
          :access-code="session.accessCode"
          :template-name="session.assignmentTemplate?.name || 'Live Assignment'"
          :active="session.active"
        />

        <TeacherSessionSessionMetricsGrid
          :stats="sessionStats"
        />

        <TeacherSessionStudentTrackerTable
          :students="studentProgressList"
          @inspect="handleInspectStudent"
        />

        <TeacherSessionStudentAttemptModal
          :show-modal="showInspectModal"
          :student="inspectedStudent"
          :questions="session.assignmentTemplate?.questions || []"
          @close="showInspectModal = false"
        />

        <TeacherSessionEndSessionModal
          :show-modal="showEndConfirmModal"
          :is-ending="isEnding"
          @close="showEndConfirmModal = false"
          @confirm="handleEndSession"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "teacher",
  requiresAuth: true,
  redirectIfAuth: false,
  allowedRoles: ["teacher"]
});

const route = useRoute();
const sessionId = route.params.sessionID as string;

const session = ref<Session | null>(null);
const loadingInitial = ref(true);
const isPolling = ref(false);
const fetchError = ref("");

const autoRefresh = ref(true);
let pollInterval: ReturnType<typeof setInterval> | null = null;

const showEndConfirmModal = ref(false);
const isEnding = ref(false);

const showInspectModal = ref(false);
const inspectedStudentId = ref<number | null>(null);

const inspectedStudent = computed<SessionInstance | null>(() => {
  if (!session.value || inspectedStudentId.value === null) return null;
  return session.value.sessionInstances.find((si) => si.id === inspectedStudentId.value) || null;
});

const studentProgressList = computed<StudentSessionProgress[]>(() => {
  if (!session.value) return [];
  const questions = session.value.assignmentTemplate?.questions || [];

  return session.value.sessionInstances.map((si) => {
    const graded = gradeSessionAttempt(questions, si.sessionQuestionInstances || []);

    return {
      instanceId: si.id,
      studentName: si.studentName,
      joinedAt: si.joinedAt,
      submitted: si.submitted,
      answeredCount: graded.answeredCount,
      correctCount: graded.correctCount,
      incorrectCount: graded.incorrectCount,
      pendingCount: graded.pendingCount,
      totalQuestions: questions.length
    };
  });
});

const sessionStats = computed<ClassSessionStats>(() => {
  return calculateSessionStats(studentProgressList.value);
});

async function fetchSessionData(isInitial = false) {
  if (isInitial) loadingInitial.value = true;
  else isPolling.value = true;

  const { data, error } = await tryRequestEndpoint<Session>(`sessions/${sessionId}/`);

  if (isInitial) loadingInitial.value = false;
  else isPolling.value = false;

  if (error || !data) {
    if (isInitial) {
      fetchError.value = "Failed to load session details. The session may not exist.";
    }
    console.error("Session poll error:", error);
    return;
  }

  session.value = data;
}

async function pollSessionData() {
  if (!session.value?.active && session.value !== null) {
    stopPolling();
    return;
  }
  await fetchSessionData(false);
}

function startPolling() {
  stopPolling();
  pollInterval = setInterval(() => {
    if (autoRefresh.value && document.visibilityState === "visible") {
      void pollSessionData();
    }
  }, 3500);
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}

function handleInspectStudent(instanceId: number) {
  inspectedStudentId.value = instanceId;
  showInspectModal.value = true;
}

async function handleEndSession() {
  if (!session.value) return;
  isEnding.value = true;

  const { data, error } = await tryRequestEndpoint<Session>(
    `sessions/${sessionId}/end_session/`,
    "POST"
  );

  isEnding.value = false;
  showEndConfirmModal.value = false;

  if (error || !data) {
    window.alert("Failed to end session. Please try again.");
    console.error(error);
    return;
  }

  session.value = data;
  autoRefresh.value = false;
  stopPolling();
}

function handleVisibilityChange() {
  if (document.visibilityState === "visible" && autoRefresh.value) {
    void pollSessionData();
  }
}

onMounted(async () => {
  await fetchSessionData(true);
  if (session.value?.active) {
    startPolling();
  }
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onBeforeUnmount(() => {
  stopPolling();
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});
</script>

<style scoped></style>
