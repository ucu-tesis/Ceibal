import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./evaluacion.module.css";
import SuarezImage from "@/assets/images/suarez.svg";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import PlayIcon from "@/assets/images/play_icon.svg";
import localFont from "next/font/local";
import Head from "next/head";

export default function Page() {
  const { evaluacion } = useRouter().query;

  //TODO integrate with evaluationID
  console.log(evaluacion);

  return (
    <>
      <Head>
        <title>Resultado de Evaluación</title>
      </Head>
      <div className={`${styles.container} col`}>
        <h1>Resultado de Evaluación</h1>
        <h2>Quiero Ser Suárez</h2>
        <Image src={SuarezImage} alt="" />
        <div className={`${styles.info} row`}>
          <div className="row">
            <label>Categoría:</label>
            <span>Fútbol</span>
          </div>
          <div className="row">
            <label>Subcategoría:</label>
            <span>Intermedio</span>
          </div>
        </div>
        <SecondaryButton variant={"outlined" as keyof Object}>
          <div>
            <Image src={PlayIcon} alt=""></Image>
          </div>
          <div>Reproducir</div>
        </SecondaryButton>
      </div>
    </>
  );
}
