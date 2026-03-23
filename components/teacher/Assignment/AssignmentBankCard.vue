<template>
  <div class="flex flex-col rounded-lg border border-neutral-400 bg-white p-3 hover:border-green-500 cursor-pointer dark:border-neutral-700 dark:bg-neutral-900">
    <div class="flex w-full items-center justify-between" @click="handleAdd">
      <p class="text-black dark:text-white font-bold">
        {{ assignment.name }}
      </p>

      <span class="text-sm text-neutral-500 dark:text-neutral-300">
        {{ assignment.questions.length }}
        {{ assignment.questions.length === 1 ? 'question' : 'questions' }}
      </span>
    </div>
    <ul v-if="open" class="ml-4 mt-2 flex flex-col gap-1">
      <li
        v-for="q in assignment.questions.slice(0, 3)"
        :key="q.id || q"
        class="text-sm text-black dark:text-white"
      >
        {{ q.textQuestion || 'No question text available' }}
      </li>
    </ul>
    <button
      class="text-neutral-500 dark:text-neutral-300 mt-1 self-start"
      @click.stop="open = !open"
    >
      <img
        :src="open ? '/ui/chevron-down.svg' : '/ui/chevron-right.svg'"
        class="h-4 w-4"
      />
    </button>

  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  assignment: any;
}>();

const emit = defineEmits<{
  (e: "add", assignment: any): void;
}>();
const open = ref(false);

function handleAdd() {
  emit("add", props.assignment);
}
</script>