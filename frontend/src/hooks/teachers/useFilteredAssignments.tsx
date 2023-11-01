import { Assignment } from "@/models/Assignment";
import { useMemo } from "react";

const assignmentFilter =
  (query: string, sectionFilter?: string, chapterFilter?: string) =>
  // TODO: Modify to use section and chapter titles instead of ids
  ({ readingTitle, readingCategory, readingSubcategory }: Assignment) =>
    readingTitle.toLowerCase().includes(query) &&
    (sectionFilter ? sectionFilter === `${readingCategory}` : true) &&
    (chapterFilter ? chapterFilter === `${readingSubcategory}` : true);

const useFilteredAssignments = (
  assignments: Assignment[],
  query: string,
  category?: string,
  subcategory?: string
) => {
  const filteredAssignments = useMemo(
    () => assignments.filter(assignmentFilter(query, category, subcategory)),
    [assignments, query, category, subcategory]
  );
  return { filteredAssignments };
};

export default useFilteredAssignments;
