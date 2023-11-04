import axiosInstance from "../axiosInstance";

export interface CompletedReadingsRequest {
  page: number;
  pageSize: number;
}

export type ReadingStatus = "PENDING" | "WORKING" | "COMPLETED" | "FAILED";

interface ReadingResponse {
  id: number;
  date_submitted: string;
  title: string;
  image: string;
  score: number;
  status: ReadingStatus;
}

export interface CompletedReadingsResponse {
  total: number;
  page: number;
  page_size: number;
  Readings: ReadingResponse[];
}

export const fetchCompletedReadings = ({
  page,
  pageSize,
}: CompletedReadingsRequest) =>
  axiosInstance
    .get<CompletedReadingsResponse>(`/students/readings/completed`, {
      params: { page, pageSize },
    })
    .then((res) => res.data);
