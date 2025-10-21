<template>
 <div class="flex h-full min-h-[calc(100vh-6rem)] w-full flex-col items-center justify-start">
   <div class="flex w-[90%] flex-col items-center justify-center sm:w-[80%] md:w-[70%] xl:w-[60%] 2xl:w-[50%]">
     <div class="flex w-full flex-col items-end justify-center gap-4">
       <div class="flex h-52 w-full flex-col items-start justify-end rounded-2xl p-6 bg-purple-500" >
         <h1 class="text-4xl font-semibold">College Russian</h1>
         <h3 class="text-xl">Period 6</h3>
       </div>


       <div class="flex items-center justify-center gap-4">
           <ActionButton type="link" :to="`/teacher/course/{classCodePlaceholder}/roster`" img="" text="View Students"/>
           <ActionButton type="link" :to="`/teacher/create-assignment?course={classCodePlaceholder}`" img="" text="View Students"/>
           <ActionButton type="button" img="" text="Delete Course" class="hover:bg-red-400" @on-click="" />
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
       <!--next part is a sample assignment card, will make into a component after i make page look how it should-->
         <div class="relative w-full">
    <div class="absolute right-2 top-2 z-10">
      <img
        tabindex="0"
        role="button"
        src="/ui/ellipsis-vertical.svg"
        alt="More options"
        class="h-7 w-7 cursor-pointer select-none rounded-full p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700"
        @click.stop="isOpen = !isOpen"
      />
      <Transition name="slide-up">
        <ul v-show="isOpen" tabindex="0" class="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-[var(--border-color)] bg-body p-2 shadow-lg" @click.stop>
          <li>
            <button class="h-10 w-full rounded-lg pl-4 text-left transition-all hover:bg-red-400/70" type="button" @click="">Delete</button>
          </li>
        </ul>
      </Transition>
    </div>
    <NuxtLink
      class="relative flex h-fit w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-300 py-4 hover:border-neutral-600 hover:shadow-lg hover:transition sm:flex-row sm:p-6 dark:border-neutral-600 dark:hover:border-neutral-300"
      :to="`/teacher/course/{coursePlaceholder}/{assignmentPlaceholder}`"
    >
      <div class="flex w-5/6 flex-col items-start justify-start">
        <h3 class="w-full overflow-hidden overflow-ellipsis text-nowrap text-2xl font-semibold">
          Audio Thing
        </h3>
        <ClientOnly>
          <!--<p :title="assignment.dueDate.toLocaleString()">Due {{ formatDate(assignment.dueDate, currentDate) }}</p>-->
          <p>Due 10/25/2030</p>
        </ClientOnly>
      </div>

      <div class="flex w-5/6 flex-col items-center justify-center gap-1">
        <p class="text-xl font-medium">
          Submissions: {{ 1 }}/{{ 2 }}
          
          <span class="text-sm">students</span>
        </p>
        <div class="relative h-2 w-full overflow-hidden rounded-full border border-neutral-300 bg-neutral-100/25">
          <!--<div class="absolute left-0 top-0 h-full" :style="{ width: `${(assignment.numSubmitted / course.numStudents) * 100}%`, backgroundColor: subjectColors[course.subject] }"></div>
        --></div>
      </div>
    </NuxtLink>
  </div>
   </div>
 </div>
</template>


<script setup lang="ts">






</script>


<style scoped></style>
