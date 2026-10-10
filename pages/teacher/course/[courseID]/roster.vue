<template>
  <div class="flex w-full flex-col items-center px-4 py-12 sm:px-8">
    <div class="relative flex w-full max-w-6xl flex-col items-center justify-center gap-8">
      <!-- Header & Breadcrumb Navigation -->
      <div class="flex w-full flex-col gap-4 border-b border-neutral-300 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-600">
        <div>
          <h1 class="text-3xl font-bold">Class Roster & Assignment Stats</h1>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            Manage enrolled students and review assignment completion and accuracy.
          </p>
        </div>
        <button
          class="rounded-xl bg-green-accent px-4 py-2 font-medium text-white hover:brightness-110"
          type="button"
          @click="router.push(`/teacher/course/${route.params.courseID}`)"
        >
          Return To Class Page
        </button>
      </div>

      <!-- Section 1: Enrolled Students Roster -->
      <div class="flex w-full flex-col gap-3 rounded-2xl border border-neutral-300 bg-body p-6 shadow-sm dark:border-neutral-700">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold">Enrolled Students ({{ students.length }})</h2>
        </div>

        <div class="relative flex w-full items-center justify-center overflow-x-auto rounded-b-box rounded-se-box">
          <table class="table w-full">
            <thead>
              <tr class="border-b border-neutral-300 dark:border-neutral-600">
                <th class="py-3 pl-6 text-start font-bold">First Name</th>
                <th class="py-3 pl-6 text-start font-bold">Last Name</th>
                <th class="py-3 pl-6 text-start font-bold">Email</th>
                <th class="py-3 text-center font-bold">Remove Student</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="student in students"
                :key="student.id"
                class="border-t border-neutral-300 dark:border-neutral-600"
              >
                <td class="py-3 pl-6">{{ student.firstName }}</td>
                <td class="py-3 pl-6">{{ student.lastName }}</td>
                <td class="py-3 pl-6 text-neutral-500">{{ student.email }}</td>
                <td class="flex items-center justify-center py-3">
                  <button
                    class="btn btn-sm transition-200 flex h-8 items-center justify-center rounded-xl hover:brightness-125"
                    type="button"
                    title="Remove student from class"
                    @click="handleConfirmDelete(student)"
                  >
                    <img
                      src="/ui/close.svg"
                      aria-hidden="true"
                      draggable="false"
                      class="size-5 dark:invert"
                    />
                  </button>
                </td>
              </tr>
              <tr v-if="students.length === 0" class="border-t border-neutral-300 dark:border-neutral-600">
                <td colspan="4" class="px-10 py-6 text-center text-neutral-500">
                  No students enrolled in this class yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 2: Assignment Performance & Statistics -->
      <div class="flex w-full flex-col gap-4 rounded-2xl border border-neutral-300 bg-body p-6 shadow-sm dark:border-neutral-700">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-xl font-bold">Assignment Performance & Stats</h2>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">
              Select an assignment to inspect individual student results and class-wide statistics.
            </p>
          </div>

          <div v-if="assignments.length > 0" class="flex flex-wrap items-center gap-3">
            <button
              class="du-btn du-btn-md rounded-xl bg-green-accent text-white hover:brightness-110"
              type="button"
              :disabled="!selectedAssignment"
              @click="showStatsModal = true"
            >
              View Class Results
            </button>
          </div>
        </div>

        <!-- Assignment Selector & Context Badges -->
        <div
          v-if="assignments.length > 0"
          class="flex flex-col gap-3 rounded-xl border border-neutral-300 bg-neutral-200/50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50"
        >
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <label for="assignment-select" class="text-sm font-semibold">Select Assignment:</label>
              <select
                id="assignment-select"
                v-model="selectedAssignmentId"
                class="du-select bg-neutral-200 dark:bg-neutral-700"
              >
                <option v-for="a in assignments" :key="a.id" :value="a.id">
                  {{ a.name }} (ID: {{ a.id }})
                </option>
              </select>
            </div>

            <div v-if="selectedAssignment" class="flex flex-wrap items-center gap-2 text-xs">
              <span class="rounded-lg bg-neutral-200 px-2.5 py-1 font-medium dark:bg-neutral-700">
                Questions: {{ selectedAssignment.questions?.length ?? 0 }}
              </span>
              <span
                v-if="selectedAssignment.timed"
                class="rounded-lg bg-neutral-200 px-2.5 py-1 font-medium dark:bg-neutral-700"
              >
                Timed: {{ selectedAssignment.timeLimit }} min
              </span>
              <span class="rounded-lg bg-neutral-200 px-2.5 py-1 font-medium dark:bg-neutral-700">
                Submissions: {{ classStats.submittedCount }} / {{ students.length }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center p-8 text-center text-neutral-500">
          <p>No assignments found for this class.</p>
        </div>

        <!-- Student Assignment Results Table -->
        <div v-if="selectedAssignment" class="relative flex w-full items-center justify-center overflow-x-auto rounded-b-box rounded-se-box">
          <table class="table w-full">
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
              <tr
                v-for="res in studentResults"
                :key="res.studentId"
                class="border-t border-neutral-300 dark:border-neutral-600"
              >
                <td class="py-3 pl-6 font-medium">
                  {{ res.firstName }} {{ res.lastName }}
                </td>
                <td class="py-3 text-center">
                  <span
                    v-if="res.hasSubmitted"
                    class="rounded-full bg-green-accent/20 px-3 py-1 text-xs font-semibold text-green-800 dark:text-green-300"
                  >
                    Completed
                  </span>
                  <span
                    v-else
                    class="rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"
                  >
                    Not Completed
                  </span>
                </td>
                <td class="py-3 text-center">
                  <span v-if="res.hasSubmitted" class="font-semibold">
                    {{ res.correctCount }} / {{ res.totalQuestions }}
                  </span>
                  <span v-else class="text-neutral-400">—</span>
                </td>
                <td class="py-3 text-center">
                  <span v-if="res.hasSubmitted" class="font-semibold">
                    {{ res.totalQuestions > 0 ? Math.round((res.correctCount / res.totalQuestions) * 100) : 0 }}%
                  </span>
                  <span v-else class="text-neutral-400">—</span>
                </td>
                <td class="py-3 text-center text-xs text-neutral-500">
                  <span v-if="res.hasSubmitted && res.pendingCount > 0" class="text-amber-600 dark:text-amber-400">
                    {{ res.pendingCount }} non-MCQ pending review
                  </span>
                  <span v-else-if="res.hasSubmitted" class="text-green-600 dark:text-green-400">
                    Graded
                  </span>
                  <span v-else>
                    Awaiting submission
                  </span>
                </td>
              </tr>
              <tr v-if="studentResults.length === 0" class="border-t border-neutral-300 dark:border-neutral-600">
                <td colspan="5" class="px-6 py-6 text-center text-neutral-500">
                  No students in this class.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Student Confirmation Modal -->
  <FullScreenModal :show-modal="showModal" transition-name="scale-75" @close="showModal = false">
    <h2 class="mb-2 text-xl font-semibold">Confirm Student Removal</h2>
    <p class="mb-4 text-neutral-600 dark:text-neutral-400">
      Are you sure you want to remove this student from the class?
    </p>
    <div class="flex w-full items-center justify-center gap-2">
      <button
        class="du-btn du-btn-md bg-green-accent text-white"
        type="button"
        @click="showModal = false"
      >
        Cancel
      </button>
      <button
        class="du-btn du-btn-md bg-green-accent text-white"
        type="button"
        @click="removeStudent(studentToDelete)"
      >
        OK
      </button>
    </div>
  </FullScreenModal>

  <!-- Class Results Summary Modal with Pie Chart -->
  <FullScreenModal
    :show-modal="showStatsModal"
    transition-name="scale-75"
    custom-width-class="w-80 xs:w-96 sm:w-125"
    @close="showStatsModal = false"
  >
    <div class="flex w-full flex-col items-center justify-center gap-4 text-center">
      <div>
        <h2 class="text-xl font-semibold">Class Results Summary</h2>
        <p v-if="selectedAssignment" class="text-sm text-neutral-500 dark:text-neutral-400">
          {{ selectedAssignment.name }}
        </p>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        <div class="flex flex-col items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 p-3 dark:border-neutral-700 dark:bg-neutral-800">
          <span class="text-xs text-neutral-500">Submissions</span>
          <span class="text-xl font-bold">
            {{ classStats.submittedCount }} / {{ classStats.totalStudents }}
          </span>
        </div>
        <div class="flex flex-col items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 p-3 dark:border-neutral-700 dark:bg-neutral-800">
          <span class="text-xs text-neutral-500">Class Accuracy</span>
          <span class="text-xl font-bold text-green-600 dark:text-green-400">
            {{ classStats.accuracyPercentage }}%
          </span>
        </div>
        <div class="flex flex-col items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 p-3 dark:border-neutral-700 dark:bg-neutral-800">
          <span class="text-xs text-neutral-500">Correct Answers</span>
          <span class="text-xl font-bold text-green-600 dark:text-green-400">
            {{ classStats.totalCorrect }}
          </span>
        </div>
        <div class="flex flex-col items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 p-3 dark:border-neutral-700 dark:bg-neutral-800">
          <span class="text-xs text-neutral-500">Incorrect Answers</span>
          <span class="text-xl font-bold text-red-600 dark:text-red-400">
            {{ classStats.totalIncorrect }}
          </span>
        </div>
      </div>

      <!-- Pie Chart Visual (Conic Gradient) -->
      <div class="flex flex-col items-center justify-center gap-4 py-2">
        <div
          class="size-44 rounded-full border border-neutral-300 shadow-inner dark:border-neutral-600"
          :style="pieChartStyle"
          role="img"
          aria-label="Class performance breakdown pie chart"
        ></div>

        <!-- Legend -->
        <div class="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
          <div class="flex items-center gap-1.5">
            <span class="size-3 rounded-full bg-green-500"></span>
            <span>Correct ({{ classStats.totalCorrect }})</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="size-3 rounded-full bg-red-500"></span>
            <span>Incorrect ({{ classStats.totalIncorrect }})</span>
          </div>
          <div v-if="classStats.totalPending > 0" class="flex items-center gap-1.5">
            <span class="size-3 rounded-full bg-yellow-500"></span>
            <span>Pending Review ({{ classStats.totalPending }})</span>
          </div>
        </div>
      </div>

      <div class="mt-2 flex w-full justify-end gap-2">
        <button
          class="du-btn du-btn-md"
          type="button"
          @click="showStatsModal = false"
        >
          Close
        </button>
      </div>
    </div>
  </FullScreenModal>
</template>

<script setup lang="ts">
import type {
  AssignmentInstance,
  ClassAssignmentStats,
  StudentAssignmentResult,
  TeacherAssignment
} from "~/utils/types/assignments";
import {
  calculateClassStats,
  gradeStudentAttempt
} from "~/utils/functions/autoGrade";

definePageMeta({
  layout: "teacher",
  middleware: "teacher-get-course",
  requiresAuth: true,
  redirectIfAuth: false,
  allowedRoles: ["teacher"]
});

const route = useRoute();
const router = useRouter();
const courseID = route.params.courseID as string;

const showModal = ref(false);
const showStatsModal = ref(false);

interface Student {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: number;
}

const students = ref<Student[]>([]);
const studentToDelete = ref<Student | null>(null);

const assignments = ref<TeacherAssignment[]>([]);
const selectedAssignmentId = ref<number | null>(null);

async function getStudents() {
  const { data, error } = await tryRequestEndpoint<Student[]>(`courses/${courseID}/students/`);
  if (error) return console.error("Failed to fetch students:", error);
  students.value = data || [];
}

async function getAssignments() {
  const { data, error } = await tryRequestEndpoint<TeacherAssignment[]>(`courses/${courseID}/assignments/`);
  if (!error && Array.isArray(data)) {
    assignments.value = data;
    if (data.length > 0 && selectedAssignmentId.value === null) {
      selectedAssignmentId.value = data[0].id;
    }
  } else {
    const { data: courseData } = await tryRequestEndpoint<{ assignments?: TeacherAssignment[] }>(`courses/${courseID}/`);
    if (courseData?.assignments) {
      assignments.value = courseData.assignments;
      if (courseData.assignments.length > 0 && selectedAssignmentId.value === null) {
        selectedAssignmentId.value = courseData.assignments[0].id;
      }
    }
  }
}

const selectedAssignment = computed<TeacherAssignment | undefined>(() => {
  return assignments.value.find((a) => a.id === selectedAssignmentId.value);
});

const studentResults = computed<StudentAssignmentResult[]>(() => {
  if (!selectedAssignment.value) return [];
  const assignment = selectedAssignment.value;
  const questions = assignment.questions || [];
  const instances = (assignment.assignmentInstances as AssignmentInstance[]) || [];

  return students.value.map((student) => {
    const instance = instances.find((inst) => inst.student === student.id);
    const hasSubmitted = !!(instance && instance.submitted);

    let correctCount = 0;
    let incorrectCount = 0;
    let pendingCount = 0;

    if (hasSubmitted && instance) {
      const graded = gradeStudentAttempt(questions, instance.questionInstances || []);
      correctCount = graded.correctCount;
      incorrectCount = graded.incorrectCount;
      pendingCount = graded.pendingCount;
    }

    return {
      studentId: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      hasSubmitted,
      correctCount,
      incorrectCount,
      pendingCount,
      totalQuestions: questions.length
    };
  });
});

const classStats = computed<ClassAssignmentStats>(() => {
  return calculateClassStats(studentResults.value);
});

const pieChartStyle = computed(() => {
  const stats = classStats.value;
  const total = stats.totalCorrect + stats.totalIncorrect + stats.totalPending;
  if (total === 0) {
    return {
      background: "#9ca3af"
    };
  }

  const correctPct = (stats.totalCorrect / total) * 100;
  const incorrectPct = (stats.totalIncorrect / total) * 100;

  const correctEnd = correctPct;
  const incorrectEnd = correctEnd + incorrectPct;

  return {
    background: `conic-gradient(#22c55e 0% ${correctEnd}%, #ef4444 ${correctEnd}% ${incorrectEnd}%, #eab308 ${incorrectEnd}% 100%)`
  };
});

function handleConfirmDelete(student: Student) {
  showModal.value = true;
  studentToDelete.value = student;
}

async function removeStudent(student: Student | null) {
  if (!student) return;
  const { error } = await tryRequestEndpoint(
    `courses/${courseID}/remove_student/`,
    "DELETE",
    { student: student.id }
  );
  if (error) {
    window.alert(error);
    return console.error("Failed to delete student:", error);
  }
  students.value = students.value.filter((s) => s.id !== student.id);
  studentToDelete.value = null;
  showModal.value = false;
}

onMounted(() => {
  void getStudents();
  void getAssignments();
});
</script>

<style scoped></style>