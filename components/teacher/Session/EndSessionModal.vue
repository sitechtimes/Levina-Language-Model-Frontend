<template>
  <FullScreenModal :show-modal="showModal" transition-name="scale-75" @close="emit('close')">
    <div class="flex flex-col items-center justify-center text-center gap-2">
      <h2 class="text-xl font-bold">End Live Session?</h2>
      <p class="text-sm text-neutral-600 dark:text-neutral-400">Ending this session will mark it as inactive. Connected students will no longer be able to submit further answers.</p>
      <div class="mt-4 flex w-full justify-center gap-3">
        <button class="du-btn du-btn-md bg-neutral-200 dark:bg-neutral-700" type="button" @click="emit('close')">Cancel</button>
        <button class="du-btn du-btn-md bg-red-500 text-white hover:bg-red-600" type="button" :disabled="isEnding" @click="emit('confirm')">
          <span v-if="isEnding" class="du-loading du-loading-spinner du-loading-sm"></span>
          <span v-else>Yes, End Session</span>
        </button>
      </div>
    </div>
  </FullScreenModal>
</template>

<script setup lang="ts">
defineProps<{
  showModal: boolean;
  isEnding: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm"): void;
}>();
</script>

<style scoped></style>
