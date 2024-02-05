import { AssignmentReading } from '@/models/AssignmentReading';
import { useMemo } from 'react';

const readingFilter =
  (query: string, readingStatus: string | undefined) =>
  ({ studentName, studentId, status }: AssignmentReading) =>
    (studentName.toLowerCase().includes(query) ||
      studentId.startsWith(query)) &&
    (!readingStatus || status === readingStatus);

const useFilteredEvaluations = (
  readings: AssignmentReading[],
  query: string,
  readingStatus: string | undefined = undefined,
) => {
  const filteredReadings = useMemo(
    () => readings.filter(readingFilter(query, readingStatus)),
    [readings, query, readingStatus],
  );
  return { filteredReadings };
};

export default useFilteredEvaluations;
