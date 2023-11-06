import { useMemo } from "react";

// TODO integrate with backend API
interface Task {
  category: string;
  subcategory: string;
  reading: string;
}

const taskFilter =
  (query: string, sectionFilter?: string, chapterFilter?: string) =>
  ({ reading, category: section, subcategory: chapter }: Task) =>
    reading.toLowerCase().includes(query) &&
    (sectionFilter ? sectionFilter === section : true) &&
    (chapterFilter ? chapterFilter === chapter : true);

const useFilteredTasks = (tasks: Task[], query: string, section?: string, chapter?: string) => {
  const filteredTasks = useMemo(
    () => tasks.filter(taskFilter(query, section, chapter)),
    [tasks, query, section, chapter]
  );
  return { filteredTasks };
};

export default useFilteredTasks;
