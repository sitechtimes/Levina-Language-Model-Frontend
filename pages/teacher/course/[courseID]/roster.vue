<template>
    <div>
        <div v-for="student in students">{{ student.firstName }}</div>
        <StudentCard v-for="student in students" :student="student" :courseID="Number(courseID)"/>
        
    </div>
</template>

<script setup lang="ts">
    import StudentCard from '~/components/teacher/StudentCard.vue'
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

interface Student {
    id: number
    email: string
    firstName: string
    lastName: string
    userType: number
}

const students = ref<Student[]>([])


const route = useRoute()
const courseID = route.params.courseID

async function getStudents() {
    const {data, error} = await tryRequestEndpoint<Student[]>(`courses/${courseID}/students/`)
    console.log(data)
    if (error) return console.error("Failed to fetch students:", error);
    students.value = data
}

onMounted(getStudents)
</script>

<style scoped>

</style>