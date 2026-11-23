<template>
  <div class="flex w-full flex-col gap-4 rounded-2xl border border-neutral-300 bg-body p-6 shadow-sm dark:border-neutral-700">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold">Students in Session ({{ students.length }})</h2>
        <p class="text-xs text-neutral-500">Live tracker updates as students join and submit responses.</p>
      </div>
    </div>

    <div class="relative flex w-full items-center justify-center overflow-x-auto rounded-b-box rounded-se-box">
      <table class="table w-full">
        <thead>
          <tr class="border-b border-neutral-300 dark:border-neutral-600">
            <th class="py-3 pl-6 text-start font-bold">Student Name</th>
            <th class="py-3 text-center font-bold">Joined At</th>
            <th class="py-3 text-center font-bold">Questions Answered</th>
            <th class="py-3 text-center font-bold">Score (MCQ)</th>
            <th class="py-3 text-center font-bold">Status</th>
            <th class="py-3 text-center font-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.instanceId" class="border-t border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40">
            <td class="py-3 pl-6 font-medium">
              {{ student.studentName }}
            </td>
            <td class="py-3 text-center text-xs text-neutral-500">
              {{ formatJoinedTime(student.joinedAt) }}
            </td>
            <td class="py-3 text-center">
              <div class="flex flex-col items-center gap-1">
                <span class="text-xs font-semibold"> {{ student.answeredCount }} / {{ student.totalQuestions }} </span>
                <div class="h-1.5 w-24 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div
                    class="h-full bg-green-accent transition-all duration-300"
                    :style="{
                      width: student.totalQuestions > 0 ? `${Math.round((student.answeredCount / student.totalQuestions) * 100)}%` : '0%'
                    }"
                  ></div>
                </div>
              </div>
            </td>
            <td class="py-3 text-center">
              <span class="font-semibold text-sm"> {{ student.correctCount }} / {{ student.totalQuestions }} </span>
              <span v-if="student.pendingCount > 0" class="block text-[10px] text-amber-600 dark:text-amber-400"> ({{ student.pendingCount }} pending) </span>
            </td>
            <td class="py-3 text-center">
              <span v-if="student.submitted" class="rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-950 dark:text-green-300"> Submitted </span>
              <span v-else class="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300"> In Progress </span>
            </td>
            <td class="py-3 text-center">
              <button
                class="du-btn du-btn-xs rounded-lg bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200"
                type="button"
                @click="emit('inspect', student.instanceId)"
              >
                Inspect
              </button>
            </td>
          </tr>
          <tr v-if="students.length === 0" class="border-t border-neutral-300 dark:border-neutral-600">
            <td colspan="6" class="px-6 py-10 text-center text-neutral-500">No students have joined yet. Waiting for participants to enter the code...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  students: StudentSessionProgress[];
}>();

const emit = defineEmits<{
  (e: "inspect", instanceId: number): void;
}>();

function formatJoinedTime(timestamp: string) {
  if (!timestamp) return "—";
  try {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return timestamp;
  }
}
</script>

<style scoped></style>
