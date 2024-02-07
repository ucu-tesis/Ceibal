import { Student } from '@/models/Student';
import { useMemo } from 'react';

const studentFilter =
  (query: string) =>
  ({ fullName, cedula }: Student) =>
    fullName.toLowerCase().includes(query) || cedula.startsWith(query);

const useFilteredStudents = (students: Student[], query: string) => {
  const filteredStudents = useMemo(
    () => students.filter(studentFilter(query)),
    [students, query],
  );
  return { filteredStudents };
};

export default useFilteredStudents;
