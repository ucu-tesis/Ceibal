import PrimaryAccordion from "@/components/accordions/PrimaryAccordion";
import SecondaryAccordion from "@/components/accordions/SecondaryAccordion";
import ReadListTable from "@/components/tables/ReadListTable";
import Head from "next/head";
import React from "react";
import styles from "./lecturas.module.css";

const ReadingsSelectionScreen: React.FC = () => {
  return (
    <>
      <Head>
        <title>Divertirme leyendo</title>
      </Head>
      <div className={`${styles.container}`}>
        <h1>Ejercicios</h1>
        <PrimaryAccordion title="Categoría">
          <SecondaryAccordion title="Subcategoría">
            <ReadListTable />
          </SecondaryAccordion>
        </PrimaryAccordion>
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
