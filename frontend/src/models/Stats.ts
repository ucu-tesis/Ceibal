import { Assignment } from "./Assignment";
import { AssignmentReading } from "./AssignmentReading";

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
}
