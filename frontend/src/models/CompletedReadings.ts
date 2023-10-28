import { Reading } from "./Reading";

export interface PaginatedCompletedReadings {
  page: number;
  pageSize: number;
  readings: Reading[];
  total: number;
}
