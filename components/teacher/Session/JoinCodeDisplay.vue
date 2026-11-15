<template>
  <div class="flex w-full flex-col gap-4 rounded-2xl border border-neutral-300 bg-body p-6 shadow-sm dark:border-neutral-700">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-bold">{{ templateName }}</h2>
          <span
            v-if="active"
            class="flex items-center gap-1.5 rounded-full bg-green-accent/20 px-3 py-0.5 text-xs font-semibold text-green-800 dark:text-green-300"
          >
            <span class="size-2 rounded-full bg-green-500 animate-pulse"></span>
            Live
          </span>
          <span
            v-else
            class="rounded-full bg-neutral-200 px-3 py-0.5 text-xs font-semibold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"
          >
            Session Ended
          </span>
        </div>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          Share this access code with your students to have them join at <span class="font-mono font-medium">/accessCode</span>.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="active"
          class="du-btn du-btn-sm bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
          type="button"
          @click="copyJoinLink"
        >
          <img src="/ui/todo.svg" class="size-4 opacity-75 dark:invert" aria-hidden="true" />
          {{ copiedLink ? "Copied Link!" : "Copy Join Link" }}
        </button>
      </div>
    </div>

    <!-- Prominent Access Code Display -->
    <div class="flex flex-col items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-neutral-200/40 p-6 sm:flex-row sm:justify-between dark:border-neutral-700 dark:bg-neutral-800/40">
      <div class="flex flex-col items-center sm:items-start">
        <span class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Access Code</span>
        <span class="font-mono text-4xl font-extrabold tracking-widest sm:text-5xl text-neutral-900 dark:text-white">
          {{ accessCode }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="du-btn du-btn-md bg-green-accent text-white hover:brightness-110"
          type="button"
          @click="copyCode"
        >
          {{ copiedCode ? "Code Copied!" : "Copy Code" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  accessCode: string;
  templateName: string;
  active: boolean;
}>();

const copiedCode = ref(false);
const copiedLink = ref(false);

async function copyCode() {
  if (!props.accessCode) return;
  try {
    await navigator.clipboard.writeText(props.accessCode);
    copiedCode.value = true;
    setTimeout(() => {
      copiedCode.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy code:", err);
  }
}

async function copyJoinLink() {
  if (!props.accessCode) return;
  try {
    const origin = window.location.origin;
    const url = `${origin}/accessCode?code=${encodeURIComponent(props.accessCode)}`;
    await navigator.clipboard.writeText(url);
    copiedLink.value = true;
    setTimeout(() => {
      copiedLink.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy link:", err);
  }
}
</script>

<style scoped></style>
