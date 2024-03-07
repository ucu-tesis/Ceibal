import { StudentStats } from '@/models/Stats';
import { useQuery } from '@tanstack/react-query';
import { fetchStudentStats } from '../teachers';
import dayjs from 'dayjs';

const select = (data: StudentStats): StudentStats => ({
  ...data,
});

const useFetchStudentStats = (
  evaluationGroupId: number,
  studentId: number,
  dateFrom: string,
  dateTo: string,
) =>
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
    queryFn: () =>
      fetchStudentStats(evaluationGroupId, studentId, dateFrom, dateTo),
    select,
    keepPreviousData: true,
    enabled: dayjs(dateFrom, 'YYYY-MM-DD').isBefore(
      dayjs(dateTo, 'YYYY-MM-DD'),
    ),
  });

export default useFetchStudentStats;
