import { Recording } from "./Recording";

export interface PaginatedRecordings {
  page: number;
  pageSize: number;
  recordings: Recording[];
  total: number;
}
