<template>
  <header class="sticky top-0 z-30 grid h-16 w-full grid-cols-3 border-b border-neutral-300 bg-body px-5 dark:border-neutral-600">
    <div class="flex items-center justify-start gap-3">
      <button type="button" class="group flex size-10 cursor-pointer items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700" @click="emit('toggleSideMenu')">
        <img class="size-8 select-none group-active:scale-95 dark:invert" src="/ui/hamburger.svg" alt="Open navigation menu" draggable="false" />
      </button>
    </div>

    <div class="flex items-center justify-center" @click="levinaTakeover()">
      <NuxtLink to="/teacher/dashboard" class="group flex items-center justify-center gap-2">
        <img v-if="!redMode" class="size-12 select-none rounded-full group-hover:scale-105 group-active:scale-95" src="/seagull.png" aria-hidden="true" draggable="false" />
        <img v-else class="size-12 select-none rounded-full group-hover:scale-105 group-active:scale-95" src="https://tse2.mm.bing.net/th/id/OIP.KFm_ZhbHZzCM69nyORZwEgHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3" aria-hidden="true" draggable="false" />
        <span class="hidden text-2xl font-semibold group-hover:translate-x-0.5 sm:block" >Levina Language Model</span>
      </NuxtLink>
    </div>

    <div class="flex items-center justify-end gap-3">
      <TeacherDashboardCreateClass :show="showClassModal" @close="showClassModal = false" />
      <button
        v-show="route.path === '/teacher/dashboard'"
        id="create-button"
        type="button"
        class="group du-tooltip du-tooltip-bottom flex size-9 cursor-pointer items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
        data-tip="Create a class"
        @click="showClassModal = !showClassModal"
      >
        <img class="size-7 select-none group-active:scale-90 dark:invert" src="/ui/plus.svg" alt="Create a new course" draggable="false" />
      </button>
      <ToggleTheme />
      <AccountSettings />
    </div>
  </header>
</template>

<script setup lang="ts">
const emit = defineEmits<{ toggleSideMenu: [void] }>();

const route = useRoute();

const showClassModal = ref(false);
const seagullClicks = ref(0);
const redMode = ref(false);

function levinaTakeover(){
  seagullClicks.value += 1;
  if (seagullClicks.value >= 5) {
    redMode.value = !redMode.value;
    seagullClicks.value = 0;
  }
  console.log(`Seagull clicked ${seagullClicks.value} times.`);
}
</script>

<style scoped></style>
