import { useQuery } from "@tanstack/react-query";
import { fetchStudentAssignmentDetails } from "../teachers";

const useFetchStudentAssignmentDetails = (assignmentId: number, studentId: number) =>
  useQuery({
    queryKey: ["teacher", "groups", assignmentId, studentId],
    queryFn: () => fetchStudentAssignmentDetails(assignmentId, studentId),
  });

export default useFetchStudentAssignmentDetails;
