<template>
  test
</template>

<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
  redirectIfAuth: false,
  allowedRoles: ['student']
});

</script>

<style scoped>
</style>
