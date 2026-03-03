export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();

  const { error } = await tryCatch(userStore.init());
  if (error) console.error(error);
  const basePath = to.path.split('/')[1]; // 'student', 'teacher'
  console.log('basepath',basePath)

  if ((to.path.startsWith('/student') && userStore.userType !== 'student') || (to.path.startsWith('/teacher') && userStore.userType !== 'teacher')) return navigateTo(`/${userStore.userType}/dashboard`, { redirectCode: 301 });

});


//why does the student page load before redirecting when going from teacher--> student dashboard