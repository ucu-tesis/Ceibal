export interface Group {
  createdBy: number;
  id: number;
  name: string;
  schoolData?: string; // TODO: Define type
  schoolYear: number;
  teacherId: number;
}
