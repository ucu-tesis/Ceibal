import { useUser } from "@/providers/UserContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CompletedReadingsRequest, fetchCompletedReadings } from "../students";

const useFetchCompletedReadings = (request: CompletedReadingsRequest) => {
  const { id } = useUser();
  const { pageSize } = request;
  return useInfiniteQuery({
    keepPreviousData: true,
    queryKey: ["student", "completed-readings", { id, ...request }],
    queryFn: ({ pageParam = 0 }) =>
      fetchCompletedReadings({ page: pageParam, pageSize }),
    getNextPageParam: (lastPage, allPages) =>
      allPages.length * pageSize < lastPage.total
        ? lastPage.page + 1
        : undefined,
  });
};
export default useFetchCompletedReadings;
