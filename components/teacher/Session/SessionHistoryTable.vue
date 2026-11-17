<template>
  <div class="flex w-full flex-col gap-4 rounded-2xl border border-neutral-300 bg-body p-6 shadow-sm dark:border-neutral-700">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold">Your Sessions</h2>
        <p class="text-xs text-neutral-500">Active sessions can be rejoined and monitored at any time.</p>
      </div>
      <button class="du-btn du-btn-sm bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600" type="button" :disabled="loading" @click="emit('refresh')">Refresh</button>
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
          <tr v-for="s in sessions" :key="s.id" class="border-t border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40">
            <td class="py-3 pl-6 font-medium">
              {{ s.assignmentTemplate?.name || `Session #${s.id}` }}
            </td>
            <td class="py-3 text-center font-mono font-bold tracking-wider">
              {{ s.accessCode }}
            </td>
            <td class="py-3 text-center">
              <span v-if="s.active" class="rounded-full bg-green-accent/20 px-3 py-0.5 text-xs font-semibold text-green-800 dark:text-green-300"> Active </span>
              <span v-else class="rounded-full bg-neutral-200 px-3 py-0.5 text-xs font-semibold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"> Ended </span>
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
          <tr v-if="sessions.length === 0" class="border-t border-neutral-300 dark:border-neutral-600">
            <td colspan="5" class="px-6 py-8 text-center text-neutral-500">
              {{ loading ? "Loading your sessions..." : "No sessions hosted yet. Create your first session above!" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sessions: Session[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "refresh"): void;
}>();
</script>

<style scoped></style>
