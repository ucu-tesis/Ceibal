import { fetchCompletedReadings } from "@/api/students/students";
import ReadCard from "@/components/cards/ReadCard";
import ErrorPage from "@/components/errorPage/ErrorPage";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import Spinner from "@/components/spinners/Spinner";
import { useUser } from "@/providers/UserContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import Head from "next/head";
import React, { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import styles from "./miprogreso.module.css";
import { useRouter } from "next/router";

const useFetchCompletedReadings = () => {
  const { id } = useUser();
  const pageSize = 10;
  return useInfiniteQuery({
    keepPreviousData: true,
    queryKey: ["student", "completed-readings", id],
    queryFn: ({ pageParam = 0 }) => fetchCompletedReadings({ page: pageParam, pageSize }),
    getNextPageParam: (lastPage, allPages) =>
      allPages.length * pageSize < lastPage.total ? lastPage.page + 1 : undefined,
  });
};

const MiProgreso: React.FC = () => {
  const { ref: lastElementRef, inView: lastElementInView } = useInView();
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isError } = useFetchCompletedReadings();

  const readings = useMemo(() => (data?.pages ?? []).flatMap(({ readings }) => readings), [data?.pages]);

  const router = useRouter();
  const user = useUser();
  const currentPathName = router.pathname;

  useEffect(() => {
    if (lastElementInView && hasNextPage) {
      fetchNextPage();
    }
  }, [lastElementInView, fetchNextPage, hasNextPage]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage intendedAction="cargar tus lecturas" />;
  }

  return (
    <>
      <Head>
        <title>Mi Progreso</title>
      </Head>
      <div className={`${styles.container} row`}>
        {readings.map(
          // TODO use status and date_submitted
          ({ id, image, score, status, title, dateSubmitted }, index) => (
            <ReadCard
              ref={index === readings.length - 1 ? lastElementRef : undefined}
              key={id}
              title={title}
              image={image}
              onClick={() => router.push(`${currentPathName}/${id}`)}
              starsCount={Math.round(score / 20)}
            />
          )
        )}
      </div>
      {isFetchingNextPage && (
        <div className={`${styles["spinner-container"]}`}>
          <Spinner />
        </div>
      )}
      <style jsx global>
        {`
          body {
            background: var(--ceibal-student-background);
          }
        `}
      </style>
    </>
  );
};

export default MiProgreso;
