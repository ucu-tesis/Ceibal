export type ReadingStatus = "PENDING" | "WORKING" | "COMPLETED" | "FAILED";

export interface Reading {
  id: number;
  image: string;
  title: string;
  score: number;
  status: ReadingStatus;
  dateSubmitted: string;
}

export type ReadingMinimalInfo = Pick<Reading, "id" | "title"> & {
  dueDate?: Date;
};
