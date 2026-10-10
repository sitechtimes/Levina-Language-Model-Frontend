<template>
  <div
    class="fixed left-0 top-0 flex h-full w-72 shrink-0 flex-col items-start justify-start border-neutral-300 transition-shadow lg:sticky lg:border-r dark:border-neutral-600"
    :class="doneAssignment ? 'lg:shadow-xl' : 'shadow-none'"
  >
    <button class="group my-4 ml-4 flex items-center justify-center gap-2 rounded-xl px-5 py-2 hover:bg-neutral-200 hover:transition dark:hover:bg-neutral-500/25" type="button" @click="emit('close')">
      <img class="size-4 group-hover:-translate-x-1 group-hover:transition dark:invert" src="/ui/arrow-left.svg" aria-hidden="true" />
      <span class="translate-y-px">Back to course</span>
    </button>

    <div class="relative hidden w-full lg:block">
      <!-- <div class="list-overlay pointer-events-none absolute left-0 top-0 h-full w-full border-y border-neutral-300 dark:border-neutral-600"></div> -->
      <ul class="flex h-[65dvh] w-full shrink-0 flex-col items-start justify-start overflow-y-scroll border-neutral-300 px-4 xl:h-[70dvh]">
        <li
          v-for="(num, index) in totalQuestions"
          :key="index"
          class="w-full border-l-4 border-neutral-300 py-0.5 pl-4 first:mt-6 last:mb-6"
          :class="{
            'border-neutral-400 hover:border-neutral-500': currentQuestionIndex === index,
            'cursor-not-allowed grayscale': !assignmentIsStatic
          }"
        >
          <!-- button for question number -->
          <button
            class="w-full rounded-xl px-5 py-2 text-left hover:transition"
            :class="{
              'bg-neutral-200 dark:bg-neutral-500/25': currentQuestionIndex === index,
              'text-neutral-400': currentQuestionIndex < index,
              'hover:bg-neutral-200 dark:hover:bg-neutral-700': assignmentIsStatic
            }"
            type="button"
            :disabled="!assignmentIsStatic"
            @click="changeRouteQuery({ q: index + 1 }, 'push')"
          >
            Question {{ num }}
          </button>
        </li>
      </ul>
    </div>

    <div class="flex h-full w-full flex-col items-start justify-end p-4 lg:bg-neutral-100/25 dark:bg-none lg:dark:bg-neutral-800">
      <h4 class="w-64 overflow-hidden overflow-ellipsis text-nowrap text-2xl font-medium" :title="assignmentName">{{ assignmentName }}</h4>
      <p class="hidden text-sm font-bold sm:block">Due {{ formatDate(dueDate, currentDate) }}</p>
      <p class="hidden text-sm text-neutral-700 sm:block dark:text-white">Assigned {{ formatDate(assignedDate, currentDate) }}</p>

      <div class="w-full sm:mt-4 lg:mt-auto" :class="{ 'du-tooltip': !doneAssignment }" data-tip="Complete all questions first!">
        <button
          class="relative w-full rounded-lg bg-green-accent px-5 py-1.5 text-lg font-bold"
          :class="doneAssignment ? 'submit-button' : 'cursor-not-allowed grayscale'"
          :disabled="!doneAssignment"
          type="button"
          @click="submit"
        >
          <span v-if="submitState.isLoading" class="du-loading du-loading-spinner du-loading-sm"></span>
          Submit Assignment
        </button>
      </div>
    </div>

    <FullScreenModal transition-name="scale-75" :show-modal="submitState.result !== undefined" @close="submitState.result = undefined">
      <div v-if="submitState.result" class="flex w-full flex-col gap-3">
        <h3 class="text-2xl font-bold">Submitted!</h3>
        <p class="text-neutral-700 dark:text-neutral-300">Your assignment has been submitted successfully.</p>
        <button
          class="mt-6 rounded-xl border-2 border-green-100 bg-green-100/50 px-6 py-1.5 transition hover:border-green-400 hover:bg-green-300 active:scale-95"
          type="button"
          @click="router.push(`/student/course/${studentCurrentCourse?.id}`)"
        >
          Back to course
        </button>
      </div>
      <div v-else class="flex w-full flex-col gap-3">
        <h3 class="text-2xl font-bold">Something went wrong.</h3>
        <p class="text-neutral-700 dark:text-neutral-300">Please wait a few moments before trying to submit your assignment again.</p>
        <button
          class="mt-6 rounded-xl border-2 border-red-100 bg-red-100/50 px-6 py-1.5 transition hover:border-red-400 hover:bg-red-300 active:scale-95"
          type="button"
          @click="submitState.result = undefined"
        >
          Close
        </button>
      </div>
    </FullScreenModal>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  assignment: StudentAssignment;
  currentQuestionIndex: number;
  triggerSubmit: boolean;
  isSaved: boolean;
  doneAssignment?: boolean;
}>();

const emit = defineEmits<{
  close: [void];
  submitted: [void];
}>();

const router = useRouter();
const userStore = useUserStore();
const { studentCurrentCourse } = storeToRefs(userStore);
const currentDate = new Date();

function formatDate(dateValue: string | Date | null | undefined, referenceDate: Date = new Date()) {
  if (!dateValue) return "No date";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  const today = new Date(referenceDate);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const assignmentData = computed(() => (props.assignment ?? {}) as Partial<LegacyAssignmentShape>);
const assignmentName = computed(() => assignmentData.value.name ?? assignmentData.value.assignment?.name ?? "Assignment");
const dueDate = computed(() => assignmentData.value.dueDate ?? assignmentData.value.assignment?.dueDate ?? new Date());
const assignedDate = computed(() => assignmentData.value.dateAssigned ?? assignmentData.value.assignment?.dateAssigned ?? new Date());
const totalQuestions = computed(() => {
  const questionCount = assignmentData.value.assignment?.numQuestions;
  if (typeof questionCount === "number") return questionCount;

  const questions = assignmentData.value.questions;
  return Array.isArray(questions) ? questions.length : 0;
});
const assignmentIsStatic = computed(() => assignmentData.value.isStatic ?? assignmentData.value.assignment?.isStatic ?? true);
const completedQuestions = computed(() => assignmentData.value.questionsCompleted ?? assignmentData.value.assignment?.questionsCompleted ?? 0);

const submitState = reactive({
  isLoading: false,
  result: ref<boolean>()
});

const submitTriggered = ref(false);
function submit() {
  submitTriggered.value = true;
  emit("submitted");
}

async function submitAssignment() {
  submitState.isLoading = true;
  const { error } = await tryRequestEndpoint<SubmitAssignment>("courses/student/submit-assignment/", "POST", { id: props.assignment.id });

  submitState.isLoading = false;
  submitState.result = !error;
  if (error) return console.error(error);
  if (studentCurrentCourse.value) studentCurrentCourse.value.assignmentsFetched = false; // refetch assignments cuz we just submitted
}
watch(
  () => props.triggerSubmit,
  (val) => {
    if (val) void submitAssignment();
  }
);
watch(
  () => props.isSaved,
  (val) => {
    if (val && submitTriggered.value) void submitAssignment();
  }
);
</script>

<style scoped>
.list-overlay {
  background: linear-gradient(to bottom, var(--bg-color), transparent 10%, transparent 90%, var(--bg-color));
}
</style>
