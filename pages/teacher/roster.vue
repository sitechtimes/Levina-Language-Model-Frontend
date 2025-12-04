<template>
    <div>
        <StudentCard v-for="student in students" :studentName="student.name"/>
    </div>
</template>

<script setup lang="ts">
const students = [{name: "John Doe"}]
</script>

<style scoped>

</style>