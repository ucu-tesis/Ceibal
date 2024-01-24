import { useQuery } from "@tanstack/react-query";
import { fetchGroupStats } from "../teachers";

const useFetchGroupStats = (evaluationGroupId: number) =>
  useQuery({
    queryKey: ["teacher", "groups", "evaluations", evaluationGroupId],
    queryFn: () => fetchGroupStats(evaluationGroupId),
  });

export default useFetchGroupStats;
