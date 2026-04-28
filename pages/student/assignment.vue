 <template>
  <div>
    <h1>Student Assignment</h1>
    <p>question sidebar goes here, the title of each question</p>
    <div v-for="question in assignment?.questions" :key="question.id" class="p-6">
      <h2 v-if="question.description">{{ question.description }}</h2>

      <div class="mt-3 flex items-center gap-3">
        <button
          @click="toggleRecording(question.id)"
          :class="isRecording(question.id) ? 'bg-red-500' : 'bg-blue-500'"
          class="px-4 py-2 text-white rounded"
        >
          {{ isRecording(question.id) ? 'Stop' : 'Record' }}
        </button>

        <div v-if="recordings[question.id]" class="flex items-center gap-3">
            <audio :src="recordings[question.id].url" controls class="h-8" />
             <a :href="recordings[question.id].url" :download="`question-${question.id}.webm`" class="text-sm underline"> Save </a>
           <!--  <a :href="recordings[question.id].url" @click="submitAudioAnswer(recordings[question.id].file, question.id)" class="text-sm underline"> Save </a> -->
        </div>
      </div>
    </div>
  </div>
</template>
<!-- need to make this kinda look like the newl's, where you can stop and resume audios 
 the audio recording is done, it currently downloads a file. for whoever continues this process:
 1. if you want, instead of downloading the file, you can upload it directly to the server using the submitAudioAnswer function. 
 2. if you want to stop and resume recordings (like how the newl used to do it), take a look at MediaRecorder on mdn web docs
 3. make sure that the student goes through like two different steps to make sure they submit this audio, because it realistically should be final
 4. for audio questions, there's going to either be text or audio prompts that just need to be displayed-->
<script setup lang="ts">
interface Recording {
  blob: Blob
  url:  string
  file: File
}

const assignment = ref<StudentAssignment | null>(null)
const assignmentId = 2
const result = await requestEndpoint<StudentAssignment>(`/assignments/${assignmentId}`)
assignment.value = result

const activeRecorder  = ref<MediaRecorder | null>(null)
const activeQuestionId = ref<number | null>(null)
const recordings = reactive<Record<number, Recording>>({})

function isRecording(questionId: number) {
  return activeQuestionId.value === questionId
}

async function toggleRecording(questionId: number) {
  if (isRecording(questionId)) {
    stopRecording()
  } else {
    await startRecording(questionId)
  }
}

async function startRecording(questionId: number) {
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
    const url  = URL.createObjectURL(blob)
    const file = new File([blob], `question-${questionId}.webm`, { type: blob.type })

    if (recordings[questionId]) URL.revokeObjectURL(recordings[questionId].url)

    recordings[questionId] = { blob, url, file }

    stream.getTracks().forEach(t => t.stop())
    activeRecorder.value = null
    activeQuestionId.value  = null
  }

  recorder.start()
  activeRecorder.value   = recorder
  activeQuestionId.value = questionId
}

function stopRecording() {
  activeRecorder.value?.stop()
}

</script>

<style scoped>
</style>