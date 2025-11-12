<template>
 <div class="flex h-full min-h-[calc(100vh-6rem)] w-full flex-col items-center justify-start">
   <div class="flex w-[90%] flex-col items-center justify-center sm:w-[80%] md:w-[70%] xl:w-[60%] 2xl:w-[50%]">
     <div class="flex w-full flex-col items-end justify-center gap-4">
       <div class="flex h-52 w-full flex-col items-start justify-end rounded-2xl p-6 bg-purple-500" >
        <!--${course.name}-->
         <h1 class="text-4xl font-semibold">College Russian</h1>
         <h3 class="text-xl">Period 6</h3>
       </div>


       <div class="flex items-center justify-center gap-4">
          <!--change img links later will be imported into a ui folder-->
           <TeacherDashboardActionButton type="link" :to="`/teacher/course/{classCodePlaceholder}/roster`" img="https://cdn2.iconfinder.com/data/icons/instagram-ui/48/jee-74-512.png" text="View Students"/>
           <TeacherDashboardActionButton type="link" :to="`/teacher/create-assignment?course={classCodePlaceholder}`" img="https://png.pngtree.com/png-clipart/20230405/original/pngtree-assignment-line-icon-png-image_9025828.png" text="Create Assignment"/>
           <TeacherDashboardActionButton type="button" img="https://www.freeiconspng.com/uploads/trash-can-icon-18.png" text="Delete Course" class="hover:bg-red-400" @on-click="" />
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


       <!--<div class="flex flex-col items-center justify-center">
         <h2 class="mb-2 text-xl font-semibold">Confirm Deletion</h2>
         <p class="mb-4 text-gray-600">{{ `Are you sure you want to delete this?` }}</p>
         <div class="flex justify-center gap-4">
         </div>
       </div>-->
       <!--next part is a sample assignment card, will make into a component after i make page look how it should
        <div v-for="assignments in assignments.course.id" will make all the cards for each assignment-->
       <TeacherDashboardAssignmentCard/>
       <!-- v-for="assignment in filteredAssignments"
          :key="assignment.id"
          :course="teacherCurrentCourse"
          :assignment="assignment"
          :current-date="currentDate"
          @delete-assignment="(deleteType = 'assignment'), (currentDeleteAssignmentId = assignment.id)"-->
   </div>
 </div>
</template>

<script setup lang="ts">


const data = await requestEndpoint<[]>(`/courses/1/`);
//1 needs to be replaced for the course ID, currently testing with course ID 1)
console.log(data)
console.log(data.assignments)



</script>


<style scoped></style>
