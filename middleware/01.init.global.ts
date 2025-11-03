import { tryCatch } from "~/utils/functions/fetch";

export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp();
  const userStore = useUserStore();
  
  console.log("Running global middleware: 01.init.global");
  console.log(userStore.isAuth, to.meta.requiresAuth, to.meta.redirectIfAuth);
  if (userStore.isAuth && to.meta.redirectIfAuth) return await navigateTo(`/${userStore.userType}/dashboard`, { redirectCode: 301 });
  
  // only run on initial page load
  // https://nuxt.com/docs/guide/directory-structure/middleware#when-middleware-runs'
  
  if (!import.meta.client || !nuxtApp.isHydrating || !nuxtApp.payload.serverRendered) return;

  const { error } = await tryCatch(userStore.init());
  if (error) console.error(error);

  console.log(userStore.isAuth, to.meta.requiresAuth, to.meta.redirectIfAuth);

  if (!userStore.isAuth && to.meta.requiresAuth) return await navigateTo("/login", { redirectCode: 301 });
  else if (userStore.isAuth && to.meta.redirectIfAuth) return await navigateTo(`/${userStore.userType}/dashboard`, { redirectCode: 301 });
});