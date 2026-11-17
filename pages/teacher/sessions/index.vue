<template>
  <div class="flex w-full flex-col items-center px-4 py-8 sm:px-8">
    <div class="flex w-full max-w-5xl flex-col gap-8">
      <div class="flex flex-col gap-1 border-b border-neutral-300 pb-4 dark:border-neutral-700">
        <h1 class="text-3xl font-bold">Live Sessions</h1>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">Host synchronous, live assignment sessions for your class with a temporary 6-character access code.</p>
      </div>

      <TeacherSessionSessionLauncherCard :templates="templates" :loading="loadingTemplates" :is-hosting="isHosting" :error="hostError" @host="handleHostSession" />

      <TeacherSessionSessionHistoryTable :sessions="userSessions" :loading="loadingSessions" @refresh="fetchSessions" />
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

const router = useRouter();
const userStore = useUserStore();

const templates = ref<SessionTemplate[]>([]);
const loadingTemplates = ref(true);

const allSessions = ref<Session[]>([]);
const loadingSessions = ref(true);

const isHosting = ref(false);
const hostError = ref("");

const userSessions = computed(() => {
  if (!userStore.userId) return allSessions.value;
  return allSessions.value.filter((s) => s.host === userStore.userId).sort((a, b) => b.id - a.id);
});

async function fetchTemplates() {
  loadingTemplates.value = true;
  const { data, error } = await tryRequestEndpoint<SessionTemplate[]>("assignment-templates/");
  if (!error && data) {
    templates.value = data;
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

async function handleHostSession(templateId: number) {
  isHosting.value = true;
  hostError.value = "";

  const { data, error } = await tryRequestEndpoint<Session>("sessions/host_session/", "POST", { assignment_template: templateId });

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
