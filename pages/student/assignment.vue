<template>
    <div>
        <h1>Student Assignment</h1>
        <p>question sidebar goes here, the title of each question</p>
        <div v-for="question in assignment?.questions" :key="question.id" class="p-6">
            <h2 v-if="question.description">{{ question.description }}</h2>
        </div>
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