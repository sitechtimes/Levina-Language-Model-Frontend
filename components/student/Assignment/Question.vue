<!-- components/StudentQuestionCard.vue -->
<template>
  <div class="p-6 border border-neutral-300 bg-body w-1/2 m-auto hover:border-neutral-600/50 hover:shadow-lg hover:transition dark:border-neutral-600 dark:hover:border-neutral-300/50">
    <h2 v-if="question.description">{{ question.description }}</h2>

    <h2 v-if="question.questionContentType === 'TEXT'" class="text-center">{{ question.textQuestion }}</h2>
    <audio v-else :src="question.audioQuestion || undefined" controls class="m-auto"/>
    <!-- recording answer section -->
    <section v-if="question.questionContentType === 'AUDIO'" class="mt-3 flex flex-col items-center justify-center gap-3">
      <button
        @click="toggleRecording"
        :class="isRecording ? 'bg-red-500' : 'bg-blue-500'"
        class="px-4 py-2 my-3 text-white rounded"
      >
        {{ isRecording ? 'Stop' : 'Record' }}
      </button>

      <div v-if="recording" class="flex items-center gap-3">
        <audio :src="recording.url" controls class="h-8" />
        <a :href="recording.url" :download="`question-${question.id}.webm`" class="text-sm underline"> Save </a>
        <!-- <a :href="recording.url" @click="submitAudioAnswer(recording.file, question.id)" class="text-sm underline"> Save </a> -->
      </div>
    </section>

    <section v-if="question.questionType === 'MCQ'" class="mt-3 flex flex-col gap-2">
      <label
        v-for="(choice, index) in multipleChoiceOptions"
        :key="`${index}-${choice}`"
        class="flex cursor-pointer items-center gap-3 rounded border border-neutral-300 p-3 hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-800"
      >
        <input
          v-model="textAnswer"
          type="radio"
          :value="choice"
          class="radio radio-primary"
        />
        <span>{{ choice }}</span>
      </label>
    </section>

    <section v-if="question.questionType === 'FRQ' && question.questionContentType == 'TEXT'" class="mt-3 flex flex-col items-center">
      <textarea
        v-model="textAnswer"
        class="mt-2 w-full rounded border border-neutral-300 p-2 dark:border-neutral-600"
        rows="4"
        placeholder="Type your answer here..."
      ></textarea>
    </section>
  </div>
</template>

<script setup lang="ts">
import { loadAudioAnswer, saveAudioAnswer } from '~/utils/functions/assignment-answers'

const props = defineProps<{
  question: StudentAssignment['questions'][number] & { questionInstanceId?: number }
  questionInstanceId?: number
}>()

const emits = defineEmits<{
  changedQuestion: [payload: { questionInstanceId: number | string; questionId: number | string; answer: string | File | undefined }]
}>()

interface Recording {
  url: string
  file: File
}

const activeRecorder = ref<MediaRecorder | null>(null)
const isRecording = ref(false)
const recording = ref<Recording | null>(null)

const textAnswer = ref('')
const multipleChoiceOptions = computed(() =>
  [props.question.textAnswer, ...(props.question.falseAnswers ?? [])]
    .filter((choice): choice is string => Boolean(choice))
)

onMounted(() => {
  const storedTextAnswer = localStorage.getItem(`question-${props.question.id}-textAnswer`)
  if (storedTextAnswer) {
    textAnswer.value = storedTextAnswer
    emits("changedQuestion", {
      questionInstanceId: props.questionInstanceId ?? props.question.id,
      questionId: props.question.id,
      answer: storedTextAnswer
    })
  }

  void loadAudioAnswer(props.question.id)
    .then((file) => {
      if (!file) return
      const url = URL.createObjectURL(file)
      recording.value = { url, file }
      emits("changedQuestion", {
        questionInstanceId: props.questionInstanceId ?? props.question.id,
        questionId: props.question.id,
        answer: file
      })
    })
    .catch((error: unknown) => console.error("Unable to restore saved audio answer:", error))
})
watch(textAnswer, (newVal) => {
    localStorage.setItem(`question-${props.question.id}-textAnswer`, newVal)
    emits("changedQuestion", {
      questionInstanceId: props.questionInstanceId ?? props.question.id,
      questionId: props.question.id,
      answer: newVal
    })
})
watch(recording, (newVal) => {
    if (newVal) {
      void saveAudioAnswer(props.question.id, newVal.file)
        .catch((error: unknown) => console.error("Unable to save audio answer:", error))
    } else {
      localStorage.removeItem(`question-${props.question.id}-recording`)
    }
    emits("changedQuestion", {
      questionInstanceId: props.questionInstanceId ?? props.question.id,
      questionId: props.question.id,
      answer: newVal?.file
    })
})

function toggleRecording() {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

async function startRecording() {
  if (activeRecorder.value) stopRecording()

  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (err) {
    if (err instanceof DOMException) {
      if (err.name === 'NotFoundError') {
        alert('No microphone found. Please plug one in and try again.')
      } else if (err.name === 'NotAllowedError') {
        alert('Microphone access was denied. Please allow it in your browser settings.')
      } else {
        alert(`Microphone error: ${err.message}`)
      }
    }
    return
  }

  const recorder = new MediaRecorder(stream)
  const chunks: BlobPart[] = []

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: recorder.mimeType })
    const url = URL.createObjectURL(blob)
    const file = new File([blob], `question-${props.question.id}.webm`, { type: blob.type })

    if (recording.value) URL.revokeObjectURL(recording.value.url)

    recording.value = { url, file }

    stream.getTracks().forEach(t => t.stop())
    activeRecorder.value = null
    isRecording.value = false
  }

  recorder.start()
  activeRecorder.value = recorder
  isRecording.value = true
}

function stopRecording() {
  activeRecorder.value?.stop()
}
</script>