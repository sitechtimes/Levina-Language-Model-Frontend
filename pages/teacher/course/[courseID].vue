<template>
 <div class="flex h-full min-h-[calc(100vh-6rem)] w-full flex-col items-center justify-start">
   <div class="flex w-[90%] flex-col items-center justify-center sm:w-[80%] md:w-[70%] xl:w-[60%] 2xl:w-[50%]">
     <div class="flex w-full flex-col items-end justify-center gap-4">
       <div class="flex h-52 w-full flex-col items-start justify-end rounded-2xl p-6" :style="{ backgroundColor: classColors[generalClassType] }">
        <!--<h1 class="text-4xl font-semibold">{{ course.name / course.period }}</h1>-->
         <h1 class="text-4xl font-semibold"> {{ courseName }}</h1>
         <h3 class="text-xl">Period {{ coursePeriod }}</h3>
       </div>


       <div class="flex items-center justify-center gap-4">
           <TeacherCourseActionButton type="link" :to="`/teacher/course/{classCodePlaceholder}/roster`" img="/ui/users.svg" text="View Students"/>
           <TeacherCourseActionButton type="link" :to="`/teacher/create-assignment`" img="/ui/document.svg" text="Create Assignment"/>
           <TeacherCourseActionButton type="button" img="/ui/trash.svg" text="Delete Course" class="hover:bg-red-400" @on-click="deleteType= 'course'" />
          </div>
     </div>

     <div class="flex w-full items-start justify-start px-4">
        <h2 class="text-3xl font-semibold">Assignments</h2>
     </div>

     <div class="my-4 flex w-full items-start justify-start border-b border-neutral-300">
        <button
            class="select-none border-b-4 px-4 transition hover:bg-slate-500"
            type="button"
            @click=""
        >
        <span class="text-lg font-semibold capitalize lg:text-2xl">Current</span>
         </button>
         <button
            class="select-none border-b-4 px-4 transition hover:bg-slate-500"
            type="button"
            @click=""
        >
        <span class="text-lg font-semibold capitalize lg:text-2xl">Past</span>
         </button>
     </div>


     <div class="flex w-full flex-col items-center gap-4">
     </div>
       <TeacherAssignmentCard
       v-for="assignment in assignments"
          :key="assignment.id"
          :assignment="assignment"
          :current-date="currentDate"
          @delete-assignment="(deleteType = 'assignment'), (currentDeleteAssignmentId = assignment.id)"
          />
   </div>
   <FullScreenModal transition-name="scale-75" :show-modal="showDeleteModal" @close="showDeleteModal = false">
        <div class="flex flex-col items-center justify-center">
          <h2 class="mb-2 text-xl font-semibold">Confirm Deletion</h2>
          <p class="mb-4 text-gray-600">{{ deleteStep === 1 ? `Are you sure you want to delete this ${deleteType}?` : "Are you really sure?" }}</p>
          <div class="flex justify-center gap-4">
            <TeacherCourseActionButton v-if="deleteStep === 1" type="button" img="/ui/trash.svg" text="Confirm" class="!bg-red-200 hover:!bg-red-400" @on-click="deleteStep++" />
            <TeacherCourseActionButton v-else type="button" img="/ui/trash.svg" text="Yes, Delete" class="!bg-red-200 hover:!bg-red-400" @on-click="confirmDelete" />
            <TeacherCourseActionButton type="button" img="/ui/close.svg" text="Cancel" @on-click="showDeleteModal = false" />
          </div>
        </div>
      </FullScreenModal>
 </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "teacher",
  requiresAuth: true,
  redirectIfAuth : false
})

const route = useRoute();
const userStore = useUserStore();
const { teacherCourses, teacherCurrentCourse } = storeToRefs(userStore);
const courseId = route.params.courseID as string

const data = ref<TeacherCourse | null>(null);
data.value = await requestEndpoint<TeacherCourse>(`/courses/${courseId}/`);
const courseName = computed(() => data.value?.name ?? "Course Name");
const coursePeriod = computed(() => data.value?.period ?? "Course Period");

const assignments = computed(() => data.value?.assignments ?? []);
const currentDate = new Date();

const showDeleteModal = ref(false);
const deleteStep = ref<1 | 2>(1);
const deleteType = ref<"course" | "assignment">();
const currentDeleteAssignmentId = ref<number>();
watch(deleteType, (type) => {
  if (type) return (showDeleteModal.value = true);
});
watch(showDeleteModal, (val) => {
  if (!val) {
    deleteStep.value = 1;
    deleteType.value = undefined;
    currentDeleteAssignmentId.value = undefined;
  }
});

async function deleteAssignment() {
  const newData = await requestEndpoint<TeacherCourse>(`/courses/${courseId}/`);
  data.value = newData;
  console.log("Assignment removed.", data.value.assignments);
  teacherCurrentCourse.value.assignments = teacherCurrentCourse.value.assignments.filter((assignment) => assignment.id !== currentDeleteAssignmentId.value);
  showDeleteModal.value = false;
}

 async function deleteCourse(){
  const { error } = await tryRequestEndpoint(`/courses/${courseId}/`, `DELETE`);
  if (error) return console.error("Failed to delete course:", error);
  userStore.teacherCourses = userStore.teacherCourses.filter((course) => course.id !== teacherCurrentCourse.value?.id);
  teacherCurrentCourse.value = undefined;
  navigateTo('/teacher/dashboard');
}

function confirmDelete() {
  if (deleteType.value === "course") void deleteCourse();
  else if (deleteType.value === "assignment") void deleteAssignment();
}

//const generalClassType = getGeneralClassType(course.classType) as classType
const generalClassType = "Regular" 
</script>


<style scoped></style>
