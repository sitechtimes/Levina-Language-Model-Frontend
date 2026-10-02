<template>
  <div v-if="pending" class="p-8 text-center text-slate-500">
    Loading assignment...
  </div>

  <div v-else-if="assignment" class="flex min-h-screen">
    <!-- Sidebar: Passes current question index and handle clicks -->
    <StudentAssignmentSidebar 
      :assignment="assignment"
      :current-question-index="currentQuestionIndex" 
      :is-saved=true
      :trigger-submit=true
    />   

    <main class="flex-1 p-6">
      <h1 class="text-2xl font-bold mb-4 text-center p-4">Student Assignment</h1>

      <!-- Displays ONLY the matched question component -->
      <StudentAssignmentQuestion
        v-if="currentQuestion"
        :key="currentQuestion.id"
        :question="currentQuestion"
      />

      <div v-else class="text-center text-slate-500 py-8">
        Question not found.
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'

const answers = ref<Record<string, any>>({})

onMounted(() => {
  const saved = localStorage.getItem('assignment_answers')
  console.log(`saved answers: ${saved}`)
  if (saved) {
    answers.value = JSON.parse(saved)
    console.log(`test ${answers.value}`)
  }
})  
watch(()=> {

})
definePageMeta({
  layout: 'default',
  middleware: 'role-check',
  requiresAuth: true,
  redirectIfAuth: false,
  allowedRoles: ['student']
})

const route = useRoute()
const router = useRouter()

const assignmentId = computed(() => String(route.params.assignmentId ?? ''))

// 1. Get the current 'q' parameter from the query string (?q=...)
const activeQueryId = computed(() => String(route.query.q ?? ''))

// Fetch assignment payload
const { data: assignment, pending } = await useAsyncData<StudentAssignment>(
  `assignment-${assignmentId.value}`,
  () => requestEndpoint<StudentAssignment>(`assignments/${assignmentId.value}`)
)

// 2. Compute the active question based on route.query.q
const currentQuestion = computed(() => {
  const questions = assignment.value?.questions
  if (!questions || questions.length === 0) return null

  // If no query param is present, default to the first question
  if (!activeQueryId.value) {
    return questions[0]
  }

  // Find question matching query param (comparing as strings for safety)
  const matched = questions.find(q => String(q.id) === activeQueryId.value)

  // Fallback to first question if query param ID doesn't match any question
  return matched ?? questions[0]
})

// 3. Compute index for active state highlighting in the sidebar
const currentQuestionIndex = computed(() => {
  if (!assignment.value || !currentQuestion.value) return 0
  return assignment.value.questions.findIndex(
    q => String(q.id) === String(currentQuestion.value?.id)
  )
})

// 4. Update query parameter when student selects a new question
function changeQuestion(questionId: number | string) {
  router.push({
    path: route.path,
    query: { ...route.query, q: questionId }
  })
}
</script>