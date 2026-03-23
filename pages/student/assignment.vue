<template>
    <div>
        <h1>Student Assignment</h1>
        <p>question stuff goes here</p>
    </div>
</template>

<script setup lang="ts">
const assignment = ref();
const assignmentId = 2;
assignment.value = await requestEndpoint(`/assignments/${assignmentId}`);
</script>

<style scoped>
</style>