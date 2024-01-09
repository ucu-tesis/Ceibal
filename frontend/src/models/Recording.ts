export type AnalysisStatus = "PENDING" | "WORKING" | "COMPLETED" | "FAILED";

export interface Recording {
  id: number;
  url?: string;
  reading_image: string;
  reading_title: string;
  reading_category?: string;
  reading_subcategory?: string;
  analysis_score: number;
  analysis_status: AnalysisStatus;
  dateSubmitted: string;
}
