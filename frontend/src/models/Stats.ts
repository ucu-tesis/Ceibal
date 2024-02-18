import { Assignment, StudentAssignment } from './Assignment';
import { AssignmentReading } from './AssignmentReading';

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
  averageErrors: AverageErrors;
  studentName: string;
  studentId: number;
  groupName: string;
  groupId: number;
}

export interface RepeatedWords {
  word: string;
  repetitionCount: number;
}

interface AverageErrors {
  repetitionsCount: number;
  silencesCount: number;
  generalErrors: number;
}

export interface AssignmentStats {
  assignment: Assignment;
  assignmentsDone: number;
  assignmentsPending: number;
  isOpen: boolean;
  averageScore: number;
  recordings: AssignmentReading[];
  averageErrors: AverageErrors;
  mostRepeatedWords: RepeatedWords[];
  groupId: number;
  groupName: string;
}

export interface MonthItem {
  month: number;
  value: number;
}

export interface GroupStats {
  assignmentsDone: number;
  assignmentsPending: number;
  assignmentsDelayed: number;
  monthlyScoreAverages: MonthItem[];
  monthlyAssignmentsDone: MonthItem[];
  monthlyAssignmentsPending: MonthItem[];
  monthlyAssignmentsDelayed: MonthItem[];
}
