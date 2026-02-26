export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  if (!to.meta.role) return;

  if (!userStore.isAuth) return navigateTo("/login", { redirectCode: 301 });

  if (userStore.userType !== to.meta.role) return navigateTo(`/${userStore.userType}/dashboard`, { redirectCode: 301 });
});


//see what happens if i add a thing that checks if the route begins w "/student" or "/teacher" and then redirect
// and do stuff for admin role too - find better way