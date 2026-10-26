<template>
  <div class="flex w-full flex-col items-center px-4 py-12 sm:px-8">
    <div class="relative flex w-full max-w-6xl flex-col items-center justify-center gap-8">
      <div class="flex w-full flex-col gap-4 border-b border-neutral-300 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-600">
        <div>
          <h1 class="text-3xl font-bold">Class Roster &amp; Assignment Stats</h1>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            Manage enrolled students and review assignment completion and accuracy.
          </p>
        </div>
        <button class="rounded-xl bg-green-accent px-4 py-2 font-medium text-white hover:brightness-110" type="button" @click="router.push(`/teacher/course/${courseID}`)">
          Return To Class Page
        </button>
      </div>

      <TeacherCourseClassRosterTable :students="students" @remove="handleConfirmDelete" />

      <TeacherCourseAssignmentStatsPanel
        :assignments="assignments"
        :selected-assignment-id="selectedAssignmentId"
        :selected-assignment="selectedAssignment"
        :student-results="studentResults"
        :stats="classStats"
        :student-count="students.length"
        @select-assignment="selectAssignment"
        @view-results="showStatsModal = true"
      />
    </div>
  </div>

  <FullScreenModal :show-modal="showModal" transition-name="scale-75" @close="showModal = false">
    <h2 class="mb-2 text-xl font-semibold">Confirm Student Removal</h2>
    <p class="mb-4 text-neutral-600 dark:text-neutral-400">Are you sure you want to remove this student from the class?</p>
    <div class="flex w-full items-center justify-center gap-2">
      <button class="du-btn du-btn-md bg-green-accent text-white" type="button" @click="showModal = false">Cancel</button>
      <button class="du-btn du-btn-md bg-green-accent text-white" type="button" @click="removeStudent(studentToDelete)">OK</button>
    </div>
  </FullScreenModal>

  <TeacherCourseClassResultsModal
    :show-modal="showStatsModal"
    :selected-assignment="selectedAssignment"
    :stats="classStats"
    :pie-chart-style="pieChartStyle"
    @close="showStatsModal = false"
  />
</template>

<script setup lang="ts">
import type { TeacherAssignment } from "~/utils/types/assignments";
import type { TeacherStudent } from "~/utils/types/teacherStats";
import { getClassStats, getPieChartStyle, buildStudentResults } from "~/utils/functions/teacherStats";

definePageMeta({
  layout: "teacher",
  middleware: "teacher-get-course",
  requiresAuth: true,
  redirectIfAuth: false,
  allowedRoles: ["teacher"],
});

const route = useRoute();
const router = useRouter();
const courseID = (Array.isArray(route.params.courseID) ? route.params.courseID[0] : route.params.courseID) as string;
const showModal = ref(false);
const showStatsModal = ref(false);
const students = ref<TeacherStudent[]>([]);
const studentToDelete = ref<TeacherStudent | null>(null);
const assignments = ref<TeacherAssignment[]>([]);
const selectedAssignmentId = ref<number | null>(null);

const selectedAssignment = computed(() => assignments.value.find((assignment) => assignment.id === selectedAssignmentId.value));
const studentResults = computed(() => buildStudentResults(students.value, selectedAssignment.value));
const classStats = computed(() => getClassStats(studentResults.value));
const pieChartStyle = computed(() => getPieChartStyle(classStats.value));

async function getStudents() {
  const { data, error } = await tryRequestEndpoint<TeacherStudent[]>(`courses/${courseID}/students/`);
  if (error) return console.error("Failed to fetch students:", error);
  students.value = data || [];
}

function syncSelectedAssignmentFromQuery() {
  if (assignments.value.length === 0) {
    selectedAssignmentId.value = null;
    return;
  }

  const queryValue = Array.isArray(route.query.assignment) ? route.query.assignment[0] : route.query.assignment;
  const queryId = queryValue ? Number(queryValue) : undefined;
  const selectedId = assignments.value.some((assignment) => assignment.id === queryId)
    ? queryId
    : assignments.value[0].id;

  selectedAssignmentId.value = selectedId;
  if (String(queryId) !== String(selectedId)) {
    void router.replace({ query: { ...route.query, assignment: String(selectedId) } });
  }
}

async function getAssignments() {
  const { data, error } = await tryRequestEndpoint<TeacherAssignment[]>(`courses/${courseID}/assignments/`);
  if (!error && Array.isArray(data)) {
    assignments.value = data;
  } else {
    const { data: courseData } = await tryRequestEndpoint<{ assignments?: TeacherAssignment[] }>(`courses/${courseID}/`);
    assignments.value = courseData?.assignments || [];
  }
  syncSelectedAssignmentFromQuery();
}

function selectAssignment(assignmentId: number) {
  selectedAssignmentId.value = assignmentId;
}

watch(selectedAssignmentId, (assignmentId) => {
  if (assignmentId === null || String(assignmentId) === String(route.query.assignment)) return;
  void router.replace({ query: { ...route.query, assignment: String(assignmentId) } });
});

watch(() => route.query.assignment, (value) => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const assignmentId = rawValue ? Number(rawValue) : undefined;
  if (assignmentId && assignments.value.some((assignment) => assignment.id === assignmentId)) {
    selectedAssignmentId.value = assignmentId;
  }
});

function handleConfirmDelete(student: TeacherStudent) {
  showModal.value = true;
  studentToDelete.value = student;
}

async function removeStudent(student: TeacherStudent | null) {
  if (!student) return;
  const { error } = await tryRequestEndpoint(`courses/${courseID}/remove_student/`, "DELETE", { student: student.id });
  if (error) {
    window.alert(error);
    console.error("Failed to delete student:", error);
    return;
  }
  students.value = students.value.filter((currentStudent) => currentStudent.id !== student.id);
  studentToDelete.value = null;
  showModal.value = false;
}

onMounted(() => {
  void getStudents();
  void getAssignments();
});
</script>
