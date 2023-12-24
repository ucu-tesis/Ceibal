import Head from "next/head";
import React from "react";
import styles from "./premios.module.css";

const Premios: React.FC = () => {
  return (
    <>
      <Head>
        <title>Colección de premios</title>
      </Head>
      <div className={`${styles.container} col`}>
        <h1>Logros</h1>
        <h2>Maestría de logros</h2>
        <div className={`row`}></div>
        <h2>Generales</h2>
      </div>
    </>
  );
};

export default Premios;
