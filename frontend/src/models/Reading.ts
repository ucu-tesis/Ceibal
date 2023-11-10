export type ReadingStatus = "PENDING" | "WORKING" | "COMPLETED" | "FAILED";

export interface Reading {
  dateSubmitted: string;
  id: number;
  image: string;
  title: string;
  score: number;
  status: ReadingStatus;
}
