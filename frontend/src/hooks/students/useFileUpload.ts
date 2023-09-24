import { useMutation } from "@tanstack/react-query";

type OnSuccess = ((data: Response, variables: FormData, context: unknown) => void | Promise<unknown>) | undefined;
type OnError = ((error: unknown, variables: FormData, context: unknown) => void | Promise<unknown>) | undefined;

const useFileUpload = (onSuccess: OnSuccess, onError: OnError) => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/recordings/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error uploading file: " + response.status);
      }
    },
    onSuccess,
    onError,
  });
};

export default useFileUpload;
