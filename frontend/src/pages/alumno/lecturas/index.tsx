import React from "react";
import PrimaryAccordion from "@/components/accordions/PrimaryAccordion";
import SecondaryAccordion from "@/components/accordions/SecondaryAccordion";
import styles from "./lecturas.module.css";

const BusquedaLecturas: React.FC = () => {
  return (
    <div className={`${styles.container}`}>
      <h1>Ejercicios</h1>
      <PrimaryAccordion title="Seccion">
        <SecondaryAccordion title="Capitulo">
            <span>Timotea se va de viaje</span>
            <span>Quiero ser Suárez</span>
        </SecondaryAccordion>
      </PrimaryAccordion>
    </div>
  );
};

export default BusquedaLecturas;
