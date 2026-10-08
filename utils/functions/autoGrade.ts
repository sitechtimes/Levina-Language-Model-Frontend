import type {
  AssignmentQuestion,
  AssignmentQuestionInstance,
  ClassAssignmentStats,
  StudentAssignmentResult,
} from "../types/assignments";

export type QuestionGradeStatus = "correct" | "incorrect" | "pending-review";

export interface QuestionGrade {
  status: QuestionGradeStatus;
}

/**
 * Grades an individual question instance against its parent assignment question.
 *
 * Rules:
 * - Autograding is ONLY performed for MCQ questions.
 * - Non-MCQ questions (e.g. FRQ, Audio) are NOT autograded and are always marked as "pending-review".
 * - If the question instance has not been submitted or does not exist, status is "pending-review".
 * - For MCQ: Compares trimmed, case-insensitive student text answer against question text answer.
 */
export function autoGradeQuestion(
  question: AssignmentQuestion,
  questionInstance: AssignmentQuestionInstance | undefined,
): QuestionGrade {
  if (!questionInstance || !questionInstance.submitted) {
    return { status: "pending-review" };
  }

  // Non-MCQ questions are never autograded; always pending review
  if (question.questionType !== "MCQ") {
    return { status: "pending-review" };
  }

  const studentAnswer = questionInstance.textAnswer?.trim().toLowerCase();
  const correctAnswer = question.textAnswer?.trim().toLowerCase();

  if (!studentAnswer || !correctAnswer) {
    return { status: "incorrect" };
  }

  if (studentAnswer === correctAnswer) {
    return { status: "correct" };
  }

  return { status: "incorrect" };
}

/**
 * Aggregates question grades for a single student's assignment attempt.
 */
export function gradeStudentAttempt(
  questions: AssignmentQuestion[],
  questionInstances: AssignmentQuestionInstance[] = [],
): { correctCount: number; incorrectCount: number; pendingCount: number } {
  let correctCount = 0;
  let incorrectCount = 0;
  let pendingCount = 0;

  const instanceMap = new Map<number, AssignmentQuestionInstance>();
  for (const qi of questionInstances) {
    instanceMap.set(qi.question, qi);
  }

  for (const q of questions) {
    const qi = instanceMap.get(q.id);
    const { status } = autoGradeQuestion(q, qi);
    if (status === "correct") correctCount++;
    else if (status === "incorrect") incorrectCount++;
    else pendingCount++;
  }

  return { correctCount, incorrectCount, pendingCount };
}

/**
 * Calculates overall class performance statistics across all student results.
 */
export function calculateClassStats(
  results: StudentAssignmentResult[],
): ClassAssignmentStats {
  const submittedResults = results.filter((r) => r.hasSubmitted);
  const totalCorrect = submittedResults.reduce((acc, r) => acc + r.correctCount, 0);
  const totalIncorrect = submittedResults.reduce((acc, r) => acc + r.incorrectCount, 0);
  const totalPending = submittedResults.reduce((acc, r) => acc + r.pendingCount, 0);
  const totalQuestions = submittedResults.reduce((acc, r) => acc + r.totalQuestions, 0);
  const gradedQuestions = totalCorrect + totalIncorrect;

  const accuracyPercentage =
    gradedQuestions > 0 ? Math.round((totalCorrect / gradedQuestions) * 100) : 0;

  return {
    totalCorrect,
    totalIncorrect,
    totalPending,
    totalQuestions,
    submittedCount: submittedResults.length,
    totalStudents: results.length,
    accuracyPercentage,
  };
}
