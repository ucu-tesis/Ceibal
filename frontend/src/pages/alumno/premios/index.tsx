import Head from "next/head";
import React from "react";
import styles from "./premios.module.css";
import ProgressBar from "@/components/progress/ProgressBar";
import BronceAward from "@/assets/images/premio_bronce.svg";
import ImageButton from "@/components/buttons/ImageButton";
import { bronzeAward, goldAward, silverAward } from "@/constants/constants";

const Premios: React.FC = () => {
  return (
    <>
      <Head>
        <title>Colección de premios</title>
      </Head>
      <div className={`${styles.container} col`}>
        <h1 tabIndex={0}>Logros</h1>
        <ProgressBar value={80}></ProgressBar>
        <h2 tabIndex={0}>Maestría de logros</h2>
        <div className={`${styles.awards} row`}>
          <ImageButton
            src={BronceAward}
            altText={bronzeAward}
            description="50% de los logros completados"
          ></ImageButton>
          <ImageButton
            src={BronceAward}
            altText={silverAward}
            description="80% de los logros completados"
            variant="silver"
          ></ImageButton>
          <ImageButton
            src={BronceAward}
            altText={goldAward}
            description="100% de los logros completados"
            variant="gold"
          ></ImageButton>
        </div>
        <h2 tabIndex={0}>Generales</h2>
        <div className={`${styles.awards} row`}>
          <ImageButton
            src={BronceAward}
            altText={bronzeAward}
            description="exploraste 5 lecturas"
          ></ImageButton>
          <ImageButton
            src={BronceAward}
            altText={bronzeAward}
            description="exploraste 10 lecturas"
            variant="silver"
          ></ImageButton>
          <ImageButton
            src={BronceAward}
            altText={bronzeAward}
            description="exploraste 20 lecturas"
            variant="gold"
          ></ImageButton>
          <ImageButton
            src={BronceAward}
            altText={bronzeAward}
            description="primera lectura con 3 estrellas"
          ></ImageButton>
          <ImageButton
            src={BronceAward}
            altText={bronzeAward}
            description="50% de los logros completados"
          ></ImageButton>
        </div>
      </div>
    </>
  );
};

export default Premios;
