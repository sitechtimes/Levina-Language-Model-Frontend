<template> 
    <div class="relative w-full">
    <div class="absolute right-2 top-2 z-10">
      <img
        tabindex="0"
        role="button"
        src="/ui/ellipsis-vertical.svg"
        alt="More options"
        class="h-7 w-7 cursor-pointer select-none rounded-full p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700"
        @click.stop="isOpen = !isOpen, console.log(isOpen)"
      />
      <Transition name="slide-up">
        <ul v-show="isOpen" tabindex="0" class="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-[var(--border-color)] bg-body p-2 shadow-lg" @click.stop>
          <li>
            <button @click="deleteAssignment" class="h-10 w-full rounded-lg pl-4 text-left transition-all hover:bg-red-400/70" type="button">Delete</button>
          </li>
        </ul>
      </Transition>
    </div>
    <NuxtLink
      class="relative flex h-fit w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-300 py-4 hover:border-neutral-600 hover:shadow-lg hover:transition sm:flex-row sm:p-6 dark:border-neutral-600 dark:hover:border-neutral-300"
      :to="`/teacher/course/{coursePlaceholder}/{assignmentPlaceholder}`"
    >
      <div class="flex w-5/6 flex-col items-start justify-start">
        <h3 class="w-full overflow-hidden overflow-ellipsis text-nowrap text-2xl font-semibold">
          {{assignment.name}} / ID: {{ assignment.id }}
        </h3>
        <h2 v-if="assignment.timed" class="w-full overflow-hidden overflow-ellipsis text-nowrap text-l">Timed Assignment</h2>
        <ClientOnly>
          <!--<p>Due {{ formatDate(assignment.due_date, currentDate) }}</p>
          when we implement formatting this needs to be implemented-->
          
          <p>Due {{ assignment.dueDate }}</p>
        </ClientOnly>
      </div>

      <div class="flex w-5/6 flex-col items-center justify-center gap-1">
        <p class="text-xl font-medium">
          Submissions: {{ submitted(assignment) }}/{{ assignment.assignmentInstances.length }}
          
          <span class="text-sm">students</span>
        </p>
        <div class="relative h-2 w-full overflow-hidden rounded-full border border-neutral-300 bg-neutral-100/25">
          </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  assignment: TeacherAssignment;
  currentDate: Date;
 }>();

function submitted(assignment: TeacherAssignment) {
   const instances = (assignment as any).assignment_instances;
   if (!Array.isArray(instances)) return 0;
   return instances.filter((instance: any) => !!instance && !!instance.submitted).length;
 }

const emit = defineEmits(['delete-assignment']);
const isOpen = ref(false);

async function deleteAssignment() {
  const { error } = await tryRequestEndpoint(`assignments/${props.assignment.id}/`, `DELETE`);
  if (error) return console.error("Failed to delete assignment:", error);
  isOpen.value = false;
  emit('delete-assignment', props.assignment.id);
}
</script>