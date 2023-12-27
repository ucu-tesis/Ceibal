import { useQuery } from "@tanstack/react-query";
import { fetchStudentStats } from "../teachers";

const useFetchStudentStats = (evaluationGroupId: number, studentId: number) =>
  useQuery({
    queryKey: [
      "teacher",
      "groups",
      "evaluations",
      evaluationGroupId,
      studentId,
    ],
    queryFn: () => fetchStudentStats(evaluationGroupId, studentId),
  });

export default useFetchStudentStats;
