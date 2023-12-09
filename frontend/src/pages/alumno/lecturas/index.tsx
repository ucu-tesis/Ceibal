import { fetchReadings } from "@/api/students/students";
import PrimaryAccordion from "@/components/accordions/PrimaryAccordion";
import SecondaryAccordion from "@/components/accordions/SecondaryAccordion";
import ErrorPage from "@/components/errorPage/ErrorPage";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import ReadingList from "@/components/tables/ReadingList";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import React from "react";
import styles from "./lecturas.module.css";

const useFetchReadings = () =>
  useQuery({
    queryKey: ["student", "readings", "all"],
    queryFn: fetchReadings,
  });

const ReadingsSelectionScreen: React.FC = () => {
  const { data, isLoading, isError } = useFetchReadings();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage intendedAction="cargar lecturas" />;
  }

  return (
    <>
      <Head>
        <title>Divertirme leyendo</title>
      </Head>
      <div className={`${styles.container}`}>
        <h1>Ejercicios</h1>
        {data.map(({ name, subcategories }, categoryIndex) => (
          <PrimaryAccordion
            title={name}
            key={`category-${name}-${categoryIndex}`}
          >
            {subcategories.map(
              ({ name: subCategoryName, readings }, subcategoryIndex) => (
                <SecondaryAccordion
                  title={subCategoryName}
                  key={`subcategory-${subCategoryName}-${subcategoryIndex}`}
                >
                  <ReadingList readings={readings} />
                </SecondaryAccordion>
              )
            )}
          </PrimaryAccordion>
        ))}
        <style jsx global>
          {`
            body {
              background: var(--ceibal-student-background);
            }
          `}
        </style>
      </div>
    </>
  );
};

export default ReadingsSelectionScreen;
