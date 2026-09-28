import type {
  AssignmentQuestion,
  AssignmentQuestionInstance,
} from "../types/assignments";

export type QuestionGradeStatus = "correct" | "incorrect" | "pending-review";

export interface QuestionGrade {
  status: QuestionGradeStatus;
}

/**
 * Placeholder for question auto-grading.
 *
 * Grading rules will be added here once the teacher-facing result flow is
 * ready to use a confirmed grading implementation.
 */
export function autoGradeQuestion(
  _question: AssignmentQuestion,
  _questionInstance: AssignmentQuestionInstance | undefined,
): QuestionGrade {
  return { status: "pending-review" };
}
