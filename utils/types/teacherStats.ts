export interface EnrolledStudent {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: number;
}

export type TeacherStudent = EnrolledStudent;

export interface AssignmentStatsViewModel {
  assignment: TeacherAssignment | undefined;
  students: EnrolledStudent[];
  results: StudentAssignmentResult[];
  stats: ClassAssignmentStats;
}
