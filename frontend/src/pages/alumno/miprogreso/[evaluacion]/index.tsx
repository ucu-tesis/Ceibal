import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./evaluacion.module.css";
import SuarezImage from "@/assets/images/suarez.svg";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import PlayIcon from "@/assets/images/play_icon.svg";
import Head from "next/head";
import { FastAverageColor } from "fast-average-color";
import Star from "@/assets/images/star_eval.svg";
import StarOutlined from "@/assets/images/star_eval_outlined.svg";

const starsCount = 4;

export default function Page() {
  const { evaluacion } = useRouter().query;

  //TODO integrate with evaluationID
  console.log(evaluacion);

  const [imageAverageColor, setImageAverageColor] = useState<string>();

  useEffect(() => {
    const fac = new FastAverageColor();
    const container = document.getElementById("container");
    if (container) {
      fac.getColorAsync(container.querySelector("img")).then(({ hex }) => setImageAverageColor(hex));
    }
  }, [imageAverageColor]);

  const stars = Array.from({ length: 5 }, (_, index) => (
    <Image key={`star-${index}`} src={starsCount > index ? Star : StarOutlined} alt="estrella" />
  ));

  return (
    <>
      <Head>
        <title>Resultado de Evaluación</title>
      </Head>
      <div id="container" className={`${styles.container} col`}>
        <h1>Resultado de Evaluación</h1>
        <h2>Quiero Ser Suárez</h2>
        <Image
          className={styles.rounded}
          src={SuarezImage}
          alt="quiero ser suarez"
          style={{ border: `2px solid ${imageAverageColor}` ?? "unset" }}
        />
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
        <div className={`${styles.stars} row`}>{stars}</div>
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
