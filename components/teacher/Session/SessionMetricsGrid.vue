<template>
  <div class="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
    <div class="flex flex-col items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 p-3 dark:border-neutral-700 dark:bg-neutral-800">
      <span class="text-xs text-neutral-500">Connected Students</span>
      <span class="text-xl font-bold">{{ stats.totalStudents }}</span>
    </div>

    <div class="flex flex-col items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 p-3 dark:border-neutral-700 dark:bg-neutral-800">
      <span class="text-xs text-neutral-500">Completed Submissions</span>
      <span class="text-xl font-bold text-green-600 dark:text-green-400">
        {{ stats.submittedCount }} / {{ stats.totalStudents }}
      </span>
    </div>

    <div class="flex flex-col items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 p-3 dark:border-neutral-700 dark:bg-neutral-800">
      <span class="text-xs text-neutral-500">Class Accuracy (MCQ)</span>
      <span class="text-xl font-bold text-green-600 dark:text-green-400">
        {{ stats.accuracyPercentage }}%
      </span>
    </div>

    <div class="flex flex-col items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 p-3 dark:border-neutral-700 dark:bg-neutral-800">
      <span class="text-xs text-neutral-500">Questions Answered</span>
      <span class="text-xl font-bold">
        {{ stats.totalAnswered }} / {{ stats.totalQuestions }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats: ClassSessionStats;
}>();
</script>

<style scoped></style>
