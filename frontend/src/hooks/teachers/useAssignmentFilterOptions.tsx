import { Assignment } from "@/models/Assignment";
import { useMemo } from "react";

type Option = {
  value?: string;
  label: string;
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
  const defaultCategoryOption: Option = useMemo(
    () => ({
      label: "Todas",
      value: undefined,
    }),
    []
  );

  const defaultSubcategoryOption: Option = useMemo(
    () => ({
      label: "Todas",
      value: undefined,
    }),
    []
  );

  const readingCategoryOptions: Option[] = useMemo(() => {
    const categories = assignments.reduce(categoryReducer, []);
    return [
      defaultCategoryOption,
      ...categories.map((category) => ({
        label: `${category}`,
        value: `${category}`,
      })),
    ];
  }, [assignments, defaultCategoryOption]);

  const readingSubcategoryOptions: Option[] = useMemo(() => {
    const subcategories = assignments.reduce(subcategoryReducer, []);
    return [
      defaultSubcategoryOption,
      ...subcategories.map((subcategory) => ({
        label: `${subcategory}`,
        value: `${subcategory}`,
      })),
    ];
  }, [assignments, defaultSubcategoryOption]);

  return {
    defaultCategoryOption,
    defaultSubcategoryOption,
    readingCategoryOptions,
    readingSubcategoryOptions,
  };
};

export default useAssignmentFilterOptions;
