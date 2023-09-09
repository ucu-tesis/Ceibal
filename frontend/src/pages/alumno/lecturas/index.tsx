import React from "react";
import PrimaryAccordion from "@/components/accordions/PrimaryAccordion";
import SecondaryAccordion from "@/components/accordions/SecondaryAccordion";
import ReadListTable from "@/components/tables/ReadListTable";
import styles from "./lecturas.module.css";

const BusquedaLecturas: React.FC = () => {
  return (
    <div className={`${styles.container}`}>
      <h1>Ejercicios</h1>
      <PrimaryAccordion title="Seccion">
        <SecondaryAccordion title="Capitulo">
          <ReadListTable
            data={[
              "Timotea se va de viaje",
              "Quiero ser Suárez",
              "Diógenes no quiere ser ratón",
              "Los fantasmas de la escuela !pasaron de clase!",
            ]}
          ></ReadListTable>
        </SecondaryAccordion>
      </PrimaryAccordion>
      <style jsx global>
        {`
          body {
            background: #faebdf;
          }
        `}
      </style>
    </div>
  );
};

export default BusquedaLecturas;
