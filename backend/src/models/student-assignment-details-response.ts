import { AnalysisStatus } from '@prisma/client';

export class StudentAssignmentDetailsResponse {
  analysis_id: number | null;
  student_id: number;
  student_name: string;
  evaluation_group_reading_id: number;
  reading_id: number;
  reading_title: string;
  category: string;
  subcategory: string;
  group_id: number;
  group_name: string;
  score: number | null;
  words_velocity: number | null;
  silences_count: number | null;
  repetitions_count: number | null;
  recording_id: number | null;
  recording_url: string | null;
  status: string;
  analysis_status: AnalysisStatus;
}
