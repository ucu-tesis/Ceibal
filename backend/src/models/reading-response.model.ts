export class ReadingResponse {
  id: number;
  date_submitted: Date;
  title: string;
  image: string;
  score: number;
  status: string;
}

export class ReadingsResponse {
  Readings: ReadingResponse[];
}
