import { useQuery } from "@tanstack/react-query";
import {
  GroupStudentsResponse,
  Student,
  fetchGroupStudents,
} from "../teachers";

export type StudentWithFullName = Student & {
  fullName: string;
};

const addFullName = (student: Student): StudentWithFullName => ({
  ...student,
  assignments_done: student.assignments_done,
  assignments_pending: student.assignments_pending,
  fullName: `${student.first_name} ${student.last_name}`,
});

const select = (group: GroupStudentsResponse) => {
  const students = group.Students?.map(addFullName) ?? [];
  return { groupName: group.name, students };
};

const useFetchGroupStudents = (groupId: number) =>
  useQuery({
    queryKey: ["teacher", "groups", groupId],
    queryFn: () => fetchGroupStudents(groupId),
    select,
  });

export default useFetchGroupStudents;
