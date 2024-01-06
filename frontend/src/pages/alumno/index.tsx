import useFetchPendingReadingsCount from "@/api/students/hooks/useFetchPendingReadingsCount";
import CardButton from "@/components/buttons/CardButton";
import Spinner from "@/components/spinners/Spinner";
import { useUser } from "@/providers/UserContext";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import ChicaLeyendo from "../../assets/images/chica_leyendo.svg";
import PodioPrimerLugar from "../../assets/images/podio_primer_lugar.svg";
import Trofeo from "../../assets/images/trofeo.svg";
import styles from "./alumno.module.css";

const AssignmentsPendingCount = ({
  isLoading,
  count,
}: {
  isLoading: boolean;
  count?: number;
}) => {
  if (isLoading) {
    return <Spinner size="small" />;
  }
  return !!count ? <span>({count})</span> : null;
};

const StudentHomeScreen: React.FC = () => {
  const router = useRouter();
  const user = useUser();
  const currentPathName = router.pathname;
  const { data, isLoading } = useFetchPendingReadingsCount();

  return (
    <>
      <Head>
        <title>Menú Principal</title>
      </Head>
      <div className={`${styles.background} col`}>
        <h1>¡Qué alegría encontrarte,</h1>
        <h1 className={`${styles["student-name"]}`}>
          {user.firstName}
          <span>!</span>
        </h1>
        <h2>¿Qué quieres hacer hoy?</h2>
        <div className={`${styles["button-container"]} col`}>
          <CardButton
            leftIcon={<Image src={ChicaLeyendo} alt="" />}
            onClick={() => router.push(`${currentPathName}/lecturas`)}
            text="Divertirme leyendo"
            rightNode={
              <AssignmentsPendingCount isLoading={isLoading} count={data} />
            }
          />
          <CardButton
            leftIcon={<Image src={PodioPrimerLugar} alt="" />}
            onClick={() => router.push(`${currentPathName}/miprogreso`)}
            text="Ver mi progreso"
          />
          <CardButton
            leftIcon={<Image src={Trofeo} alt="" />}
            onClick={() => router.push(`${currentPathName}/premios`)}
            text="Ver mi colección de premios"
          />
        </div>
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

export default StudentHomeScreen;
