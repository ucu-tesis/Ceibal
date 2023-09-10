import React from "react";
import PrimaryAccordion from "@/components/accordions/PrimaryAccordion";
import SecondaryAccordion from "@/components/accordions/SecondaryAccordion";
import ReadListTable from "@/components/tables/ReadListTable";
import styles from "./lecturas.module.css";
import Head from "next/head";

const BusquedaLecturas: React.FC = () => {
  return (
    <>
      <Head>
        <title>Divertirme leyendo</title>
      </Head>
      <div className={`${styles.container}`}>
        <h1>Ejercicios</h1>
        <PrimaryAccordion title="Seccion">
          <SecondaryAccordion title="Capitulo">
            <ReadListTable
              data={[
                "Timotea se va de viaje",
                "Quiero ser Suárez",
                "Diógenes no quiere ser ratón",
                "Los fantasmas de la escuela pasaron de clase!",
              ]}
            ></ReadListTable>
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

export default BusquedaLecturas;
