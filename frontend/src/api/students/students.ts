import { Category } from "@/models/Category";
import { PaginatedCompletedReadings } from "@/models/CompletedReadings";
import { Reading, ReadingMinimalInfo, ReadingStatus } from "@/models/Reading";
import { ReadingDetails } from "@/models/ReadingDetails";
import { Subcategory } from "@/models/Subcategory";
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

interface ReadingListResponse {
  reading_id: number;
  title?: string;
}

interface SubcategoryListResponse {
  subcategory?: string;
  readings: ReadingListResponse[];
}

interface CategoryListResponse {
  category?: string;
  subcategories: SubcategoryListResponse[];
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

export const fetchReadings = () =>
  axiosInstance
    .get<CategoryListResponse[]>("students/readings/all")
    .then(({ data }) => parseReadingsListResponse(data));

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

const parseReadingsListResponse = (res: CategoryListResponse[]): Category[] =>
  res
    .map(({ category, subcategories }) => ({
      name: category ?? "",
      subcategories: subcategories
        .map(parseSubcategoryListResponse)
        .filter((s) => !!s.name), // Remove subcategories without name
    }))
    .filter((c) => !!c.name); // Remove categories without name

const parseSubcategoryListResponse = ({
  readings,
  subcategory,
}: SubcategoryListResponse): Subcategory => ({
  name: subcategory ?? "",
  readings: readings.map(parseReadingListResponse).filter((r) => !!r.title), // Remove readings without name
});

const parseReadingListResponse = ({
  reading_id,
  title,
}: ReadingListResponse): ReadingMinimalInfo => ({
  id: reading_id,
  title: title ?? "",
});
