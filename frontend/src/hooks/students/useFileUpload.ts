import { useMutation } from "@tanstack/react-query";

const useFileUpload = (evaluationGroupReadingId: number) => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/recordings/upload/${evaluationGroupReadingId}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error uploading file: " + response.status);
      }
    },
  });
};

export default useFileUpload;
