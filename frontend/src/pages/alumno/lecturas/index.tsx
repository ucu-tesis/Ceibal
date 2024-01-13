import { fetchPendingReadings, fetchReadings } from "@/api/students/students";
import PrimaryAccordion from "@/components/accordions/PrimaryAccordion";
import SecondaryAccordion from "@/components/accordions/SecondaryAccordion";
import ErrorPage from "@/components/errorPage/ErrorPage";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import ReadingTable from "@/components/tables/ReadingTable";
import { Category } from "@/models/Category";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import React from "react";
import styles from "./lecturas.module.css";

const PENDING_READINGS_NOTE =
  "Parece que tenés tareas pendientes. Cuando las termines, vas a poder ver todas las lecturas del sistema.";

const useFetchReadings = () =>
  useQuery({
    queryKey: ["student", "readings", "all"],
    queryFn: fetchReadings,
  });

const useFetchPendingReadings = () =>
  useQuery({
    queryKey: ["student", "readings", "pending"],
    queryFn: fetchPendingReadings,
  });

const Readings: React.FC<{
  readings: Category[];
  subtitle?: string;
  title: string;
}> = ({ readings, subtitle, title }) => {
  return (
    <>
      <h1>{title}</h1>
      {subtitle && <h3>{subtitle}</h3>}
      {readings.map(({ name, subcategories }, categoryIndex) => (
        <PrimaryAccordion
          title={name}
          key={`category-${name}-${categoryIndex}`}
        >
          {subcategories.map(
            ({ name: subCategoryName, readings }, subcategoryIndex) => (
              <div key={`subcategory-${subCategoryName}-${subcategoryIndex}`}>
                <SecondaryAccordion title={subCategoryName}>
                  <ReadingTable readings={readings} />
                </SecondaryAccordion>
                {subcategoryIndex < subcategories.length - 1 && (
                  <div className={styles.secondaryAccordionSpacer} />
                )}
              </div>
            )
          )}
        </PrimaryAccordion>
      ))}
    </>
  );
};

const ReadingsSelectionScreen: React.FC = () => {
  const {
    data: readings,
    isLoading: isLoadingReadings,
    isError: isErrorReadings,
  } = useFetchReadings();

  const {
    data: pendingReadings,
    isLoading: isLoadingPendingReadings,
    isError: isErrorPendingReadings,
  } = useFetchPendingReadings();

  if (isLoadingReadings || isLoadingPendingReadings) {
    return <LoadingPage />;
  }

  if (isErrorReadings || isErrorPendingReadings) {
    return <ErrorPage intendedAction="cargar lecturas" />;
  }

  return (
    <>
      <Head>
        <title>Divertirme leyendo</title>
      </Head>
      <div className={`${styles.container}`}>
        {pendingReadings.length > 0 && (
          <Readings
            readings={pendingReadings}
            title="Tareas Pendientes"
            subtitle={PENDING_READINGS_NOTE}
          />
        )}
        {pendingReadings.length === 0 && (
          <Readings readings={readings} title="Ejercicios" />
        )}
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
