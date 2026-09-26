<!-- components/StudentQuestionCard.vue -->
<template>
  <div class="p-6 border border-neutral-300 bg-body w-1/2 m-auto hover:border-neutral-600/50 hover:shadow-lg hover:transition dark:border-neutral-600 dark:hover:border-neutral-300/50">
    <h2 v-if="question.description">{{ question.description }}</h2>

    <h2 v-if="question.questionContentType === 'TEXT'" class="text-center">{{ question.textQuestion }}</h2>
    <h2 v-else class="text-center">{{ question.audioQuestion }}</h2>
    <!-- recording answer section -->
    <section v-if="question.questionContentType === 'AUDIO'" class="mt-3 flex items-center justify-center gap-3">
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
    <!-- text answer section -->
    <section v-else class="flex flex-col items-center">
        <textarea v-model="textAnswer" class="w-full mt-2 p-2 border border-neutral-300 rounded" rows="4" placeholder="Type your answer here..."></textarea>
        <button @click="submitTextAnswer" class="mt-2 m-auto px-4 py-2 bg-blue-500 text-white rounded ">Submit</button>
    </section>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  question: StudentAssignment['questions'][number]
}>()

interface Recording {
  blob: Blob
  url: string
  file: File
}

const activeRecorder = ref<MediaRecorder | null>(null)
const isRecording = ref(false)
const recording = ref<Recording | null>(null)

    
const textAnswer = ref('')

async function submitTextAnswer() {
  const result = await requestEndpoint<StudentAssignment>(
    `assignment-instances/${props.question.id}/submit/`, 
    'POST',
    {
      textAnswer: textAnswer.value
    }
  )
//to do: send to new page probably after successful submission
}

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

    recording.value = { blob, url, file }

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