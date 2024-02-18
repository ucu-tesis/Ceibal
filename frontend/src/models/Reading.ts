export interface Reading {
  id: number;
  title: string;
  content: string;
  image_url: string;
  position: number;
  category: string;
  subcategory: string;
}

export type ReadingMinimalInfo = Pick<Reading, 'id' | 'title'> & {
  dueDate?: Date;
};
