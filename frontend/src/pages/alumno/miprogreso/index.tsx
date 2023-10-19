import useFetchCompletedReadings from "@/api/students/hooks/useFetchCompletedReadings";
import ReadCard from "@/components/cards/ReadCard";
import Head from "next/head";
import React, { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import styles from "./miprogreso.module.css";

const pageSize = 10;

const MiProgreso: React.FC = () => {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage } = useFetchCompletedReadings({
    page: 0,
    pageSize,
  }); // This parameter is just the initial request

  const readings = useMemo(
    () => (data?.pages ?? []).flatMap(({ Readings }) => Readings),
    [data?.pages]
  );

  // Auto fetch when one of the last elements is visible
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <>
      <Head>
        <title>Mi Progreso</title>
      </Head>
      <div className={`${styles.container} row`}>
        {readings.map(
          // TODO use status and date_submitted
          ({ id, image, score, status, title, date_submitted }, index) => (
            <ReadCard
              ref={
                readings.length >= 3 && index === readings.length - 3
                  ? ref
                  : undefined
              }
              key={id}
              title={title}
              image={image}
              starsCount={Math.round(score / 20)}
            />
          )
        )}
      </div>
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
