export type ReadingStatus = "PENDING" | "WORKING" | "COMPLETED" | "FAILED";

export interface Reading {
  studentName: string;
  studentId: string;
  email: string;
  status: string;
  dateSubmitted: string;
}
