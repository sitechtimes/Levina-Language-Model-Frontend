<template>
  test
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "role",
  requiresAuth: true,
  redirectIfAuth: false,
  role: "student"
});

</script>

<style scoped>
</style>
