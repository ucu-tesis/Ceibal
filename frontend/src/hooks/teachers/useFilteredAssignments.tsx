import { Assignment } from "@/api/teachers/teachers";
import { useMemo } from "react";

const assignmentFilter =
  (query: string, sectionFilter?: string, chapterFilter?: string) =>
  // TODO: Modify to use section and chapter titles instead of ids
  ({
    reading_title,
    section_id,
    chapter_id,
  }: Omit<Assignment, "due_date"> & { due_date: Date }) =>
    reading_title.toLowerCase().includes(query) &&
    (sectionFilter ? sectionFilter === `${section_id}` : true) &&
    (chapterFilter ? chapterFilter === `${chapter_id}` : true);

const useFilteredAssignments = (
  assignments: (Omit<Assignment, "due_date"> & { due_date: Date })[],
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
