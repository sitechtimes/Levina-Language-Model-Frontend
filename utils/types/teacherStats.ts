export interface AssignmentStatsViewModel {
  assignment: TeacherAssignment | undefined;
  students: EnrolledStudent[];
  results: StudentAssignmentResult[];
  stats: ClassAssignmentStats;
}
