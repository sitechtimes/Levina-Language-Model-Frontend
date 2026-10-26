import type { ClassAssignmentStats, StudentAssignmentResult, TeacherAssignment } from "./assignments";

export interface TeacherStudent {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: number;
}

export interface AssignmentStatsViewModel {
  assignment: TeacherAssignment | undefined;
  students: TeacherStudent[];
  results: StudentAssignmentResult[];
  stats: ClassAssignmentStats;
}
