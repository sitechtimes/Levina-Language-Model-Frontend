<template>
    <div>
        <StudentCard v-for="student in students" :studentName="student.name"/>
    </div>
</template>

<script setup lang="ts">
const students = [{name: "John Doe"}]
// /courses/1/students/ returns:
// [
//   {
//     "id": 1,
//     "email": "student1@example.com",
//     "first_name": "Student",
//     "last_name": "One",
//     "user_type": 0
//   },
//   {
//     "id": 2,
//     "email": "student2@example.com",
//     "first_name": "Student",
//     "last_name": "Two",
//     "user_type": 0
//   },
//   {
//     "id": 3,
//     "email": "sam.kipnis@gmail.com",
//     "first_name": "Sam",
//     "last_name": "Kipnis",
//     "user_type": 0
//   }
// ]
async function getStudents(params:type) {
    
}
onMounted(getStudents)
</script>

<style scoped>

</style>