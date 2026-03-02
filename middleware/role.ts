export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  if (!to.meta.role) return;

  if (!userStore.isAuth) return navigateTo("/login", { redirectCode: 301 });

  if ((to.path.startsWith('/student') && userStore.userType !== 'student') || (to.path.startsWith('/teacher') && userStore.userType !== 'teacher')) return navigateTo(`/${userStore.userType}/dashboard`, { redirectCode: 301 });
});