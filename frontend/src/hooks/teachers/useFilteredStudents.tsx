import { StudentWithFullName } from "@/api/teachers/hooks/useFetchGroupDetails";
import { useMemo } from "react";

const studentFilter =
  (query: string) =>
  ({ fullName, cedula }: StudentWithFullName) =>
    fullName.toLowerCase().includes(query) || cedula.startsWith(query);

const useFilteredStudents = (
  students: StudentWithFullName[],
  query: string
) => {
  const filteredStudents = useMemo(
    () => students.filter(studentFilter(query)),
    [students, query]
  );
  return { filteredStudents };
};

export default useFilteredStudents;
