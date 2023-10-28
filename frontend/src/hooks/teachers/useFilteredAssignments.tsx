import { Assignment } from "@/models/Assignment";
import { useMemo } from "react";

const assignmentFilter =
  (query: string, sectionFilter?: string, chapterFilter?: string) =>
  // TODO: Modify to use section and chapter titles instead of ids
  ({ readingTitle, sectionId, chapterId }: Assignment) =>
    readingTitle.toLowerCase().includes(query) &&
    (sectionFilter ? sectionFilter === `${sectionId}` : true) &&
    (chapterFilter ? chapterFilter === `${chapterId}` : true);

const useFilteredAssignments = (
  assignments: Assignment[],
  query: string,
  section?: string,
  chapter?: string
) => {
  const filteredAssignments = useMemo(
    () => assignments.filter(assignmentFilter(query, section, chapter)),
    [assignments, query, section, chapter]
  );
  return { filteredAssignments };
};

export default useFilteredAssignments;
