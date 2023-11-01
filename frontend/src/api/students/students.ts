import { PaginatedCompletedReadings } from "@/models/CompletedReadings";
import { Reading, ReadingStatus } from "@/models/Reading";
import axiosInstance from "../axiosInstance";

export interface CompletedReadingsRequest {
  page: number;
  pageSize: number;
}

interface ReadingResponse {
  date_submitted: string;
  id: number;
  image: string;
  score: number;
  status: ReadingStatus;
  title: string;
}

interface CompletedReadingsResponse {
  page: number;
  page_size: number;
  Readings: ReadingResponse[];
  total: number;
}

export const fetchCompletedReadings = ({
  page,
  pageSize,
}: CompletedReadingsRequest) =>
  axiosInstance
    .get<CompletedReadingsResponse>(`/students/readings/completed`, {
      params: { page, pageSize },
    })
    .then(({ data }) => parseCompletedReadingsResponse(data));

// Parse methods

const parseCompletedReadingsResponse = (
  res: CompletedReadingsResponse
): PaginatedCompletedReadings => ({
  page: res.page,
  pageSize: res.page_size,
  readings: res.Readings.map(parseReadingResponse),
  total: res.total,
});

const parseReadingResponse = (reading: ReadingResponse): Reading => ({
  dateSubmitted: reading.date_submitted,
  ...reading,
});
