<template>
  <div class="flex w-full flex-col gap-4 rounded-2xl border border-neutral-300 bg-body p-6 shadow-sm dark:border-neutral-700">
    <div>
      <h2 class="text-xl font-bold">Host a New Session</h2>
      <p class="text-xs text-neutral-500">Choose an existing assignment template to start a live session.</p>
    </div>

    <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div class="flex flex-1 flex-col gap-1.5">
        <label for="template-select" class="text-sm font-semibold">Select Assignment Template:</label>
        <select id="template-select" v-model="selectedId" class="du-select bg-neutral-200 dark:bg-neutral-700" :disabled="loading || isHosting">
          <option :value="null" disabled>
            {{ loading ? "Loading templates..." : "-- Choose a template --" }}
          </option>
          <option v-for="t in templates" :key="t.id" :value="t.id">{{ t.name }} ({{ t.questions?.length ?? 0 }} questions{{ t.timed ? `, ${t.timeLimit}m` : "" }})</option>
        </select>
      </div>

      <button class="du-btn du-btn-md bg-green-accent text-white hover:brightness-110" type="button" :disabled="!selectedId || isHosting" @click="handleHost">
        <span v-if="isHosting" class="du-loading du-loading-spinner du-loading-sm"></span>
        <span v-else>Start Live Session</span>
      </button>
    </div>

    <p v-if="error" class="text-sm font-medium text-red-500">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  templates: SessionTemplate[];
  loading: boolean;
  isHosting: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "host", templateId: number): void;
}>();

const selectedId = ref<number | null>(null);

watch(
  () => props.templates,
  (newTemplates) => {
    if (newTemplates.length > 0 && selectedId.value === null) {
      selectedId.value = newTemplates[0].id;
    }
  },
  { immediate: true }
);

function handleHost() {
  if (selectedId.value !== null) {
    emit("host", selectedId.value);
  }
}
</script>

<style scoped></style>
