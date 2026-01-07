<template> 
    <div class="-m-4 flex w-auto flex-col px-4 lg:h-[calc(100vh-4rem)] lg:max-h-[calc(100vh-4rem)] lg:flex-row lg:overflow-y-hidden">
        <form class="flex h-full max-h-full w-full shrink-0 flex-col gap-2 p-4 lg:w-[35rem] lg:overflow-y-scroll">
        <h1 class="text-2xl font-bold mt-10 mb-5">Create Assignment</h1>
        <div class="flex flex-col gap-4">
            <label class="flex flex-col gap-1">
                <span class="font-medium">Assignment Name</span>
                <input 
                type="text" 
                class="du-input w-full border-neutral-400 bg-neutral-200 text-black hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-300 dark:hover:border-neutral-300/50" 
                placeholder="Enter assignment name" 
                required
                />
            </label>
            <!-- <label class="flex flex-col gap-1">
                <span class="font-medium">Assignment Topic</span>
                <input 
                type="text" 
                class="du-input w-full border-neutral-400 bg-neutral-200 text-black hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-300 dark:hover:border-neutral-300/50" 
                placeholder="Grammar Rules" 
                required
                />
            </label> -->
            <label class="flex flex-col gap-1">
                <span class="font-medium">Number of Questions</span>
                <input 
                type="number" 
                class="du-input w-full border-neutral-400 bg-neutral-200 text-black hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-300 dark:hover:border-neutral-300/50" 
                placeholder="10" 
                required 
                />
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
                <span class="font-medium">Timed Assignment</span>
                <input 
                type="checkbox" 
                class="checkbox checkbox-primary"
                required
                />
            </label>
            <label class="flex flex-col gap-1">
                <span class="font-medium">Time Limit</span>
                <input 
                type="number" 
                class="du-input w-full border-neutral-400 bg-neutral-200 text-black hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-300 dark:hover:border-neutral-300/50" 
                placeholder="60 (in minutes)" 
                required 
                />
            </label>
            <div class="mb-2 flex w-full grow flex-col">
        <p class="fo-label fo-label-text pointer-events-none flex-none shrink-0 font-bold text-black dark:text-white">Questions and Topics <span title="Required" class="text-red-500">*</span></p>
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
<!--               <li v-for="(question, index) in assignmentInfo.questions" :key="question.questionId" class="flex w-full items-center justify-start gap-3">
 -->               <li  class="flex w-full items-center justify-start gap-3">

                <span>{{ 1 }}.</span>
                </li>  
              </ol>
                <div class="flex items-center justify-center gap-2">
                  </div>
                  </div>
                </div>
          </div>
        </div>
         <button type="submit" @submit="handleSubmit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 mt-15">Create Assignment</button>
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

const assignmentInfo = reactive({
  name: "",
  timed: ref<boolean>(false),
    /** In minutes */
  time_limit: ref<number>(),
  //questions: ref<CreateAssignmentQuestion[]>([]),
  questions: ref<number[]>([]),
});

const createAssignmentResult = reactive({
  isLoading: false,
  error: "",
  success: false
});


async function handleSubmit(){
  const { error } = await tryCatch(
    submitCreateAssignment(
      name,
      timed,
      time_limit,
      questions
    )
  );
  createAssignmentResult.isLoading = false;

  if (error) {
    createAssignmentResult.error = error.message;
    console.error(error);
  } else {
    createAssignmentResult.success = true;
    watch(createAssignmentResult, () => void router.push("/teacher/post-assignment"));
  }
}
</script>