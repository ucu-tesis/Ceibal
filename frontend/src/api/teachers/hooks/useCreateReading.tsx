import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReading } from "../teachers";

const useCreateReading = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["teachers", "readings", "create"],
    mutationFn: createReading,
    onSuccess: () =>
      // Invalidate readings cache
      queryClient.invalidateQueries({
        queryKey: ["teacher", "readings", "all"],
      }),
  });
};

export default useCreateReading;
