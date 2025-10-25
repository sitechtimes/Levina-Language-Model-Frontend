<template>
  <div class="flex min-h-dvh w-screen flex-col items-center justify-center py-12">
    <h1 class="text-5xl font-bold">Success</h1>
    <button @click="userStore.logout">Logout</button>
    <NuxtLink to="/" class="mt-3 text-neutral-600 dark:text-neutral-200"><span class="underline underline-offset-2">Return to Start Page</span> </NuxtLink>
  </div>

  <!-- Temporary Page, have change routes for login.vue and accesscode.vue -->
</template>

<script setup lang="ts">
const userStore = useUserStore();
</script>

<style scoped>

</style>
