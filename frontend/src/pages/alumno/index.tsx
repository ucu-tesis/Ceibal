import React from "react";
import Head from "next/head";
import styles from "./alumno.module.css";
import CardButton from "@/components/buttons/CardButton";
import Image from "next/image";
import ChicaLeyendo from "../../assets/images/chica_leyendo.svg";
import PodioPrimerLugar from "../../assets/images/podio_primer_lugar.svg";
import Trofeo from "../../assets/images/trofeo.svg";

const StudentHomeScreen: React.FC = () => {
  return (
    <>
      <Head>
        <title>Menú Principal</title>
      </Head>
      <div className={`${styles.background} col`}>
        <h1>¡Qué alegría encontrarte,</h1>
        <h1 className={`${styles["student-name"]}`}>
          Laura<span>!</span>
        </h1>
        <h2>¿Qué quieres hacer hoy?</h2>
        <div className={`${styles["button-container"]} col`}>
          <CardButton
            leftIcon={<Image src={ChicaLeyendo} alt="" />}
            onClick={() => console.log("Button 1")}
            text="Divertirme leyendo"
          />
          <CardButton
            leftIcon={<Image src={PodioPrimerLugar} alt="" />}
            onClick={() => console.log("Button 2")}
            text="Ver mi progreso"
          />
          <CardButton
            leftIcon={<Image src={Trofeo} alt="" />}
            onClick={() => console.log("Button 3")}
            text="Ver mi colección de premios"
          />
        </div>
      </div>
    </>
  );
};

export default StudentHomeScreen;
