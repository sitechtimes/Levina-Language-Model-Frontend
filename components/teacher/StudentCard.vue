<template>
    <div class="flex flex-row">
       {{ student.firstName }} {{ student.lastName }}
       <button @click="deleteStudent"><img src="/close.svg" aria-hidden="true" draggable="false" class="dark:invert"></button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    student: string //make student type?
    courseID: number
}>()

async function deleteStudent(){
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return
    const {error} = await tryRequestEndpoint(`/courses/${props.courseID}/remove_student/`, props.student.id);
    if (error) return console.error("Failed to delete student:", error)
}
</script>

<style scoped>

</style>