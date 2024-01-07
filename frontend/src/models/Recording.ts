export type AnalysisStatus = "PENDING" | "WORKING" | "COMPLETED" | "FAILED";

export interface Recording {
  id: number;
  reading_image: string;
  reading_title: string;
  analysis_score: number;
  analysis_status: AnalysisStatus;
  dateSubmitted: string;
}
