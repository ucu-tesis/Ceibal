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

const useAssignmentFilterOptions = (assignments: Assignment[]) => {
  const readingCategoryOptions: Option[] = useMemo(() => {
    const categories = Array.from(
      new Set(assignments.map((assignment) => assignment.readingCategory))
    ).filter((category) => !!category);
    return [
      defaultOption,
      ...categories.map((category) => ({
        label: category,
        value: category,
      })),
    ];
  }, [assignments]);

  const readingSubcategoryOptions: Option[] = useMemo(() => {
    const subcategories = Array.from(
      new Set(assignments.map((assignment) => assignment.readingSubcategory))
    ).filter((subcategory) => !!subcategory);
    return [
      defaultOption,
      ...subcategories.map((subcategory) => ({
        label: subcategory,
        value: subcategory,
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
