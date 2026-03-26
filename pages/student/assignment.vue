<template>
    <div>
        <h1>Student Assignment</h1>
        <p>question stuff goes here</p>
    </div>
</template>

<script setup lang="ts">
const assignment = ref<StudentAssignment | null>(null);
const assignmentId = 2;
const result = await requestEndpoint<StudentAssignment>(`/assignments/${assignmentId}`);
assignment.value = result;
console.log(assignment.value?.questions)

</script>

<style scoped>
</style>