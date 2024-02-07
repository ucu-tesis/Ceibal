import { Group } from '@/models/Group';
import { useMemo } from 'react';

const defaultOption = {
  label: 'Todos',
  value: undefined,
};

const reducer = (schoolYears: number[], { schoolYear }: Group) =>
  schoolYears.includes(schoolYear) ? schoolYears : [...schoolYears, schoolYear];

const useGroupFilterOptions = (groups: Group[]) => {
  const schoolYears = useMemo(() => groups.reduce(reducer, []), [groups]);
  const filterOptions = useMemo(
    () => [
      defaultOption,
      ...schoolYears.map((year) => ({
        label: `${year}`,
        value: `${year}`,
      })),
    ],
    [schoolYears],
  );
  return { filterOptions };
};

export default useGroupFilterOptions;
