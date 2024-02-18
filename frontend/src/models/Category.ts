import { Subcategory } from './Subcategory';

export interface Category {
  name: string;
  subcategories: Subcategory[];
}
