<template>
  <div class="min-h-dvh w-full">
    <div class="flex min-h-dvh w-full flex-col items-center justify-start">
      <div class="flex h-16 w-full items-center justify-between border-b border-neutral-300 px-6 dark:border-neutral-700">
        <h1 class="text-2xl font-bold">Student Dashboard</h1>
      </div>

      <div class="min-h-[calc(100vh-4rem)] w-full p-4">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const userStore = useUserStore();

router.afterEach(() => {
  // Handle any student-specific routing logic
});

onMounted(() => {
  // Initialize student dashboard
});
</script>

<style scoped></style>
