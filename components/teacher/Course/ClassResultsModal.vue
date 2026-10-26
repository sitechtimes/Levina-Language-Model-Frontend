<template>
  <FullScreenModal
    :show-modal="showModal"
    transition-name="scale-75"
    custom-width-class="w-80 xs:w-96 sm:w-125"
    @close="emit('close')"
  >
    <div class="flex w-full flex-col items-center justify-center gap-4 text-center">
      <div>
        <h2 class="text-xl font-semibold">Class Results Summary</h2>
        <p v-if="selectedAssignment" class="text-sm text-neutral-500 dark:text-neutral-400">{{ selectedAssignment.name }}</p>
      </div>

      <div class="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        <div class="flex flex-col items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 p-3 dark:border-neutral-700 dark:bg-neutral-800">
          <span class="text-xs text-neutral-500">Submissions</span>
          <span class="text-xl font-bold">{{ stats.submittedCount }} / {{ stats.totalStudents }}</span>
        </div>
        <div class="flex flex-col items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 p-3 dark:border-neutral-700 dark:bg-neutral-800">
          <span class="text-xs text-neutral-500">Class Accuracy</span>
          <span class="text-xl font-bold text-green-600 dark:text-green-400">{{ stats.accuracyPercentage }}%</span>
        </div>
        <div class="flex flex-col items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 p-3 dark:border-neutral-700 dark:bg-neutral-800">
          <span class="text-xs text-neutral-500">Correct Answers</span>
          <span class="text-xl font-bold text-green-600 dark:text-green-400">{{ stats.totalCorrect }}</span>
        </div>
        <div class="flex flex-col items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 p-3 dark:border-neutral-700 dark:bg-neutral-800">
          <span class="text-xs text-neutral-500">Incorrect Answers</span>
          <span class="text-xl font-bold text-red-600 dark:text-red-400">{{ stats.totalIncorrect }}</span>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center gap-4 py-2">
        <div class="size-44 rounded-full border border-neutral-300 shadow-inner dark:border-neutral-600" :style="pieChartStyle" role="img" aria-label="Class performance breakdown pie chart"></div>
        <div class="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
          <div class="flex items-center gap-1.5"><span class="size-3 rounded-full bg-green-500"></span><span>Correct ({{ stats.totalCorrect }})</span></div>
          <div class="flex items-center gap-1.5"><span class="size-3 rounded-full bg-red-500"></span><span>Incorrect ({{ stats.totalIncorrect }})</span></div>
          <div v-if="stats.totalPending > 0" class="flex items-center gap-1.5"><span class="size-3 rounded-full bg-yellow-500"></span><span>Pending Review ({{ stats.totalPending }})</span></div>
        </div>
      </div>

      <div class="mt-2 flex w-full justify-end gap-2">
        <button class="du-btn du-btn-md" type="button" @click="emit('close')">Close</button>
      </div>
    </div>
  </FullScreenModal>
</template>

<script setup lang="ts">
import type { ClassAssignmentStats, TeacherAssignment } from "~/utils/types/assignments";

defineProps<{
  showModal: boolean;
  selectedAssignment?: TeacherAssignment;
  stats: ClassAssignmentStats;
  pieChartStyle: { background: string };
}>();

const emit = defineEmits<{ close: [] }>();
</script>
