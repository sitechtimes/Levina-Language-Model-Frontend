<template>
  <div class="flex w-full flex-col items-start justify-start">
    <div v-if="loaded" class="w-full">
      <NotFound :show-modal="showNotFound" user-type="student" :message="route.query.course ? 'class' : 'assignment'" />

      <div class="flex w-full flex-col">
        <div v-if="studentCourses && studentCourses.length > 0" class="flex flex-wrap content-start items-start justify-around gap-8">
          <!--prettier-ignore-->
          <StudentDashboardCard
            v-for="course in (sortedStudentCourses.filter((course) => !('instanceInfo' in course)) as StudentCourse[])"
            :key="course.id"
            :course="course"
          />
        </div>
      </div>
    </div>
    <ScrolltoTop />
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'student',
  middleware: 'role-check',
  requiresAuth: true,
  redirectIfAuth: false,
  allowedRoles: ['student']
});

const route = useRoute();
const store = useUserStore();
const { studentCourses, studentCurrentCourse } = storeToRefs(store);

const showNotFound = ref(false);
const loaded = ref(false);

const sortedStudentCourses = computed(() => studentCourses.value.sort((a, b) => a.period - b.period));

watch(
  () => route.query,
  (query) => {
    if (!query.course && !query.assignment) showNotFound.value = false;
  }
);

onBeforeMount(() => {
  if (route.query.course || route.query.assignment) showNotFound.value = true;
});

onMounted(() => {
  studentCurrentCourse.value = undefined;
  loaded.value = true;
});
</script>

<style scoped>
</style>
