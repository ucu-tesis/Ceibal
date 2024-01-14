import { useQuery } from "@tanstack/react-query";
import { fetchPendingReadingsCount } from "../students";

const useFetchPendingReadingsCount = () =>
  useQuery({
    queryKey: ["student", "readings", "pending", "count"],
    queryFn: fetchPendingReadingsCount,
  });

export default useFetchPendingReadingsCount;
