<template>
  <div
    class="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700
           bg-white dark:bg-gray-800 px-4 py-3 shadow-sm
           hover:shadow-md transition"
  >
    <span class="text-gray-800 dark:text-gray-100 font-medium">
      {{ student.firstName }} {{ student.lastName }}
    </span>

    <button
      @click="deleteStudent"
      class="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition"
      aria-label="Remove student"
    >
      <img
        src="/ui/close.svg"
        aria-hidden="true"
        draggable="false"
        class="size-5 dark:invert"
      />
    </button>
  </div>
</template>


<script setup lang="ts">
const props = defineProps<{
    student: Student //make student type?
    courseID: number
}>()

interface Student {
    id: number
    email: string
    firstName: string
    lastName: string
    userType: number
}

async function deleteStudent(){
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return
const { error } = await tryRequestEndpoint(
    `courses/${props.courseID}/remove_student`,'DELETE',
  {
    student: props.student.id
  }
  )
    if (error) return console.error("Failed to delete student:", error)
}
</script>

<style scoped>

</style>