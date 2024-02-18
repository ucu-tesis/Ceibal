import { StudentStats } from '@/models/Stats';
import { useQuery } from '@tanstack/react-query';
import { fetchStudentStats } from '../teachers';

const select = (data: StudentStats): StudentStats => ({
  ...data,
  monthlyAverages: [...data.monthlyAverages].sort(
    ({ month: lhm }, { month: rhm }) => lhm - rhm,
  ),
});

const useFetchStudentStats = (evaluationGroupId: number, studentId: number, dateFrom: string, dateTo: string) =>
  useQuery({
    queryKey: [
      'teacher',
      'groups',
      'evaluations',
      evaluationGroupId,
      studentId,
      dateFrom,
      dateTo,
    ],
    queryFn: () => fetchStudentStats(evaluationGroupId, studentId, dateFrom, dateTo),
    select,
    keepPreviousData: true,
  });

export default useFetchStudentStats;
