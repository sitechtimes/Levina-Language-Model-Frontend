interface Assignment {
  /** @readonly ID of the assignment. */
  readonly id: number;
  /** @readonly Name of the assignment. */
  readonly name: string;
  /** @readonly Date string of when the assignment is due (ISO 8601 UTC). */
  readonly due_date: string;
}

export interface StudentAssignment extends Assignment {
  /** @readonly List of assignment instances for the student. */
  readonly assignmentInstances: {
    /** @readonly ID of the assignment instance. */
    readonly id: number;
    /** @readonly Whether the assignment has been submitted. */
    readonly submitted: boolean;
    /** @readonly List of question instances for the assignment. */
    readonly questionInstances: {
      /** @readonly ID of the question instance. */
      readonly id: number;
      /** @readonly Text answer for the question, if any. */
      readonly textAnswer: string | null;
      /** @readonly Audio answer for the question, if any. */
      readonly audioAnswer: string | null;
      /** @readonly Whether the question has been submitted. */
      readonly submitted: boolean;
      /** @readonly ID of the question this instance belongs to. */
      readonly question: number;
    }[];
  }[];
  /** @readonly List of questions attached to the assignment. */
  readonly questions: {
    /** @readonly ID of the question. */
    readonly id: number;
    /** @readonly Description of the question. */
    readonly description: string;
    /** @readonly Type of the question (e.g. FRQ). */
    readonly questionType: string;
    /** @readonly Content type of the question (e.g. AUDIO, TEXT). */
    readonly questionContentType: string;
    /** @readonly Text content of the question, if any. */
    readonly textQuestion: string | null;
    /** @readonly Audio content of the question, if any. */
    readonly audioQuestion: string | null;
    /** @readonly Content type of the answer (e.g. AUDIO, TEXT). */
    readonly answerContentType: string;
  }[];
}

export interface TeacherAssignment extends Assignment {
  readonly id: number;
  timeLimit: number;
  timed: boolean;
  assignmentInstances: AssignmentInstance;
  /** Date the assignment was submitted (Date(UTC)) */
  dateAssigned: Date;
  /** @readonly Number of questions in the assignment */
  readonly numQuestions: number;
  /** @readonly Whether or not the assignment can be turned in late. */
  readonly lateSubmissions: boolean;
  /** @readonly Number of questions submitted */
  readonly numSubmitted: number;
}

export interface TeacherAssignmentTemplate extends Assignment {
  timed: boolean;
  time_limit: number;
  questions: number[];
  course: number;
}

export interface AssignmentInstance {
  filter(arg0: (instance: { submitted: any; }) => any): unknown;
  /** @readonly ID of the assignment instance. */
  readonly assignment: number;
  /** @readonly ID of the student. */
  readonly student: number;
  submitted: boolean;
  time_used: number;
  /** @readonly Length of AssignmentInstances */
  readonly length: number;
}

export interface AssignmentResults {
  /** @readonly An array of the question results. extends submitAssignment*/
  readonly questionInstances: {
    /** @readonly ID of the question. */
    readonly id: number;
    /** @readonly The data for the question referenced by the instance. */
    /** readonly question: Question; */
    /** @readonly Array of dynamic user answers (IDs of selected answers). */
    readonly dynamicUserAnswers: number[] | null;
    /** @readonly The ID of the chosen answer if the assignment is static.*/
    readonly staticUserAnswer: number | null;
    /** @readonly Tells if the question is complete. */
    readonly isComplete: boolean;
    /** @readonly Time spent on the question (in seconds). */
    readonly timeSpent: number;
  }[];
}
