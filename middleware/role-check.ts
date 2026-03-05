export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();

  if (!userStore.isAuth) return;

  const allowedRoles = to.meta.allowedRoles;
  
  if (!allowedRoles || allowedRoles.length === 0) return;

  if (!allowedRoles.includes(userStore.userType)) return await navigateTo(`/${userStore.userType}/dashboard`, { redirectCode: 302 });
});


//why does the student page load before redirecting when going from teacher--> student dashboard and student --> teacher