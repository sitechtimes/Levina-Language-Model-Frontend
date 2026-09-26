<template>
  <div>
    <h1 class="text-2xl font-bold mb-4 text-center p-4">Student Assignment</h1>
    <!--to do:question sidebar goes here, have each item be the title of each question -->
     <!-- <StudentAssignmentSidebar 
      :assignment="assignment"
      :currentQuestionIndex="currentQuestionIndex" 
      :triggerSubmit="triggerSubmit" 
      :isSaved="isSaved" />-->
    <StudentAssignmentQuestion
      v-for="question in assignment?.questions"
      :key="question.id"
      :question="question"

    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'role-check',
  requiresAuth: true,
  redirectIfAuth: false,
  allowedRoles: ['student']
})

const assignment = ref<StudentAssignment | null>(null)
const assignmentId = 1
const result = await requestEndpoint<StudentAssignment>(`assignments/${assignmentId}`)
assignment.value = result

</script>