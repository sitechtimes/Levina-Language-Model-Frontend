export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!import.meta.client) return;
  if (to.name === from.name && Object.keys(to.params).every((param) => to.params[param] === from.params[param])) return; // prevent middleware from running when changing route queries

  const assignmentId = Number(to.params.assignmentId);
  if (!Number.isSafeInteger(assignmentId) || assignmentId <= 0) {
    return await navigateTo("/student/dashboard");
  }

  const [userResult, assignmentResult] = await Promise.all([
    tryRequestEndpoint<{ id: number }>("users/get-user", "GET"),
    tryRequestEndpoint<AssignmentInstanceResponse>(`assignment-instances/${assignmentId}/`, "GET"),
  ]);

  if (userResult.error || assignmentResult.error || !userResult.data || !assignmentResult.data) {
    return await navigateTo("/student/dashboard");
  }

  if (assignmentResult.data.student !== userResult.data.id) { 
    //checks to see if the assignment instance belongs to the user
    return await navigateTo("/student/dashboard");
  }
});