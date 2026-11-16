<template>
  <div class="flex w-full flex-col items-center px-4 py-8 sm:px-8">
    <div class="flex w-full max-w-5xl flex-col gap-8">
      <!-- Page Title -->
      <div class="flex flex-col gap-1 border-b border-neutral-300 pb-4 dark:border-neutral-700">
        <h1 class="text-3xl font-bold">Live Sessions</h1>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          Host synchronous, live assignment sessions for your class with a temporary 6-character access code.
        </p>
      </div>

      <!-- Section: Host a New Session -->
      <div class="flex w-full flex-col gap-4 rounded-2xl border border-neutral-300 bg-body p-6 shadow-sm dark:border-neutral-700">
        <div>
          <h2 class="text-xl font-bold">Host a New Session</h2>
          <p class="text-xs text-neutral-500">Choose an existing assignment template to start a live session.</p>
        </div>

        <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div class="flex flex-1 flex-col gap-1.5">
            <label for="template-select" class="text-sm font-semibold">Select Assignment Template:</label>
            <select
              id="template-select"
              v-model="selectedTemplateId"
              class="du-select bg-neutral-200 dark:bg-neutral-700"
              :disabled="loadingTemplates || isHosting"
            >
              <option :value="null" disabled>
                {{ loadingTemplates ? "Loading templates..." : "-- Choose a template --" }}
              </option>
              <option v-for="t in templates" :key="t.id" :value="t.id">
                {{ t.name }} ({{ t.questions?.length ?? 0 }} questions{{ t.timed ? `, ${t.timeLimit}m` : "" }})
              </option>
            </select>
          </div>

          <button
            class="du-btn du-btn-md bg-green-accent text-white hover:brightness-110"
            type="button"
            :disabled="!selectedTemplateId || isHosting"
            @click="handleHostSession"
          >
            <span v-if="isHosting" class="du-loading du-loading-spinner du-loading-sm"></span>
            <span v-else>Start Live Session</span>
          </button>
        </div>

        <p v-if="hostError" class="text-sm font-medium text-red-500">
          {{ hostError }}
        </p>
      </div>

      <!-- Section: Previous and Active Sessions -->
      <div class="flex w-full flex-col gap-4 rounded-2xl border border-neutral-300 bg-body p-6 shadow-sm dark:border-neutral-700">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold">Your Sessions</h2>
            <p class="text-xs text-neutral-500">Active sessions can be rejoined and monitored at any time.</p>
          </div>
          <button
            class="du-btn du-btn-sm bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
            type="button"
            :disabled="loadingSessions"
            @click="fetchSessions"
          >
            Refresh
          </button>
        </div>

        <div class="relative flex w-full items-center justify-center overflow-x-auto rounded-b-box rounded-se-box">
          <table class="table w-full">
            <thead>
              <tr class="border-b border-neutral-300 dark:border-neutral-600">
                <th class="py-3 pl-6 text-start font-bold">Template Name</th>
                <th class="py-3 text-center font-bold">Access Code</th>
                <th class="py-3 text-center font-bold">Status</th>
                <th class="py-3 text-center font-bold">Students</th>
                <th class="py-3 text-center font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="s in userSessions"
                :key="s.id"
                class="border-t border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40"
              >
                <td class="py-3 pl-6 font-medium">
                  {{ s.assignmentTemplate?.name || `Session #${s.id}` }}
                </td>
                <td class="py-3 text-center font-mono font-bold tracking-wider">
                  {{ s.accessCode }}
                </td>
                <td class="py-3 text-center">
                  <span
                    v-if="s.active"
                    class="rounded-full bg-green-accent/20 px-3 py-0.5 text-xs font-semibold text-green-800 dark:text-green-300"
                  >
                    Active
                  </span>
                  <span
                    v-else
                    class="rounded-full bg-neutral-200 px-3 py-0.5 text-xs font-semibold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"
                  >
                    Ended
                  </span>
                </td>
                <td class="py-3 text-center text-sm font-semibold">
                  {{ s.sessionInstances?.length ?? 0 }}
                </td>
                <td class="py-3 text-center">
                  <NuxtLink
                    :to="`/teacher/session/${s.id}`"
                    class="du-btn du-btn-xs rounded-lg"
                    :class="s.active ? 'bg-green-accent text-white hover:brightness-110' : 'bg-neutral-200 dark:bg-neutral-700'"
                  >
                    {{ s.active ? "Open Monitor" : "View Details" }}
                  </NuxtLink>
                </td>
              </tr>
              <tr v-if="userSessions.length === 0" class="border-t border-neutral-300 dark:border-neutral-600">
                <td colspan="5" class="px-6 py-8 text-center text-neutral-500">
                  {{ loadingSessions ? "Loading your sessions..." : "No sessions hosted yet. Create your first session above!" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Session, SessionTemplate } from "~/utils/types/sessions";

definePageMeta({
  layout: "teacher",
  requiresAuth: true,
  redirectIfAuth: false,
  allowedRoles: ["teacher"]
});

const router = useRouter();
const userStore = useUserStore();

const templates = ref<SessionTemplate[]>([]);
const selectedTemplateId = ref<number | null>(null);
const loadingTemplates = ref(true);

const allSessions = ref<Session[]>([]);
const loadingSessions = ref(true);

const isHosting = ref(false);
const hostError = ref("");

const userSessions = computed(() => {
  if (!userStore.user?.id) return allSessions.value;
  return allSessions.value
    .filter((s) => s.host === userStore.user.id)
    .sort((a, b) => b.id - a.id);
});

async function fetchTemplates() {
  loadingTemplates.value = true;
  const { data, error } = await tryRequestEndpoint<SessionTemplate[]>("assignment-templates/");
  if (!error && data) {
    templates.value = data;
    if (data.length > 0) {
      selectedTemplateId.value = data[0].id;
    }
  } else {
    console.error("Failed to load assignment templates:", error);
  }
  loadingTemplates.value = false;
}

async function fetchSessions() {
  loadingSessions.value = true;
  const { data, error } = await tryRequestEndpoint<Session[]>("sessions/");
  if (!error && Array.isArray(data)) {
    allSessions.value = data;
  } else {
    console.error("Failed to load sessions:", error);
  }
  loadingSessions.value = false;
}

async function handleHostSession() {
  if (!selectedTemplateId.value) return;
  isHosting.value = true;
  hostError.value = "";

  const { data, error } = await tryRequestEndpoint<Session>(
    "sessions/host_session/",
    "POST",
    { assignment_template: selectedTemplateId.value }
  );

  isHosting.value = false;

  if (error || !data) {
    hostError.value = "Failed to create session. Please check your network and try again.";
    console.error(error);
    return;
  }

  await router.push(`/teacher/session/${data.id}`);
}

onMounted(() => {
  void fetchTemplates();
  void fetchSessions();
});
</script>

<style scoped></style>
