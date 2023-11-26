import { PaginatedCompletedReadings } from "@/models/CompletedReadings";
import { Reading, ReadingStatus } from "@/models/Reading";
import { ReadingDetails } from "@/models/ReadingDetails";
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

interface ReadingDetailsResponse {
  evaluation_group_reading_id: number;
  reading_category: string;
  reading_content: string;
  reading_id: number;
  reading_subcategory: string;
  reading_title: string;
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

export const fetchReadingDetails = (id: number) =>
  axiosInstance
    .get<ReadingDetailsResponse>(`students/readings/details/${id}`)
    .then(({ data }) => parseReadingDetails(data));

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

const parseReadingDetails = (
  readingDetails: ReadingDetailsResponse
): ReadingDetails => ({
  category: readingDetails.reading_category,
  content: readingDetails.reading_content,
  evaluationGroupReadingId: readingDetails.evaluation_group_reading_id,
  id: readingDetails.reading_id,
  subcategory: readingDetails.reading_subcategory,
  title: readingDetails.reading_title,
});
