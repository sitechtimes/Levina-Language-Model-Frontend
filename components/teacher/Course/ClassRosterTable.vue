<template>
  <div class="flex w-full flex-col gap-3 rounded-2xl border border-neutral-300 bg-body p-6 shadow-sm dark:border-neutral-700">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">Enrolled Students ({{ students.length }})</h2>
    </div>

    <div class="relative flex w-full items-center justify-center overflow-x-auto rounded-xl">
      <table class="du-table w-full">
        <thead>
          <tr class="border-b border-neutral-300 dark:border-neutral-600">
            <th class="py-3 pl-6 text-start font-bold">First Name</th>
            <th class="py-3 pl-6 text-start font-bold">Last Name</th>
            <th class="py-3 pl-6 text-start font-bold">Email</th>
            <th class="py-3 text-center font-bold">Remove Student</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id" class="border-t border-neutral-300 dark:border-neutral-600">
            <td class="py-3 pl-6">{{ student.firstName }}</td>
            <td class="py-3 pl-6">{{ student.lastName }}</td>
            <td class="py-3 pl-6 text-neutral-500">{{ student.email }}</td>
            <td class="flex items-center justify-center py-3">
              <button
                class="du-btn du-btn-sm transition duration-200 flex h-8 items-center justify-center rounded-xl hover:brightness-125"
                type="button"
                :title="`Remove ${student.firstName} ${student.lastName}`"
                @click="emit('remove', student)"
              >
                <img src="/ui/close.svg" aria-hidden="true" draggable="false" class="size-5 dark:invert" />
              </button>
            </td>
          </tr>
          <tr v-if="students.length === 0" class="border-t border-neutral-300 dark:border-neutral-600">
            <td colspan="4" class="px-10 py-6 text-center text-neutral-500">No students enrolled in this class yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TeacherStudent } from "~/utils/types/teacherStats";

defineProps<{ students: TeacherStudent[] }>();
const emit = defineEmits<{ remove: [student: TeacherStudent] }>();
</script>
