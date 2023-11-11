import { Assignment } from "./Assignment";
import { Group } from "./Group";
import { Student } from "./Student";

export interface GroupDetails extends Group {
  students: Student[];
  assignments: Assignment[];
}
