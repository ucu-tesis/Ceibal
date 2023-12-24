import Head from "next/head";
import React from "react";
import styles from "./premios.module.css";
import ProgressBar from "@/components/progress/ProgressBar";

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
        <div className={`row`}></div>
        <h2 tabIndex={0}>Generales</h2>
      </div>
    </>
  );
};

export default Premios;
