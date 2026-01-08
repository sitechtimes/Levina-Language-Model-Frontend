<template>
    <div class="flex flex-row">
       {{ student.firstName }} {{ student.lastName }}
       <button @click="deleteStudent"><img src="/ui/close.svg" aria-hidden="true" draggable="false" class="dark:invert"></button>
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