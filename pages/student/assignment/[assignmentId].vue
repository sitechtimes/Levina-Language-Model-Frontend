<template>
  <div v-if="pending" class="p-8 text-center text-slate-500">
    Loading assignment...
  </div>
  <div v-else-if="error" class="relative flex items-center w-full p-8">
    <button class="group flex items-center justify-center gap-2 rounded-xl hover:bg-neutral-200 hover:transition dark:hover:bg-neutral-500/25 px-3 py-2" type="button" @click="navigateTo('/student/dashboard')">
      <img class="size-4 group-hover:-translate-x-1 group-hover:transition dark:invert" src="/ui/arrow-left.svg" aria-hidden="true" />
      <span class="translate-y-px">Back to dashboard</span>
    </button>
    <span class="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none  text-red-500">
      Error loading assignment: {{error.message}}
    </span>
  </div>
    
  <div v-else-if="assignment" class="flex min-h-screen">
    <!-- Sidebar: Passes current question index and handle clicks -->
    <StudentAssignmentSidebar 
      :assignment="assignment"
      :current-question-index="currentQuestionIndex" 
      :is-saved="true"
      :trigger-submit="true"
      :done-assignment="doneAssignment"
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
        :done-assignment="doneAssignment"
      />

      <div v-else class="text-center text-slate-500 py-8">
        Question not found.
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { fetchStudentAssignment, submitStudentAssignment } from '~/utils/functions/fetch'
import { loadAudioAnswer } from '~/utils/functions/assignment-answers'
import type { StudentAssignmentPageData } from '~/utils/types/assignments'

const answers = ref<Record<string, { textAnswer?: string; audioBlob?: File }>>({})

async function fetchStudentAssignment(assignmentInstanceId: number): Promise<StudentAssignmentPageData> {
  const assignment = await requestEndpoint<AssignmentInstanceResponse>(
    `assignment-instances/${assignmentInstanceId}/`
  );

  const questions = await Promise.all(
    assignment.questionInstances.map(async (questionInstance) => {
      const question = await requestEndpoint<QuestionDetailResponse>(`questions/${questionInstance.question}/`);
      return {
        id: question.id,
        description: question.description ?? "",
        questionType: question.questionType,
        questionContentType: question.questionContentType,
        textQuestion: question.textQuestion,
        audioQuestion: question.audioQuestion,
        textAnswer: question.textAnswer,
        falseAnswers: question.falseAnswers,
        answerContentType: question.answerContentType,
        questionInstanceId: questionInstance.id,
      };
    })
  );

  return {
    id: assignment.id,
    name: `Assignment ${assignment.assignment}`,
    dueDate: null,
    questions,
  };
}

async function submitStudentAssignment(
  assignmentInstanceId: number,
  answers: Readonly<Record<string, { textAnswer?: string; audioBlob?: File }>>,
  questionInstanceIdByQuestionId: ReadonlyMap<string, number>
): Promise<Result<void>> {
  const updates = await Promise.all(
    Object.entries(answers)
      .filter(([, answer]) => answer.textAnswer || answer.audioBlob)
      .map(([questionId, answer]) => {
        const questionInstanceId = questionInstanceIdByQuestionId.get(questionId);
        if (questionInstanceId === undefined) {
          return { error: new Error(`No question instance for question ${questionId}`) };
        }

        const formData = new FormData();
        if (answer.textAnswer) formData.append("text_answer", answer.textAnswer);
        if (answer.audioBlob) formData.append("audio_answer", answer.audioBlob, `audio_${questionId}.webm`);

        return tryRequestEndpoint<void>(`question-instances/${questionInstanceId}/`, "PATCH", formData);
      })
  );

  const failedUpdate = updates.find((result) => result.error);
  if (failedUpdate?.error) return { error: failedUpdate.error };

  return tryRequestEndpoint<void>(`assignment-instances/${assignmentInstanceId}/submit/`, "POST");
}

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

//return 
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

const doneAssignment = computed(() => {
  const questions = assignment.value?.questions ?? []
  return questions.length > 0 && questions.every((question) => {
    const answer = answers.value[String(question.id)]
    return Boolean(answer?.textAnswer?.trim() || answer?.audioBlob)
  })
})

</script>