<template>
  <div v-if="pending" class="p-8 text-center text-slate-500">
    Loading assignment...
  </div>

  <div v-else-if="assignment" class="flex min-h-screen">
    <!-- Sidebar: Passes current question index and handle clicks -->
    <StudentAssignmentSidebar 
      :assignment="assignment"
      :current-question-index="currentQuestionIndex" 
      :is-saved="true"
      :trigger-submit="true"
      :done-assignment="assignmentIsComplete"
      @submitted="submitAssignment"    
    />   

    <main class="flex-1 p-6">
      <h1 class="text-2xl font-bold mb-4 text-center p-4">Student Assignment</h1>

      <!-- Displays ONLY the matched question component -->
      <StudentAssignmentQuestion
        v-if="currentQuestion"
        :key="currentQuestion.id"
        :question="currentQuestion"
        @changed-question="handleQuestionChange"
        :done-assignment="assignmentIsComplete"
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
import { ref, watch } from 'vue'
import { fetchStudentAssignment, submitStudentAssignment } from '~/utils/functions/fetch'
import { loadAudioAnswer } from '~/utils/functions/assignment-answers'
import type { StudentAssignmentPageData } from '~/utils/types/assignments'

const answers = ref<Record<string, { textAnswer?: string; audioBlob?: File }>>({})

function handleQuestionChange({ questionId, answer }: { questionId: number | string; answer: string | File | undefined }) {
  const key = String(questionId)
  const current = answers.value[key] ?? {}

  if (typeof answer === 'string') {
    answers.value[key] = { ...current, textAnswer: answer }
    return
  }

  if (answer instanceof File) {
    answers.value[key] = { ...current, audioBlob: answer }
    return
  }

  delete answers.value[key]
}

const instanceIdByQuestionId = computed(() => {
  const map = new Map<string, number>()
  for (const q of assignment.value?.questions ?? []) {
    map.set(String(q.id), q.questionInstanceId)
  }
  return map
})

async function submitAssignment() {
  const result = await submitStudentAssignment(
    Number(assignmentId.value),
    answers.value,
    instanceIdByQuestionId.value
  )
  if (result.error) console.error('Assignment submission failed:', result.error)
}


definePageMeta({
  layout: 'default',
  middleware: ['role-check', 'student-assignment'],
  requiresAuth: true,
  redirectIfAuth: false,
  allowedRoles: ['student']
})

const route = useRoute()
const router = useRouter()

const assignmentId = computed(() => String(route.params.assignmentId ?? ''))

// 1. Get the current 'q' parameter from the query string (?q=...)
const activeQueryId = computed(() => String(route.query.q ?? ''))

const { data: assignment, pending, error } = await useAsyncData<StudentAssignmentPageData | null>(
  `assignment-${assignmentId.value}`,
  () => fetchStudentAssignment(Number(assignmentId.value)),
  { server: false }
)

watch(assignment, async (loadedAssignment) => {
  if (!loadedAssignment) return

  const restoredAnswers = { ...answers.value }
  await Promise.all(loadedAssignment.questions.map(async (question) => {
    const savedAnswer = localStorage.getItem(`question-${question.id}-textAnswer`)
    if (savedAnswer?.trim()) {
      restoredAnswers[String(question.id)] = { textAnswer: savedAnswer }
      return
    }

    try {
      const audioBlob = await loadAudioAnswer(question.id)
      if (audioBlob) restoredAnswers[String(question.id)] = { audioBlob }
    } catch (error) {
      console.error(`Unable to restore answer for question ${question.id}:`, error)
    }
  }))
  answers.value = restoredAnswers
}, { immediate: true })

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

const assignmentIsComplete = computed(() => {
  const questions = assignment.value?.questions ?? []
  return questions.length > 0 && questions.every((question) => {
    const answer = answers.value[String(question.id)]
    return Boolean(answer?.textAnswer?.trim() || answer?.audioBlob)
  })
})

</script>