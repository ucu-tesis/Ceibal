import Head from "next/head";
import React from "react";
import styles from "./premios.module.css";
import ProgressBar from "@/components/progress/ProgressBar";
import BronceAward from "@/assets/images/premio_bronce.svg";
import ImageButton from "@/components/buttons/ImageButton";
import { bronzeAward, goldAward, silverAward } from "@/constants/constants";
import { Award } from "@/models/Award";

const masterAwardList: Award[] = [
  { category: "BRONZE", description: "50% de los logros completados", completed: true },
  { category: "SILVER", description: "80% de los logros completados", completed: true },
  { category: "GOLD", description: "100% de los logros completados", completed: true },
];

const generalAwardList: Award[] = [
  { category: "BRONZE", description: "exploraste 5 lecturas", completed: true },
  { category: "SILVER", description: "exploraste 10 lecturas", completed: true },
  { category: "GOLD", description: "exploraste 20 lecturas", completed: false },
  { category: "BRONZE", description: "primera lectura con 3 estrellas", completed: true },
  { category: "BRONZE", description: "50% de los logros completados", completed: true },
];

const categoryAltText = {
  BRONZE: bronzeAward,
  SILVER: silverAward,
  GOLD: goldAward,
};

const toAwardButtonList = (awards: Award[]) => {
  return awards.map(({ category, completed, description }) => ({
    variant: category.toLowerCase(),
    altText: categoryAltText[category],
    overlayText: !completed ? "en proceso" : undefined,
    description,
  }));
};

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
          {toAwardButtonList(masterAwardList).map(({ variant, description, altText, overlayText }, index) => {
            return (
              <ImageButton
                key={index}
                src={BronceAward}
                altText={altText}
                description={description}
                variant={variant}
                overlayText={overlayText}
              ></ImageButton>
            );
          })}
        </div>
        <h2 tabIndex={0}>Generales</h2>
        <div className={`${styles.awards} row`}>
          {toAwardButtonList(generalAwardList).map(({ variant, description, altText, overlayText }, index) => {
            return (
              <ImageButton
                key={index}
                src={BronceAward}
                altText={altText}
                description={description}
                variant={variant}
                overlayText={overlayText}
              ></ImageButton>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Premios;
