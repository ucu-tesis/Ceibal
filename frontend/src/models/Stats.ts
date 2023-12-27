import { StudentAssignment } from "./Assignment";

export interface MonthlyAverage {
  groupAverageScore: number;
  month: number; // Starting from 0 as January
  studentAverageScore: number;
}

export interface StudentStats {
  assignmentsDone: number;
  assignmentsPending: number;
  assignmentsUncompleted: number;
  averageScore: number;
  assignments: StudentAssignment[];
  monthlyAverages: MonthlyAverage[];
}
