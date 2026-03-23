<template>
  <div class="-m-4 flex w-auto flex-col px-4 lg:h-[calc(100vh-4rem)] lg:max-h-[calc(100vh-4rem)] lg:flex-row lg:overflow-y-hidden">
    <form class="flex h-full max-h-full w-full shrink-0 flex-col gap-2 p-4 lg:w-[35rem] lg:overflow-y-scroll" @submit.prevent="handleSubmit">
      <h1 v-if="!isPrinting" class="text-2xl font-bold">Post Assignment</h1>
      <h1 v-else class="text-2xl font-bold">Print Worksheet</h1>

      <fieldset v-if="!isPrinting">
        <legend class="fo-label fo-label-text shrink-0 font-bold text-black dark:text-white">For <span title="Required" class="text-red-500">*</span></legend>
        <div class="max-h-36 space-y-1 overflow-y-auto rounded-lg border border-neutral-400 bg-white p-3 dark:border-neutral-600 dark:bg-neutral-900">
          <div v-for="course in teacherCourses" :key="course.id" class="flex items-center gap-2">
            <input
              :id="'course-' + course.id"
              class="du-checkbox border-neutral-400 dark:bg-neutral-900"
              type="checkbox"
              :disabled="course.id === initialCourse"
              :checked="course.id === initialCourse"
              @input="(e) => toggleCourse(course.id, e)"
            />
            <label
              class="fo-label w-full text-black dark:text-white"
              :class="course.id === initialCourse ? 'cursor-not-allowed text-neutral-600 dark:text-neutral-300' : 'cursor-pointer'"
              :for="'course-' + course.id"
            >
              {{ course.name }}
            </label>
          </div>
        </div>
      </fieldset>

      <div class="flex w-full items-center justify-center gap-3">
        <TeacherAssignmentCreateInput v-if="!isPrinting" v-model="assignmentInfo.name" type="text" label="Name" placeholder="Unit 3 Review" required />
        <TeacherAssignmentCreateInput v-model.number="assignmentInfo.numOfQuestions" type="number" label="Number of Questions" placeholder="10" required min="0" :warn="warn" />
      </div>

      <div v-if="!isPrinting" class="flex w-full items-center justify-center gap-3">
        <TeacherAssignmentCreateInput v-model="assignmentInfo.dueDate.date" class="w-[45%]" type="date" label="Due" required :min="currentDateISO" />
        <TeacherAssignmentCreateInput v-model="assignmentInfo.dueDate.time" class="w-[45%]" type="time" required />
      </div>

      <div v-if="!isPrinting" class="flex w-full items-center justify-center gap-3">
        <TeacherAssignmentCreateInput v-model.number="assignmentInfo.timeAllotted" type="number" min="0" label="Time limit (minutes)" placeholder="Unlimited" />
        <TeacherAssignmentCreateInput
          v-model.number="assignmentInfo.attemptsAllowed"
          type="number"
          min="0"
          step="1"
          label="Attempts per question"
        />
      </div>

      <div class="mb-2 flex w-full grow flex-col">
        <p class="fo-label fo-label-text pointer-events-none flex-none shrink-0 font-bold text-black dark:text-white">
          Assignments Added <span title="Required" class="text-red-500">*</span>
        </p>

        <div class="flex h-0 max-h-full min-h-60 w-full grow items-center justify-center rounded-lg border border-neutral-400 bg-white hover:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:hover:border-neutral-300/50">
          <div v-if="!assignmentInfo.questions.length" class="mb-6 flex h-fit flex-col items-center justify-center">
            <img class="pointer-events-none size-40 select-none opacity-65 dark:invert" src="/ui/plus.svg" aria-hidden="true" />
            <p class="text-center text-xl font-bold text-neutral-500 dark:text-white">No Assignments Selected</p>
            <p class="w-3/4 text-center text-sm font-medium text-neutral-400">Click assignments from the bank to add them here.</p>
          </div>

          <div v-else class="flex h-full w-full flex-col items-start justify-start gap-4 overflow-y-scroll pl-4 pr-2 pt-4">
            <ol class="flex w-full flex-col items-start justify-start gap-2">
              <li v-for="(assignment, index) in assignmentInfo.questions" :key="assignment.questionId" class="flex w-full flex-col gap-1">
                <div class="flex w-full items-center justify-between gap-3">
                  <span>{{ index + 1 }}.</span>
                  <p class="w-60 grow overflow-hidden overflow-ellipsis text-nowrap font-bold text-black dark:text-white">{{ assignment.name }}</p>
                  <div class="flex items-center gap-2">
                    <button class="text-red-500" @click="removeAssignment(assignment)">Remove</button>
                    <button class="text-neutral-500 dark:text-neutral-300" @click="assignment.open = !assignment.open">
                      <img :src="assignment.open ? '/ui/chevron-up.svg' : '/ui/chevron-down.svg'" class="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <ul v-if="assignment.open" class="ml-8 flex flex-col gap-1">
                  <li v-for="q in assignment.questions" :key="q" class="text-sm text-black dark:text-white">Question ID: {{ q }}</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div class="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:gap-2 lg:px-10" :class="isPrinting ? 'justify-end' : 'justify-between'">
        <div v-if="!isPrinting" class="flex items-center gap-1">
          <input id="late-submissions" v-model="assignmentInfo.lateSubmissions" type="checkbox" class="du-checkbox border-neutral-400 dark:bg-neutral-900" />
          <label class="fo-label fo-label-text shrink-0 translate-y-0.5 text-base text-black dark:text-white" for="late-submissions">Allow late submissions</label>
        </div>
        <div
          :data-tip="!courseIds.length ? 'Select at least one course' : 'You must have at least one question or topic'"
          :class="{ 'du-tooltip': !allowedToSubmit }"
        >
          <button
            class="w-full grow rounded-lg border px-8 py-1.5 text-xl font-medium text-black lg:w-fit"
            :class="
              allowedToSubmit
                ? 'border-green-500 bg-green-500 hover:brightness-110'
                : 'cursor-not-allowed border-none border-neutral-300 bg-neutral-200 p-0 hover:border-neutral-400 dark:bg-neutral-600/50'
            "
            type="submit"
          >
            <span v-if="createAssignmentResult.isLoading" class="loading du-loading du-loading-sm mt-1"></span>
            <span v-else>{{ isPrinting ? "Print" : "Post" }}</span>
          </button>
        </div>
      </div>
    </form>

    <div class="flex w-full flex-col border-neutral-600/50 px-4 lg:-mr-4 lg:max-h-full lg:overflow-y-auto lg:border-l dark:border-neutral-300/50">
      <h2 class="text-2xl font-bold mb-4 mt-4 lg:mt-0">Assignment Bank</h2>
      <div class="flex flex-col gap-2">
        <TeacherAssignmentBankCard
          v-for="assignment in assignments"
          :key="assignment.id"
          :assignment="assignment"
          @add="addAssignment"
        />
      </div>
    </div>

    <FullScreenModal transition-name="scale-75" :show-modal="createAssignmentResult.success" @close="createAssignmentResult.success = false">
      <p>Assignment successfully created!</p>
      <TeacherCourseActionButton type="button" img="/ui/close.svg" text="Close" @on-click="createAssignmentResult.success = false" />
    </FullScreenModal>
    <!-- <LazyTeacherAssignmentPrintAssignment :question-ids="assignmentInfo.printQuestionIds" /> -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "teacher",
  requiresAuth: true,
  redirectIfAuth: false
});

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { showSideMenu, teacherCourses } = storeToRefs(userStore);

