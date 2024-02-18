import { useQuery } from '@tanstack/react-query';
import { fetchGroupStats } from '../teachers';
import { GroupStats } from '@/models/Stats';

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

const useFetchGroupStats = (evaluationGroupId: number) =>
  useQuery({
    queryKey: ['teacher', 'groups', 'evaluations', evaluationGroupId],
    queryFn: () => fetchGroupStats(evaluationGroupId),
    select,
  });

export default useFetchGroupStats;