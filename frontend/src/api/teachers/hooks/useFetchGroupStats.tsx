import { useQuery } from '@tanstack/react-query';
import { fetchGroupStats } from '../teachers';
import { GroupStats } from '@/models/Stats';
import dayjs from 'dayjs';

const select = (data: GroupStats): GroupStats => ({
  ...data,
  monthlyAssignmentsDelayed: [...data.monthlyAssignmentsDelayed].sort(
    ({ month: lhm }, { month: rhm }) => lhm - rhm,
  ),
  monthlyAssignmentsDone: [...data.monthlyAssignmentsDone].sort(
    ({ month: lhm }, { month: rhm }) => lhm - rhm,
  ),
  monthlyAssignmentsPending: [...data.monthlyAssignmentsPending].sort(
    ({ month: lhm }, { month: rhm }) => lhm - rhm,
  ),
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
