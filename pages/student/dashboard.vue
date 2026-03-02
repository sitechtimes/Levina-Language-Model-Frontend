<template>
  test
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "role",
  requiresAuth: true,
  redirectIfAuth: false
});

</script>

<style scoped>
</style>
