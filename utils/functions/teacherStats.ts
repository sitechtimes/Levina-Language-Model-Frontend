import type {
  AssignmentInstance,
  AssignmentQuestion,
  ClassAssignmentStats,
  StudentAssignmentResult,
  TeacherAssignment,
} from "../types/assignments";
import type { TeacherStudent } from "../types/teacherStats";
import { calculateClassStats, gradeStudentAttempt } from "./autoGrade";

export function buildStudentResults(
  students: TeacherStudent[],
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

export function getClassStats(results: StudentAssignmentResult[]): ClassAssignmentStats {
  return calculateClassStats(results);
}

export function getPieChartStyle(stats: ClassAssignmentStats): { background: string } {
  const total = stats.totalCorrect + stats.totalIncorrect + stats.totalPending;
  if (total === 0) return { background: "#9ca3af" };

  const correctEnd = (stats.totalCorrect / total) * 100;
  const incorrectEnd = correctEnd + (stats.totalIncorrect / total) * 100;

  return {
    background: `conic-gradient(#22c55e 0% ${correctEnd}%, #ef4444 ${correctEnd}% ${incorrectEnd}%, #eab308 ${incorrectEnd}% 100%)`,
  };
}
