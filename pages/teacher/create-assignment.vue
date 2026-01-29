<template> 
    <div class="-m-4 flex w-auto flex-col px-4 lg:h-[calc(100vh-4rem)] lg:max-h-[calc(100vh-4rem)] lg:flex-row lg:overflow-y-hidden">
        <form
      class="flex h-full w-full shrink-0 flex-col gap-2 p-4 lg:w-[35rem] lg:overflow-y-scroll"
      @submit.prevent="handleAssignmentSubmit"
    >
      <h1 class="mt-10 mb-5 text-2xl font-bold">Create Assignment</h1>
        <div class="flex flex-col gap-4">
            <label title="Required" class="flex flex-col gap-1">
                <p class="font-medium">Assignment Name<span class="text-red-500">*</span></p>
                <input 
                type="text"
                v-model="assignmentInfo.name"
                class="du-input w-full border-neutral-400 bg-neutral-200 text-black hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-300 dark:hover:border-neutral-300/50" 
                placeholder="Enter assignment name" 
                required
                />
            </label>
            <label title="Required" class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <p class="font-medium">Timed</p>
                <input 
                type="checkbox"
                v-model="assignmentInfo.timed" 
                class="h-4 w-4 rounded border-neutral-400 text-blue-600 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-900"
                />
              </div>
            </label>
            <label v-if="assignmentInfo.timed" title="Required" class="flex flex-col gap-1">
                <p class="font-medium">Time Limit<span class="text-red-500">*</span></p>
                <input 
                type="number"
                v-model="assignmentInfo.time_limit" 
                class="du-input w-full border-neutral-400 bg-neutral-200 text-black hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-300 dark:hover:border-neutral-300/50" 
                placeholder="Example: 50" 
                required 
                />
            </label>
            <div class="mb-2 flex w-full grow flex-col">
        <p class="font-medium">Questions<span title="Required" class="text-red-500">*</span></p>
        <div
          class="flex h-0 max-h-full min-h-60 w-full grow items-center justify-center rounded-lg border border-neutral-400 bg-white hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:hover:border-neutral-300/50"
        >
          <div v-if="!assignmentInfo.questions.length" class="mb-6 flex h-fit flex-col items-center justify-center">
            <img class="pointer-events-none size-40 select-none opacity-65 dark:invert" src="/ui/plus.svg" aria-hidden="true" />
            <p class="text-center text-xl font-bold text-neutral-500 dark:text-white">No Questions Selected</p>
            <p class="w-3/4 text-center text-sm font-medium text-neutral-400">Select questions from the question bank to add them to this assignment!</p>
          </div>
          <div v-else class="flex h-full w-full flex-col items-start justify-start gap-4 overflow-y-scroll pl-4 pr-2 pt-4">
            <ol v-if="assignmentInfo.questions.length" class="flex w-full flex-col items-start justify-start gap-2">
              <li v-for="(question, index) in assignmentInfo.questions" :key="question" class="flex w-full items-center justify-start gap-3">

                <span>{{ index + 1 }}.</span>
                <span class="truncate">{{ questions.find(q => q.id === question)?.name }}</span>
                </li>
              </ol>
                <div class="flex items-center justify-center gap-2">
                  </div>
                  </div>
                </div>
          </div>
        </div>
         <button type="submit" class="mt-5 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" >Create Assignment</button>
    </form>
    <div class="flex h-full flex-1 flex-col p-4 lg:overflow-y-scroll">
      <h2 class="mt-10 mb-5 text-2xl font-bold">Available Questions</h2>
      <ul class="flex flex-col gap-2">
        <li
          v-for="question in questions"
          :key="question.id"
          class="flex items-center gap-3 rounded border p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          @click="addQuestion(question.id)"
        >
          {{ question.id }}. {{ question.name }}
        </li>
      </ul>
    </div>
    <form
      class="flex h-full w-full shrink-0 flex-col gap-2 p-4 lg:w-[35rem] lg:overflow-y-scroll"
      @submit.prevent="handleQuestionSubmit"
    >
      <div class="flex h-full flex-1 flex-col p-4 lg:overflow-y-scroll">
        <h2 class="mt-10 mb-5 text-2xl font-bold">Create Questions</h2>
        <label title="Required" class="flex flex-col gap-1">
            <p class="font-medium">Question Text<span class="text-red-500">*</span></p>
            <input 
          type="text"
          v-model="questionInfo.name"
           class="du-input w-full border-neutral-400 bg-neutral-200 text-black hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-300 dark:hover:border-neutral-300/50" 
          placeholder="Enter question text" 
          required
          />
      </label>
      <label title="Required" class="flex flex-col gap-1">
          <p class="font-medium">Input Type<span class="text-red-500">*</span></p>
          <select 
          v-model="questionInfo.question_type"
           class="du-input w-full border-neutral-400 bg-neutral-200 text-black hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-300 dark:hover:border-neutral-300/50" 
          required
          >
            <option value="" disabled>Select input type</option>
            <option value="MCQ">Multiple Choice</option>
            <option value="AQ">Audio</option>
            <option value="EQ">Essay</option>
          </select>
      </label>
    </div>
    <button type="submit" class="mt-5 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600" >Create Question</button>
  </form>
</div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "teacher",
  requiresAuth: true,
  redirectIfAuth: false
})
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

type Question = {
  id: number
  name: string
};

const questions = ref(await requestEndpoint<Question[]>(`/questions/`));

const assignmentInfo = reactive({
  name: ref<string>(""),
  timed: ref<boolean>(false),
    /** In minutes */
  time_limit: ref<number>(45),
  questions: ref<number[]>([]),
});

const questionInfo = reactive({
  question_type: ref<string>(""),
  name: ref<string>(""),
});

const createResult = reactive({
  isLoading: false,
  error: "",
  success: false
});

function addQuestion(questionId: number) {
  if (!assignmentInfo.questions.find((q: number) => q === questionId)) {
    assignmentInfo.questions.push(questionId);
  } else {
    removeQuestion(questionId);
  }
}

function removeQuestion(questionId: number) {
  // prettier-ignore
  const index = assignmentInfo.questions.findIndex((q: number) => q === questionId);
  if (index !== -1) {
    assignmentInfo.questions.splice(index, 1);
  }
}

async function handleAssignmentSubmit(){
  if (assignmentInfo.questions.length === 0) {
    createResult.error = "Please select at least one question.";
    return;
  }
  if (!assignmentInfo.timed) {
    assignmentInfo.time_limit = 0;
  }
  else if (assignmentInfo.timed && assignmentInfo.time_limit <= 0) {
    createResult.error = "Please provide a valid time limit.";
    return;
  }
  const { error } = await tryCatch(
    submitCreateAssignment(
      assignmentInfo.name,
      assignmentInfo.timed,
      assignmentInfo.time_limit,
      assignmentInfo.questions
    )
  );
  createResult.isLoading = false;

  if (error) {
    createResult.error = error.message;
    console.error(error);
  } else {
    createResult.success = true;
    router.push("/teacher/dashboard");
  }
}

async function handleQuestionSubmit(){
  if (!questionInfo.name || !questionInfo.question_type) {
    createResult.error = "Please fill in all fields.";
    return;
  }
  const { error } = await tryCatch(
    submitCreateQuestion(
      questionInfo.question_type,
      questionInfo.name
    )
  );
  if (error) {
    createResult.error = error.message;
    console.error(error);
  } else {
    createResult.success = true;
    questions.value = await requestEndpoint<Question[]>(`/questions/`);
  }
}

</script>