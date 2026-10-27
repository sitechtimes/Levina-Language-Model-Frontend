import type { AssignmentQuestion } from "./assignments";

/** Author of a statement in a live session dialogue. */
export type SessionStatementAuthor = "STUDENT" | "AI";

export interface SessionDialogue {
  readonly id: number;
  /** URL of the audio file for the opening statement. */
  readonly initialStatement: string;
  readonly description: string;
  readonly maxStatements: number;
}

export interface SessionTemplate {
  readonly id: number;
  readonly name: string;
  readonly timed: boolean;
  readonly timeLimit: number;
  readonly teacher: number;
  readonly questions: AssignmentQuestion[];
  readonly dialogues: SessionDialogue[];
}

export interface SessionQuestionInstance {
  /** @readonly ID of the session question instance. */
  readonly id: number;
  /** @readonly ID of the question represented by this instance. */
  readonly question: number;
  readonly textAnswer: string | null;
  readonly audioAnswer: string | null;
  readonly submitted: boolean;
}

export interface SessionDialogueStatement {
  readonly id: number;
  readonly text: string;
  readonly author: SessionStatementAuthor;
}

export interface SessionDialogueInstance {
  /** @readonly ID of the session dialogue instance. */
  readonly id: number;
  /** @readonly ID of the dialogue represented by this instance. */
  readonly dialogue: number;
  readonly statements: SessionDialogueStatement[];
}

export interface SessionInstance {
  /** @readonly ID of the session instance. */
  readonly id: number;
  /** @readonly ID of the session this instance belongs to. */
  readonly session: number;
  readonly studentName: string;
  readonly joinedAt: string;
  readonly submitted: boolean;
  readonly sessionQuestionInstances: SessionQuestionInstance[];
  readonly sessionDialogueInstances: SessionDialogueInstance[];
}

export interface Session {
  /** @readonly ID of the session. */
  readonly id: number;
  readonly assignmentTemplate: SessionTemplate;
  readonly host: number;
  readonly accessCode: string;
  readonly active: boolean;
  readonly sessionInstances: SessionInstance[];
}
