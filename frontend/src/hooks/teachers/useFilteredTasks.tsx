import { useMemo } from "react";

// TODO integrate with backend API
interface Task {
  section: string;
  chapter: string;
  reading: string;
}

const taskFilter =
  (query: string, sectionFilter?: string) =>
  ({ reading, section }: Task) =>
    (reading.toLowerCase().includes(query) || reading.startsWith(query)) &&
    (sectionFilter ? sectionFilter === section : true);

const useFilteredTasks = (tasks: Task[], query: string, section?: string) => {
  const filteredTasks = useMemo(() => tasks.filter(taskFilter(query, section)), [tasks, query, section]);
  return { filteredTasks };
};

export default useFilteredTasks;
