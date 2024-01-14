import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFileUpload = (evaluationGroupReadingId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/recordings/upload/${evaluationGroupReadingId}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error uploading file: " + response.status);
      }
    },
    // Invalidate cache for list of pending assignments after sending a new reading
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student", "readings", "pending"],
      });
    },
  });
};

export default useFileUpload;
