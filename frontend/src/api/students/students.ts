import { Category } from "@/models/Category";
import { PaginatedRecordings } from "@/models/CompletedReadings";
import { ReadingMinimalInfo } from "@/models/Reading";
import { ReadingDetails } from "@/models/ReadingDetails";
import { AnalysisStatus, Recording } from "@/models/Recording";
import { Subcategory } from "@/models/Subcategory";
import axiosInstance from "../axiosInstance";

interface RecordingsRequest {
  page: number;
  pageSize: number;
}

interface RecordingResponse {
  id: number;
  reading_image: string;
  reading_title: string;
  analysis_score: number;
  analysis_status: AnalysisStatus;
  date_submitted: string;
}

interface PaginatedRecordingsResponse {
  page: number;
  page_size: number;
  Recordings: RecordingResponse[];
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
  title: string;
}

type PendingReadingListResponse = Pick<
  ReadingListResponse,
  "reading_id" | "title"
> & { due_date: string };

interface SubcategoryListResponse {
  subcategory?: string;
  readings: ReadingListResponse[];
}

type PendingSubcategoryListResponse = Pick<
  SubcategoryListResponse,
  "subcategory"
> & { readings: PendingReadingListResponse[] };

interface CategoryListResponse {
  category: string;
  subcategories: SubcategoryListResponse[];
}

type PendingCategoryListResponse = Pick<CategoryListResponse, "category"> & {
  subcategories: PendingSubcategoryListResponse[];
};

export const fetchCompletedReadings = ({ page, pageSize }: RecordingsRequest) =>
  axiosInstance
    .get<PaginatedRecordingsResponse>(`/students/readings/completed`, {
      params: { page, pageSize },
    })
    .then(({ data }) => parseRecordingsResponse(data));

export const fetchReadingDetails = (id: number) =>
  axiosInstance
    .get<ReadingDetailsResponse>(`students/readings/details/${id}`)
    .then(({ data }) => parseReadingDetails(data));

export const fetchReadings = () =>
  axiosInstance
    .get<CategoryListResponse[]>("students/readings/all")
    .then(({ data }) => parseReadingsListResponse(data));

export const fetchPendingReadings = () =>
  axiosInstance
    .get<PendingCategoryListResponse[]>("students/readings/pending")
    .then(({ data }) => parsePendingReadingsListResponse(data));

// Parse methods

const parseRecordingsResponse = (
  res: PaginatedRecordingsResponse
): PaginatedRecordings => ({
  page: res.page,
  pageSize: res.page_size,
  recordings: res.Recordings.map(parseReadingResponse),
  total: res.total,
});

const parseReadingResponse = (recording: RecordingResponse): Recording => ({
  dateSubmitted: recording.date_submitted,
  ...recording,
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
  res.map(({ category, subcategories }) => ({
    name: category,
    subcategories: subcategories.map(parseSubcategoryListResponse),
  }));

const parseSubcategoryListResponse = ({
  readings,
  subcategory,
}: SubcategoryListResponse): Subcategory => ({
  name: subcategory ?? "Otros",
  readings: readings.map(parseReadingListResponse).filter((r) => !!r.title), // Remove readings without name
});

const parseReadingListResponse = ({
  reading_id,
  title,
}: ReadingListResponse): ReadingMinimalInfo => ({
  id: reading_id,
  title,
});

const parsePendingReadingsListResponse = (
  res: PendingCategoryListResponse[]
): Category[] =>
  res.map(({ category, subcategories }) => ({
    name: category,
    subcategories: subcategories.map(parsePendingSubcategoryListResponse),
  }));

const parsePendingSubcategoryListResponse = ({
  readings,
  subcategory,
}: PendingSubcategoryListResponse): Subcategory => ({
  name: subcategory ?? "Otros",
  readings: readings.map(parsePendingReadingListResponse),
});

const parsePendingReadingListResponse = ({
  reading_id,
  title,
  due_date,
}: PendingReadingListResponse): ReadingMinimalInfo & { dueDate: Date } => ({
  id: reading_id,
  title,
  dueDate: new Date(due_date),
});
