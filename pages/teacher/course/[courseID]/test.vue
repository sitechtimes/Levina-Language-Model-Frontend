<template>
  <div class="flex w-full flex-col items-center py-12">
    <div class="relative flex w-full flex-col items-center justify-center gap-1">

      <div class="items relative flex w-full items-center justify-center overflow-x-auto rounded-b-box rounded-se-box">
        <table class="table w-3/4">
          <thead>
            <tr class="border-b border-neutral-300 dark:border-neutral-600">
              <th class="py-3 pl-10 text-start font-bold">First Name</th>
              <th class="py-3 pl-10 text-start font-bold">Last Name</th>
              <th class="py-3 font-bold">Remove Student</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in filteredStudents" :key="student.id" class="border-t">
              <td class="py-3 pl-10">{{ student.firstName }}</td>
              <td class="py-3 pl-10">{{ student.lastName }}</td>
              <td class="flex items-center justify-center py-3">
                <button class="btn btn-sm transition-200 flex h-8 items-center justify-center rounded-xl bg-red-500 p-3 hover:brightness-125" type="button" @click="removeStudent(student)">✕</button>
              </td>
            </tr>
            <tr v-if="filteredStudents.length === 0" class="border-t">
              <td colspan="4" class="items-center justify-center px-10 py-3 text-center">No students</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="mt-6 rounded-xl bg-[var(--primary)] px-6 py-2 text-[var(text-color)]" type="button" @click="router.push(`/teacher/course/${route.params.courseCode}`)">
        Return To Class Page
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const filteredStudents = 
[
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
</script>

<style scoped>

</style>