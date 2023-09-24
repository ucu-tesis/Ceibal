import React from "react";
import Head from "next/head";
import Image from "next/image";
import ReadCard from "@/components/cards/ReadCard";
import SuarezReading from "../../../assets/images/suarez.svg";
import styles from "./miprogreso.module.css";

const MiProgreso: React.FC = () => {
  return (
    <>
      <Head>
        <title>Mi Progreso</title>
      </Head>
      <div className={`${styles.container} row`}>
        <ReadCard title="Quiero ser Suarez" stars={5}>
          <Image src={SuarezReading} alt="Quiero ser Suarez"></Image>
        </ReadCard>
        <ReadCard title="Quiero ser Suarez" stars={3}>
          <Image src={SuarezReading} alt="Quiero ser Suarez"></Image>
        </ReadCard>
        <ReadCard title="Quiero ser Suarez" stars={4}>
          <Image src={SuarezReading} alt="Quiero ser Suarez"></Image>
        </ReadCard>
        <ReadCard title="Quiero ser Suarez" stars={2}>
          <Image src={SuarezReading} alt="Quiero ser Suarez"></Image>
        </ReadCard>
        <ReadCard title="Quiero ser Suarez" stars={5}>
          <Image src={SuarezReading} alt="Quiero ser Suarez"></Image>
        </ReadCard>
        <ReadCard title="Quiero ser Suarez" stars={1}>
          <Image src={SuarezReading} alt="Quiero ser Suarez"></Image>
        </ReadCard>
        <ReadCard title="Quiero ser Suarez" stars={5}>
          <Image src={SuarezReading} alt="Quiero ser Suarez"></Image>
        </ReadCard>
        <ReadCard title="Quiero ser Suarez" stars={3}>
          <Image src={SuarezReading} alt="Quiero ser Suarez"></Image>
        </ReadCard>
        <ReadCard title="Quiero ser Suarez" stars={3}>
          <Image src={SuarezReading} alt="Quiero ser Suarez"></Image>
        </ReadCard>
        <ReadCard title="Quiero ser Suarez" stars={2}>
          <Image src={SuarezReading} alt="Quiero ser Suarez"></Image>
        </ReadCard>
        <ReadCard title="Quiero ser Suarez" stars={4}>
          <Image src={SuarezReading} alt="Quiero ser Suarez"></Image>
        </ReadCard>
      </div>
      <style jsx global>
        {`
          body {
            background: var(--ceibal-student-background);
          }
        `}
      </style>
    </>
  );
};

export default MiProgreso;
