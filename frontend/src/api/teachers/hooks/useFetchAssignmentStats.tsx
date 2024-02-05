import { useQuery } from '@tanstack/react-query';
import { fetchAssignmentStats } from '../teachers';

const useFetchAssignmentStats = (
  evaluationGroupId: number,
  evaluationGroupReadingId: number,
) =>
  useQuery({
    queryKey: [
      'teacher',
      'groups',
      evaluationGroupId,
      evaluationGroupReadingId,
    ],
    queryFn: () =>
      fetchAssignmentStats(evaluationGroupId, evaluationGroupReadingId),
  });

export default useFetchAssignmentStats;
