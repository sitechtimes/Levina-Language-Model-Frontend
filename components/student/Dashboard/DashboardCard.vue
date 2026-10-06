<template>
  <NuxtLink
    :to="`/student/course/${course.id}`"
    class="flex w-115 flex-col items-center justify-center overflow-hidden rounded-xl border border-neutral-300 bg-body hover:border-neutral-600/50 hover:shadow-lg hover:transition dark:border-neutral-600 dark:hover:border-neutral-300/50"
  >
    <!-- course information -->
    <div class="flex h-24 w-full flex-col items-center justify-end p-2" :style="{ backgroundColor: classColors[generalClassType] }">
      <h2 :title="course.name" class="w-72 overflow-hidden overflow-ellipsis text-nowrap text-center text-2xl font-semibold">{{ course.name }}</h2>
      <p class="text-sm">Period {{ course.period }}</p>
      <p>{{ course.teacher }}</p>
    </div>

    <div class="flex h-full min-h-36 w-full flex-col items-center justify-start p-2">
      <h3 class="pb-2 pt-1 text-xl font-bold">Assignments</h3>

       <div v-if="assignments.length > 0" class="flex h-full w-full flex-wrap items-start justify-around gap-3 px-3 pb-3">
        <NuxtLink
          v-for="assignment in assignments"
          :key="assignment.id"
          :to="`/student/course/${course.id}/${assignment.id}?q=${Math.min(assignment.questionsCompleted, assignment.assignment.numQuestions)}`"
          class="flex h-full w-full flex-col items-center justify-center rounded-xl border border-neutral-300 p-3 hover:shadow-lg hover:transition dark:border-neutral-600 dark:hover:border-neutral-300/50"
          @click.stop
        >
          <!-- <p class="text-center text-sm text-neutral-700 dark:text-neutral-300" :title="assignment.assignment.dueDate.toLocaleString()">
            Due {{ formatDate(assignment.assignment.dueDate, currentTime) }}
          </p> -->

          <div class="flex h-full w-full flex-col items-center justify-start gap-3">
            <p class="w-64 overflow-hidden overflow-ellipsis text-nowrap text-center text-xl font-semibold">{{ assignment.assignment.name }}</p>

            <div class="flex w-full items-center justify-between gap-2">
              <span class="shrink-0">Progress: {{ assignment.questionsCompleted }}/{{ assignment.assignment.numQuestions }}</span>
              <div class="flex h-4 w-full items-start overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-600">
                <div class="h-full" :style="{ width: (assignment.questionsCompleted / assignment.assignment.numQuestions) * 100 + '%', backgroundColor: classColors[generalClassType] }"></div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <p v-else>No assignments</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{ course: StudentCourse }>();
const currentTime = new Date();

// PROBLEM: data format is not matching w backend data
const assignments = computed(() =>
  [...props.course.assignments]
    .filter((assignment) => !assignment.dateSubmitted && assignment.dueDate >= currentTime)
    .sort((a, b) => a.assignment.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 2)
); 

//what the type is:
/* interface Course {
  readonly id: number;
  readonly name: string;
  readonly teacher: string;
  readonly period: number;
  readonly classType: string;
  assignmentsFetched: boolean;
  assignment: StudentAssignment[];
}
export interface StudentAssignment extends Assignment {
  dateSubmitted: Date | null;
  questionsCompleted: number;
  questionsCorrect: number;
  readonly assignment: {
    readonly attemptsAllowed: number;
    readonly name: string;
    readonly numQuestions: number;
    readonly lateSubmissions: boolean;
    dueDate: Date;
    dateAssigned: Date;
    readonly isStatic: boolean;
    readonly course?: {
      readonly id: number;
      readonly name: string;
  };
  };
}
 */

// what we're getting:
/* [
  {
    "id": 1,
    "name": "Test Course",
    "period": 1,
    "class_type": "Freshman Russian",
    "join_code": "",
    "teachers": [
      {
        "id": 4,
        "email": "teacher@example.com",
        "first_name": "Teacher",
        "last_name": "User",
        "user_type": 1
      }
    ],
    "students": [
      1,
      2,
      3
    ],
    "assignments": [
      {
        "id": 1,
        "name": "Test Assignment",
        "due_date": "2025-12-15T23:59:00Z",
        "is_active": false,
        "timed": true,
        "time_limit": 3600,
        "teacher": 4,
        "course": 1,
        "date_assigned": "2026-09-16T15:03:12.810770Z",
        "assignment_instances": [
          {
            "id": 1,
            "assignment": 1,
            "student": 1,
            "submitted": false,
            "time_used": 0,
            "question_instances": [
              {
                "id": 1,
                "text_answer": null,
                "audio_answer": null,
                "submitted": false,
                "question": 1
              }
            ],
            "dialogue_instances": []
          }, */

const generalClassType = getGeneralClassType(props.course.classType) as classType
</script>

<style scoped>
.assignment {
  display: grid;
  gap: 0.8ch;
  grid-template-columns: min-content auto;
  padding: 2px 0;
}
</style>
