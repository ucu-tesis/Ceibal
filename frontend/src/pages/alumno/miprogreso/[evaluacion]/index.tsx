import { useRouter } from "next/router";
import styles from "./evaluacion.module.css";

export default function Page() {
  const { evaluacion } = useRouter().query;

  //TODO integrate with evaluationID
  console.log(evaluacion);

  return (
    <div className={styles.container}>
      <h1>Resultado de evaluación</h1>
      <h2>El regalo de Oscar</h2>
    </div>
  );
}
