import type {
  AssignmentQuestion,
  AssignmentQuestionInstance,
  ClassAssignmentStats,
  StudentAssignmentResult
} from "../types/assignments";

export type QuestionGradeStatus = "correct" | "incorrect" | "pending-review";

export interface QuestionGrade {
  status: QuestionGradeStatus;
}

/**
 * Grades an individual question instance against its parent assignment question.
 *
 * Rules:
 * - Autograding is ONLY performed for MCQ questions with text answers.
 * - Non-MCQ questions (e.g. FRQ) and questions with audio answers are NOT autograded and are marked as "pending-review".
 * - For MCQ text questions:
 *   - If the student did not answer / submit the question instance, status is "incorrect".
 *   - Compares trimmed, case-insensitive student text answer against question text answer.
 */
export function autoGradeQuestion(
  question: AssignmentQuestion,
  questionInstance: AssignmentQuestionInstance | undefined
): QuestionGrade {
  // Non-MCQ questions (e.g. FRQ) are never autograded; always pending review
  if (question.questionType !== "MCQ") {
    return { status: "pending-review" };
  }

  // Audio answers cannot be autograded by text comparison; always pending review
  if (
    question.answerContentType === "AUDIO" ||
    (questionInstance?.audioAnswer && !questionInstance?.textAnswer)
  ) {
    return { status: "pending-review" };
  }

  // Unsubmitted or missing question instances for an MCQ are incorrect
  if (!questionInstance || !questionInstance.submitted) {
    return { status: "incorrect" };
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
  questionInstances: AssignmentQuestionInstance[] = []
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
  results: StudentAssignmentResult[]
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
    accuracyPercentage
  };
}
