<template>
  <FullScreenModal
    :show-modal="showModal"
    transition-name="scale-75"
    custom-width-class="w-11/12 max-w-4xl"
    @close="emit('close')"
  >
    <div v-if="student" class="flex max-h-[80vh] w-full flex-col gap-4 overflow-y-auto pr-2">
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-neutral-300 pb-3 dark:border-neutral-700">
        <div>
          <h2 class="text-2xl font-bold">{{ student.studentName }}</h2>
          <p class="text-xs text-neutral-500">
            Joined: {{ formatDate(student.joinedAt) }} |
            Status:
            <span :class="student.submitted ? 'text-green-600 font-semibold' : 'text-neutral-500'">
              {{ student.submitted ? "Submitted" : "In Progress" }}
            </span>
          </p>
        </div>
        <button
          class="du-btn du-btn-sm du-btn-circle"
          type="button"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>

      <!-- Question List -->
      <div class="flex flex-col gap-4">
        <div
          v-for="(q, idx) in questions"
          :key="q.id"
          class="flex flex-col gap-2 rounded-xl border border-neutral-300 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-800/60"
        >
          <div class="flex items-start justify-between gap-2">
            <span class="font-bold text-sm">Question {{ idx + 1 }} ({{ q.questionType }})</span>
            <span
              class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              :class="getStatusBadgeClass(getGrade(q))"
            >
              {{ getGrade(q).status }}
            </span>
          </div>

          <!-- Question Prompt -->
          <p class="text-sm font-medium">{{ q.textQuestion || q.description || "Question prompt" }}</p>
          <audio v-if="q.audioQuestion" :src="q.audioQuestion" controls class="mt-1 h-8 w-full max-w-md"></audio>

          <!-- Student's Answer -->
          <div class="mt-2 rounded-lg bg-body p-3 border border-neutral-200 dark:border-neutral-700 text-sm">
            <div class="font-semibold text-xs text-neutral-500 uppercase tracking-wider mb-1">Student Answer:</div>
            <div v-if="getStudentQuestionInstance(q.id)?.textAnswer">
              {{ getStudentQuestionInstance(q.id)?.textAnswer }}
            </div>
            <div v-else-if="getStudentQuestionInstance(q.id)?.audioAnswer">
              <audio :src="getStudentQuestionInstance(q.id)?.audioAnswer || ''" controls class="h-8 w-full max-w-sm"></audio>
            </div>
            <div v-else class="italic text-neutral-400">
              No response recorded yet
            </div>
          </div>

          <!-- Correct Answer Key (Teacher view) -->
          <div v-if="q.textAnswer" class="text-xs text-neutral-500 mt-1">
            <span class="font-semibold">Answer Key:</span> {{ q.textAnswer }}
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end pt-2">
        <button
          class="du-btn du-btn-md bg-neutral-200 dark:bg-neutral-700"
          type="button"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </FullScreenModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  showModal: boolean;
  student: SessionInstance | null;
  questions: SessionQuestion[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

function getStudentQuestionInstance(questionId: number): SessionQuestionInstance | undefined {
  if (!props.student?.sessionQuestionInstances) return undefined;
  return props.student.sessionQuestionInstances.find((sqi) => sqi.question === questionId);
}

function getGrade(q: SessionQuestion) {
  const qi = getStudentQuestionInstance(q.id);
  return autoGradeSessionQuestion(q, qi);
}

function getStatusBadgeClass(grade: { status: string }) {
  if (grade.status === "correct") {
    return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300";
  }
  if (grade.status === "incorrect") {
    return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
  }
  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return dateStr;
  }
}
</script>

<style scoped></style>
