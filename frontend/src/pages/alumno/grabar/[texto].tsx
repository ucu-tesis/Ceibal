import { fetchReadingDetails } from "@/api/students/students";
import ErrorPage from "@/components/errorPage/ErrorPage";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import RecordScreen from "@/components/recordScreen/RecordScreen";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const useReadingDetails = (id: number) =>
  useQuery({
    queryKey: ["student", "reading", id],
    queryFn: () => fetchReadingDetails(id),
  });

export default function Page() {
  const { texto } = useRouter().query;
  const {
    data: readingDetails,
    isLoading,
    isError,
  } = useReadingDetails(Number(texto));

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage intendedAction="cargar la lectura" />;
  }

  return <RecordScreen readingDetails={readingDetails} />;
}
