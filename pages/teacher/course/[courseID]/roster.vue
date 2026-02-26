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
            <tr v-for="student in students" :key="student.id" class="border-t">
              <td class="py-3 pl-10">{{ student.firstName }}</td>
              <td class="py-3 pl-10">{{ student.lastName }}</td>
              <td class="flex items-center justify-center py-3">
                <button class="btn btn-sm transition-200 flex h-8 items-center justify-center rounded-xl hover:brightness-125" type="button" @click="handleConfirmDelete(student)">
                  <img
                    src="/ui/close.svg"
                    aria-hidden="true"
                    draggable="false"
                    class="size-5 dark:invert"
                  />
                </button>
              </td>
            </tr>
            <tr v-if="students.length === 0" class="border-t">
              <td colspan="4" class="items-center justify-center px-10 py-3 text-center">No students</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="mt-6 rounded-xl bg-[var(--primary)] px-6 py-2 text-[var(text-color)]" type="button" @click="router.push(`/teacher/course/${route.params.courseID}`)">
        Return To Class Page
      </button>
    </div>
  </div>
  <FullScreenModal :show-modal="showModal" transition-name="scale-75" @close="showModal = false">
    <h2 class="mb-2 text-xl font-semibold">Confirm Student Removal</h2>
    <p class="mb-4 text-neutral-600 dark:text-neutral-400">Are you sure you want to remove this student from the class?</p>
    <div class="flex w-full items-center justify-center gap-2">
      <button class="du-btn du-btn-md bg-green-accent text-white" type="button" @click="showModal=false">Cancel</button>
      <button class="du-btn du-btn-md bg-green-accent text-white" type="button" @click="removeStudent(studentToDelete)">OK</button>
    </div>
  </FullScreenModal>
</template>


<script setup lang="ts">
definePageMeta({
  layout: "teacher",
  middleware: ["role","teacher-get-course"],
  requiresAuth: true,
  redirectIfAuth: false,
  role: "teacher"
});

const route = useRoute();
const router = useRouter();
const courseID = route.params.courseID

const showModal = ref(false);


interface Student {
    id: number
    email: string
    firstName: string
    lastName: string
    userType: number
}

const students = ref<Student[]>([])
const studentToDelete = ref()

async function getStudents() {
    const {data, error} = await tryRequestEndpoint<Student[]>(`courses/${courseID}/students/`)
    if (error) return console.error("Failed to fetch students:", error);
    students.value = data
}

function handleConfirmDelete(student:Student){
  showModal.value = true
  studentToDelete.value = student
}

async function removeStudent(student:Student){
  const { error } = await tryRequestEndpoint(`courses/${courseID}/remove_student/`,'DELETE',{student: student.id})
  if (error) {
    window.alert(error)
    return console.error("Failed to delete student:", error)
  }
  students.value.splice(students.value.indexOf(student), 1);
  studentToDelete.value = ''
  showModal.value=false
}

onMounted(getStudents)
</script>

<style scoped>

</style>