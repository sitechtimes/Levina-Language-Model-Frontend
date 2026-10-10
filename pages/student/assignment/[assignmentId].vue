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
import { ref, onMounted, watch } from 'vue'

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
  try {
    const updatePromises = Object.entries(answers.value ?? {}).map(([questionId, answer]) => {
      const instanceId = instanceIdByQuestionId.value.get(questionId)
      if (!instanceId) {
        console.error('No question instance for question', questionId)
        return Promise.resolve({ error: new Error('missing instance') })
      }

      const formData = new FormData()
      if (answer.textAnswer) formData.append('text_answer', answer.textAnswer)
      if (answer.audioBlob) formData.append('audio_answer', answer.audioBlob, `audio_${questionId}.webm`)

      if (!answer.textAnswer && !answer.audioBlob) return Promise.resolve({})

      return tryRequestEndpoint(`question-instances/${instanceId}/`, 'PATCH', formData)
    })

    const results = await Promise.all(updatePromises)
    const failed = results.filter(r => r?.error)
    if (failed.length) {
      console.error('Saving answers failed:', failed)
      return // don't submit with unsaved answers
    }

    const submitResult = await tryRequestEndpoint(
      `assignment-instances/${assignmentId.value}/submit/`,
      'POST'
    )
    if (submitResult.error) {
      console.error('Submission failed:', submitResult.error)
      return
    }
    console.log('Assignment submitted successfully!')
  } catch (err) {
    console.error('An error occurred during submission:', err)
  }
}


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
//to do: this should be assignment instance not assignments

const { data: assignment, pending, error } = await useAsyncData<StudentAssignment | null>(
  `assignment-${assignmentId.value}`,
  async () => {
    const raw = await requestEndpoint<AssignmentInstanceResponse>(`assignment-instances/${assignmentId.value}/`)

    const questions = await Promise.all(
      (raw.questionInstances ?? []).map(async (qi) => {
        const q = await requestEndpoint<QuestionDetailResponse>(`questions/${qi.question}/`)
        return {
          id: q.id,
          description: q.description ?? '',
          questionType: q.questionType,
          questionContentType: q.questionContentType,
          textQuestion: q.textQuestion,
          audioQuestion: q.audioQuestion,
          answerContentType: q.answerContentType,
          questionInstanceId: qi.id,
        }
      })
    )

    return {
      id: raw.id,
      name: `Assignment ${raw.assignment}`,
      dueDate: null,
      questions,
    } as unknown as StudentAssignment
  },
  { server: false }
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

const assignmentIsComplete = computed(() => {
  const questionAmt = assignment.value?.questions?.length ?? 0
  const answeredQuestions = Object.keys(answers.value ?? {}).length

  // Returns true only if there are questions and all of them are answered
  return questionAmt > 0 && answeredQuestions >= questionAmt
})

</script>