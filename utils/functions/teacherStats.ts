export function buildStudentResults(
  students: EnrolledStudent[],
  assignment: TeacherAssignment | undefined,
): StudentAssignmentResult[] {
  if (!assignment) return [];

  const questions: AssignmentQuestion[] = assignment.questions || [];
  const instances = (assignment.assignmentInstances as AssignmentInstance[]) || [];

  return students.map((student) => {
    const instance = instances.find((candidate) => candidate.student === student.id);
    const hasSubmitted = !!instance?.submitted;
    const graded = hasSubmitted && instance
      ? gradeStudentAttempt(questions, instance.questionInstances || [])
      : { correctCount: 0, incorrectCount: 0, pendingCount: 0 };

    return {
      studentId: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      hasSubmitted,
      correctCount: graded.correctCount,
      incorrectCount: graded.incorrectCount,
      pendingCount: graded.pendingCount,
      totalQuestions: questions.length,
    };
  });
}
