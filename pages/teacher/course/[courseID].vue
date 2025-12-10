<template>
 <div class="flex h-full min-h-[calc(100vh-6rem)] w-full flex-col items-center justify-start">
   <div class="flex w-[90%] flex-col items-center justify-center sm:w-[80%] md:w-[70%] xl:w-[60%] 2xl:w-[50%]">
     <div class="flex w-full flex-col items-end justify-center gap-4">
       <div class="flex h-52 w-full flex-col items-start justify-end rounded-2xl p-6" :style="{ backgroundColor: `var(--${generalClassType.toLowerCase()})` }">
        <!--<h1 class="text-4xl font-semibold">{{ course.name / course.period }}</h1>-->
         <h1 class="text-4xl font-semibold">College Russian</h1>
         <h3 class="text-xl">Period 6</h3>
       </div>


       <div class="flex items-center justify-center gap-4">
           <TeacherCourseActionButton type="link" :to="`/teacher/course/{classCodePlaceholder}/roster`" img="https://cdn2.iconfinder.com/data/icons/instagram-ui/48/jee-74-512.png" text="View Students"/>
           <TeacherCourseActionButton type="link" :to="`/teacher/create-assignment?course={classCodePlaceholder}`" img="https://png.pngtree.com/png-clipart/20230405/original/pngtree-assignment-line-icon-png-image_9025828.png" text="Create Assignment"/>
           <TeacherCourseActionButton type="button" img="https://www.freeiconspng.com/uploads/trash-can-icon-18.png" text="Delete Course" class="hover:bg-red-400" @on-click="" />
          <!--on-click=deleteCourse()-->
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
          @delete-assignment="removeAssignment()"
          />
   </div>
 </div>
</template>

<script setup lang="ts">

const data = ref<TeacherCourse | null>(null);

//data.value = await requestEndpoint<TeacherCourse>(`/courses/${teacherCurrentCourse.id}/`);
//1 needs to be replaced for the course ID, currently testing with course ID 1)
data.value = await requestEndpoint<TeacherCourse>(`/courses/1/`);

const assignments = computed(() => data.value?.assignments ?? []);

const currentDate = new Date();

async function removeAssignment() {
  const newData = await requestEndpoint<TeacherCourse>(`/courses/1/`);
  data.value = newData;
  console.log("Assignment removed.", data.value.assignments);
}

/* async function deleteCourse(){
  const { error } = await tryRequestEndpoint(`/courses/${course.id}/`, `DELETE`);
  if (error) return console.error("Failed to delete course:", error);
  //redirect to teacher dashboard after deletion
  navigateTo('/teacher/dashboard');
}
*/

//const generalClassType = getGeneralClassType(props.course.class_type)
const generalClassType = "regular"

</script>


<style scoped></style>