const currentDateISO = (() => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
})();
let initialCourse = Number(route.query.course);
const courseIds = reactive<number[]>([]);
if (initialCourse) courseIds.push(initialCourse);

const isPrinting = ref(false);
watch(
  () => route.query,
  () => {
    isPrinting.value = route.query.print === "true";

    if (!route.query.course) {
      courseIds.length = 0;
      initialCourse = NaN;
    }
  },
  { immediate: true }
);

const assignmentInfo = reactive({
  name: "",
  dueDate: { date: currentDateISO, time: "23:59" },
  questions: ref<any[]>([]),
  printQuestionIds: ref<number[]>([]),
  numOfQuestions: ref<number>(),
  lateSubmissions: false,
  timeAllotted: ref<number>(),
  attemptsAllowed: ref<number>()
});

const warn = computed(() => null);

const allowedToSubmit = computed(() =>
  courseIds.length > 0 &&
  assignmentInfo.questions.length > 0
);

const createAssignmentResult = reactive({ isLoading: false, success: false, error: "" });
const assignments = ref<TeacherAssignmentTemplate[]>([]);

onMounted(async () => {
  try {
    const data = await requestEndpoint<TeacherAssignmentTemplate[]>("assignment-templates/");
    assignments.value = data.map(a => ({
      ...a,
      open: false
    }));
  } catch (err) {
    console.error("Failed to fetch assignments:", err);
  }
});

function addAssignment(assignment: any) {
  if (!assignmentInfo.questions.find(q => q.questionId === assignment.id)) {
    assignmentInfo.questions.push({
      questionId: assignment.id,
      name: assignment.name,
      questions: assignment.questions,
      open: false
    });
  }
}
function removeAssignment(assignment: any) {
  assignmentInfo.questions = assignmentInfo.questions.filter(q => q.questionId !== assignment.questionId);
}

function toggleCourse(courseID: number, event: Event) {
  if (!(event.target as HTMLInputElement).checked) {
    const index = courseIds.indexOf(courseID);
    if (index !== -1) courseIds.splice(index, 1);
  } else {
    courseIds.push(courseID);
  }
}

async function handleSubmit() {
  if (!allowedToSubmit.value) return;

  try {
    createAssignmentResult.isLoading = true;

    const questions = assignmentInfo.questions.map(q => q.questionId);

    for (const course of courseIds) {
      for (const template of assignmentInfo.questions) {
        await submitCreateAssignmentPost(
          template.name,
          true,
          assignmentInfo.timeAllotted || 0,
          questions,
          `${assignmentInfo.dueDate.date}T${assignmentInfo.dueDate.time}:00Z`,
          course
        );
      }
    }

    createAssignmentResult.success = true;
  } catch (err: any) {
    console.error(err);
    createAssignmentResult.error = err?.message || "Failed to create assignment";
  }

  createAssignmentResult.isLoading = false;
}
</script>

<style scoped></style>
