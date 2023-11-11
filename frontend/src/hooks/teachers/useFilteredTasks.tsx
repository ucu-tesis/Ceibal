import { useMemo } from "react";

// TODO integrate with backend API
interface Task {
  category: string;
  subcategory: string;
  reading: string;
}

const taskFilter =
  (query: string, sectionFilter?: string, chapterFilter?: string) =>
  ({ reading, category, subcategory }: Task) =>
    reading.toLowerCase().includes(query) &&
    (sectionFilter ? sectionFilter === category : true) &&
    (chapterFilter ? chapterFilter === subcategory : true);

const useFilteredTasks = (tasks: Task[], query: string, category?: string, subcategory?: string) => {
  const filteredTasks = useMemo(
    () => tasks.filter(taskFilter(query, category, subcategory)),
    [tasks, query, category, subcategory]
  );
  return { filteredTasks };
};

export default useFilteredTasks;
