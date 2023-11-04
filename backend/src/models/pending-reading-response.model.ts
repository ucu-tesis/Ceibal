export class PendingReadingResponse {
  reading_id: number;
  reading_title: string;
  due_date: Date;
}

export class PendingReadingsResponse {
  Assignments: PendingReadingResponse[];
  total: number;
  page: number;
  page_size: number;
}
