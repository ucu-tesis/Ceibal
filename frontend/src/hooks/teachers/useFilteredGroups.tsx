import { Group } from '@/models/Group';
import { useMemo } from 'react';

const groupFilter =
  (query: string) =>
  ({ schoolYear }: Group) =>
    `${schoolYear}` === query;

const useFilteredGroups = (groups: Group[], query: string | undefined) => {
  const filteredGroups = useMemo(
    () => (query ? groups.filter(groupFilter(query)) : groups),
    [groups, query],
  );
  return { filteredGroups };
};

export default useFilteredGroups;
