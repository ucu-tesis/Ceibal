import { useQuery } from '@tanstack/react-query';
import { fetchGroups } from '../teachers';

const useFetchGroups = (teacherCI: number) =>
  useQuery({
    queryKey: ['teacher', 'groups', teacherCI],
    queryFn: () => fetchGroups(teacherCI),
  });

export default useFetchGroups;
