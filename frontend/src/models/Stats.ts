import { Assignment } from "./Assignment";
import { AssignmentReading } from "./AssignmentReading";

export interface RepeatedWords {
  word: string;
  repetition_count: number;
}

export interface AssignmentStats {
  assignment: Assignment;
  assignments_done: number;
  assignments_pending: number;
  isOpen: boolean;
  average_score: number;
  recordings: AssignmentReading[];
  average_errors: {
    repetitions_count: number;
    silences_count: number;
    general_errors: number;
  };
  most_repeated_words: RepeatedWords[];
}
