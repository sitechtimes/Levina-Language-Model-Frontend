<template>
    <div class="flex flex-row">
       {{ studentName }}
       <button @click="handleDeleteStudent"><img src="/close.svg" aria-hidden="true" draggable="false" class="dark:invert"></button>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    studentName: string 
}>()

function handleDeleteStudent(){}
</script>

<style scoped>

</style>