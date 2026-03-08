<template>
  test
  <button @click="userStore.logout">Logout</button>
</template>

<script setup lang="ts">

definePageMeta({
  middleware: 'role-check',
  requiresAuth: true,
  redirectIfAuth: false,
  allowedRoles: ['student']
});

const userStore = useUserStore();

</script>

<style scoped>
</style>
