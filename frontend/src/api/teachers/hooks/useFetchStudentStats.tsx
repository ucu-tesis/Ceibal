import { StudentStats } from "@/models/Stats";
import { useQuery } from "@tanstack/react-query";
import { fetchStudentStats } from "../teachers";

const select = (data: StudentStats): StudentStats => ({
  ...data,
  monthlyAverages: [...data.monthlyAverages].sort(
    ({ month: lhm }, { month: rhm }) => lhm - rhm
  ),
});

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
    select,
  });

export default useFetchStudentStats;
