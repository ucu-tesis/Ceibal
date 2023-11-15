import { Reading } from "@/models/Reading";
import { useMemo } from "react";

const readingFilter =
  (query: string, readingStatus: string | undefined) =>
  ({ studentName, studentId, status }: Reading) =>
    (studentName.toLowerCase().includes(query) || studentId.startsWith(query)) && (!readingStatus || status === readingStatus);

const useFilteredEvaluations = (readings: Reading[], query: string, readingStatus: string | undefined = undefined) => {
  const filteredReadings = useMemo(
    () => readings.filter(readingFilter(query, readingStatus)),
    [readings, query, readingStatus]
  );
  return { filteredReadings };
};

export default useFilteredEvaluations;
