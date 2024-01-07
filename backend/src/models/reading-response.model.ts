export class RecordingResponse {
  id: number;
  date_submitted: Date;
  reading_title: string;
  reading_image: string;
  analysis_score: number;
  analysis_status: string;
}

export class ReadingsResponse {
  Recordings: RecordingResponse[];
  total: number;
  page: number;
  page_size: number;
}
