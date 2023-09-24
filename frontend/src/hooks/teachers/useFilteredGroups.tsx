import { Group } from "@/api/teachers/teachers";
import { useMemo } from "react";

const groupFilter =
  (query: string) =>
  ({ school_year }: Group) =>
    `${school_year}` === query;

const useFilteredGroups = (groups: Group[], query: string | undefined) => {
  const filteredGroups = useMemo(
    () => (query ? groups.filter(groupFilter(query)) : groups),
    [groups, query]
  );
  return { filteredGroups };
};

export default useFilteredGroups;
