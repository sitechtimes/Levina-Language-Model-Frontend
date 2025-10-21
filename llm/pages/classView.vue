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
   </div>
 </div>
</template>


<script setup lang="ts">






</script>


<style scoped></style>
