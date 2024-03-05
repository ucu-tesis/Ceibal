import { useQuery } from '@tanstack/react-query';
import { fetchGroupStats } from '../teachers';
import { GroupStats } from '@/models/Stats';
import dayjs from 'dayjs';

const select = (data: GroupStats): GroupStats => ({
  ...data,
});

const useFetchGroupStats = (
  evaluationGroupId: number,
  dateFrom: string,
  dateTo: string,
) =>
  useQuery({
    queryKey: [
      'teacher',
      'groups',
      'evaluations',
      evaluationGroupId,
      dateFrom,
      dateTo,
    ],
    queryFn: () => fetchGroupStats(evaluationGroupId, dateFrom, dateTo),
    select,
    enabled: dayjs(dateFrom, 'YYYY-MM-DD').isBefore(
      dayjs(dateTo, 'YYYY-MM-DD'),
    ),
  });

export default useFetchGroupStats;
