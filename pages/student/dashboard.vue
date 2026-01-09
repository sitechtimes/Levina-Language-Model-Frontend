<template>
  <div class="flex w-full flex-col items-start justify-start">
    <div class="w-full">
      <div class="flex w-full flex-col">
        <div class="flex h-full w-full items-center justify-center overflow-hidden">
          <div class="flex flex-col items-center gap-4">
            <h2 class="text-4xl font-extrabold text-[var(--text-color)] md:text-5xl">Student Dashboard</h2>
            <p class="text-lg text-[var(--text-color)]">Welcome to the student interface!</p>
            <p class="text-md text-[var(--text-color)]">This page is under development.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "student",
  requiresAuth: true,
  redirectIfAuth: false,
  allowedRoles: ["student"]
});
</script>

<style scoped></style>
