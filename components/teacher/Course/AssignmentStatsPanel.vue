<template>
  <div class="flex w-full flex-col gap-4 rounded-2xl border border-neutral-300 bg-body p-6 shadow-sm dark:border-neutral-700">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-bold">Assignment Performance &amp; Stats</h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          Select an assignment to inspect individual student results and class-wide statistics.
        </p>
      </div>
      <button
        v-if="assignments.length > 0"
        class="du-btn du-btn-md rounded-xl bg-green-accent text-white hover:brightness-110"
        type="button"
        :disabled="!selectedAssignment"
        @click="emit('view-results')"
      >
        View Class Results
      </button>
    </div>

    <div
      v-if="assignments.length > 0"
      class="flex flex-col gap-3 rounded-xl border border-neutral-300 bg-neutral-200/50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50"
    >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <label for="assignment-select" class="text-sm font-semibold">Select Assignment:</label>
          <select
            id="assignment-select"
            class="du-select bg-neutral-200 dark:bg-neutral-700"
            :value="selectedAssignmentId ?? undefined"
            @change="emit('select-assignment', Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="assignment in assignments" :key="assignment.id" :value="assignment.id">
              {{ assignment.name }} (ID: {{ assignment.id }})
            </option>
          </select>
        </div>
        <div v-if="selectedAssignment" class="flex flex-wrap items-center gap-2 text-xs">
          <span class="rounded-lg bg-neutral-200 px-2.5 py-1 font-medium dark:bg-neutral-700">
            Questions: {{ selectedAssignment.questions?.length ?? 0 }}
          </span>
          <span v-if="selectedAssignment.timed" class="rounded-lg bg-neutral-200 px-2.5 py-1 font-medium dark:bg-neutral-700">
            Timed: {{ selectedAssignment.timeLimit }} min
          </span>
          <span class="rounded-lg bg-neutral-200 px-2.5 py-1 font-medium dark:bg-neutral-700">
            Submissions: {{ stats.submittedCount }} / {{ studentCount }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center p-8 text-center text-neutral-500">
      <p>No assignments found for this class.</p>
    </div>

    <div v-if="selectedAssignment" class="relative flex w-full items-center justify-center overflow-x-auto rounded-xl">
      <table class="du-table w-full">
        <thead>
          <tr class="border-b border-neutral-300 dark:border-neutral-600">
            <th class="py-3 pl-6 text-start font-bold">Student</th>
            <th class="py-3 text-center font-bold">Completion Status</th>
            <th class="py-3 text-center font-bold">Score (Correct / Total)</th>
            <th class="py-3 text-center font-bold">Accuracy</th>
            <th class="py-3 text-center font-bold">Review Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in studentResults" :key="result.studentId" class="border-t border-neutral-300 dark:border-neutral-600">
            <td class="py-3 pl-6 font-medium">{{ result.firstName }} {{ result.lastName }}</td>
            <td class="py-3 text-center">
              <span v-if="result.hasSubmitted" class="rounded-full bg-green-accent/20 px-3 py-1 text-xs font-semibold text-green-800 dark:text-green-300">Completed</span>
              <span v-else class="rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400">Not Completed</span>
            </td>
            <td class="py-3 text-center">
              <span v-if="result.hasSubmitted" class="font-semibold">{{ result.correctCount }} / {{ result.totalQuestions }}</span>
              <span v-else class="text-neutral-400">—</span>
            </td>
            <td class="py-3 text-center">
              <span v-if="result.hasSubmitted" class="font-semibold">{{ result.totalQuestions > 0 ? Math.round((result.correctCount / result.totalQuestions) * 100) : 0 }}%</span>
              <span v-else class="text-neutral-400">—</span>
            </td>
            <td class="py-3 text-center text-xs text-neutral-500">
              <span v-if="result.hasSubmitted && result.pendingCount > 0" class="text-amber-600 dark:text-amber-400">{{ result.pendingCount }} non-MCQ pending review</span>
              <span v-else-if="result.hasSubmitted" class="text-green-600 dark:text-green-400">Graded</span>
              <span v-else>Awaiting submission</span>
            </td>
          </tr>
          <tr v-if="studentResults.length === 0" class="border-t border-neutral-300 dark:border-neutral-600">
            <td colspan="5" class="px-6 py-6 text-center text-neutral-500">No students in this class.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClassAssignmentStats, StudentAssignmentResult, TeacherAssignment } from "~/utils/types/assignments";

defineProps<{
  assignments: TeacherAssignment[];
  selectedAssignmentId: number | null;
  selectedAssignment?: TeacherAssignment;
  studentResults: StudentAssignmentResult[];
  stats: ClassAssignmentStats;
  studentCount: number;
}>();

const emit = defineEmits<{
  "select-assignment": [id: number];
  "view-results": [];
}>();
</script>
