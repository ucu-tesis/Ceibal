import { useQuery } from "@tanstack/react-query";
import { fetchGroupDetails } from "../teachers";

const useFetchGroupDetails = (groupId: number) =>
  useQuery({
    queryKey: ["teacher", "groups", groupId],
    queryFn: () => fetchGroupDetails(groupId),
  });

export default useFetchGroupDetails;
