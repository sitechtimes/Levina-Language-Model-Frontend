export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!import.meta.client) return;
  if (to.name === from.name && Object.keys(to.params).every((param) => to.params[param] === from.params[param])) return; // prevent middleware from running when changing route queries

  const userStore = useUserStore();
  const { teacherCourses, teacherCurrentCourse } = storeToRefs(userStore);

  if (!teacherCourses.value) return;
  const courseID = Number(to.params.courseID);

  teacherCurrentCourse.value = teacherCourses.value.find((course) => course.id === courseID);
  if (!teacherCurrentCourse.value) return await navigateTo(`/teacher/dashboard?course=${courseID}`);

  if (from.name === "teacher-dashboard" && to.name !== "teacher-course-courseID") return; // if we're not going to course page from dashboard
});