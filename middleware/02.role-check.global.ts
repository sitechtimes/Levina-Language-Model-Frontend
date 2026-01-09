export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  
  // Skip if user is not authenticated
  if (!userStore.isAuth) return;
  
  // Check if the route has role restrictions
  const allowedRoles = to.meta.allowedRoles;
  
  // If no role restrictions, allow access
  if (!allowedRoles || allowedRoles.length === 0) return;
  
  // Check if user's role is in the allowed roles
  if (!allowedRoles.includes(userStore.userType)) {
    // Redirect to the user's appropriate dashboard
    return await navigateTo(`/${userStore.userType}/dashboard`, { redirectCode: 403 });
  }
});
