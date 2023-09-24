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
  assignments_done: 3, //TODO: Remove - Should come from backend. @farchi
  assignments_pending: 4, //TODO: Remove - Should come from backend. @farchi
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
