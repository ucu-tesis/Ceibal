import { Assignment } from "@/models/Assignment";
import { useMemo } from "react";

type Option = {
  value?: string;
  label: string;
};

const defaultOption: Option = {
  label: "Todas",
  value: undefined,
};

const categoryReducer = (
  categories: string[],
  { readingCategory }: Assignment
) =>
  !readingCategory || categories.includes(readingCategory)
    ? categories
    : [...categories, readingCategory];

const subcategoryReducer = (
  subcategories: string[],
  { readingSubcategory }: Assignment
) =>
  !readingSubcategory || subcategories.includes(readingSubcategory)
    ? subcategories
    : [...subcategories, readingSubcategory];

const useAssignmentFilterOptions = (assignments: Assignment[]) => {
  const readingCategoryOptions: Option[] = useMemo(() => {
    const categories = assignments.reduce(categoryReducer, []);
    return [
      defaultOption,
      ...categories.map((category) => ({
        label: `${category}`,
        value: `${category}`,
      })),
    ];
  }, [assignments]);

  const readingSubcategoryOptions: Option[] = useMemo(() => {
    const subcategories = assignments.reduce(subcategoryReducer, []);
    return [
      defaultOption,
      ...subcategories.map((subcategory) => ({
        label: `${subcategory}`,
        value: `${subcategory}`,
      })),
    ];
  }, [assignments]);

  return {
    defaultOption,
    readingCategoryOptions,
    readingSubcategoryOptions,
  };
};

export default useAssignmentFilterOptions;
