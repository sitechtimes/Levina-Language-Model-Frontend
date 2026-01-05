<template>
    <div>
        <div v-for="student in students">{{ student.firstName }}</div>
        <StudentCard v-for="student in students" :studentName="`${student.firstName} ${student.lastName}`"/>
    </div>
</template>

<script setup lang="ts">
const students = [
   {
    "id": 1,
     "email": "student1@example.com",
     "firstName": "Student",
     "lastName": "One",
     "userType": 0
   },
   {
     "id": 2,
     "email": "student2@example.com",
     "firstName": "Student",
     "lastName": "Two",
     "userType": 0
   },
   {
     "id": 3,
     "email": "sam.kipnis@gmail.com",
     "firstName": "Sam",
     "lastName": "Kipnis",
     "userType": 0
   }
 ]
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