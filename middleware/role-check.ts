export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  const { error } = await tryCatch(userStore.init());
  if (error) console.error(error);

  if (!userStore.isAuth) return;
console.log(userStore.userType)
    if (!userStore.userType) {
      console.log("a")
    const { data } = await tryRequestEndpoint<UserInfo>("users/get-user", "GET")

    if (!data) return

    userStore.isAuth = true
    userStore.userType = data.userType === 1 ? "teacher" : "student"
  }

  if (!userStore.initialized) return
  const allowedRoles = to.meta.allowedRoles as string[] | undefined;
  
  if (!allowedRoles || allowedRoles.length === 0) return;

  if (!allowedRoles.includes(userStore.userType)) return await navigateTo(`/${userStore.userType}/dashboard`, { replace: true });
});


//why does the student page load before redirecting when going from teacher--> student dashboard and student --> teacher

