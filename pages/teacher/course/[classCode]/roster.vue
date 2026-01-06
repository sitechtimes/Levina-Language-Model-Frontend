<template>
    <div>
        <div v-for="student in students">{{ student.firstName }}</div>
        <StudentCard v-for="student in students" :student="student" :courseID="courseID"/>
        
    </div>
</template>

<script setup lang="ts">
// /courses/1/students/ returns:
// [
//    {
//     "id": 1,
//      "email": "student1@example.com",
//      "firstName": "Student",
//      "lastName": "One",
//      "userType": 0
//    },
//    {
//      "id": 2,
//      "email": "student2@example.com",
//      "firstName": "Student",
//      "lastName": "Two",
//      "userType": 0
//    },
//    {
//      "id": 3,
//      "email": "sam.kipnis@gmail.com",
//      "firstName": "Sam",
//      "lastName": "Kipnis",
//      "userType": 0
//    }
// ]

const students = ref()

const route = useRoute()
const courseID = route.params.courseID

async function getStudents() {
  console.log(courseID)
    const {data, error} = await tryRequestEndpoint(`/courses/${courseID}/students/`)
    if (error) return console.error("Failed to fetch students:", error);
    students.value = data
    console.log(data)
}
onMounted(getStudents)
</script>

<style scoped>

</style>