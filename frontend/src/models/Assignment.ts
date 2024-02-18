export interface Assignment {
  dueDate: Date;
  createdDate?: Date;
  evaluationGroupReadingId: number;
  readingCategory: string;
  readingId: number;
  readingSubcategory: string;
  readingTitle: string;
}

export type AssignmentStatus = 'completed' | 'pending' | 'delayed';

export interface StudentAssignment extends Assignment {
  score?: number;
  status: AssignmentStatus;
}
