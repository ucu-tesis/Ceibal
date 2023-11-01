import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { ChakraProvider } from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import ProgressBar from "@/components/progress/ProgressBar";
import styles from "./alumno.module.css";
import SentTasksIcon from "../../../../assets/images/lecturas_enviadas.svg";
import PendingTasksIcon from "../../../../assets/images/lecturas_pendientes.svg";
import IncompleteTasksIcon from "../../../../assets/images/lecturas_atrasadas.svg";
import DatePicker from "react-datepicker";

import InputDate from "@/components/inputs/InputDate";

interface Params {
  alumno: string;
  grupo: number;
  groupName: string;
}

export default function Page({ params }: { params: Params }) {
  const router = useRouter();
  const student = router.query.alumno;
  const group = router.query.groupName;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <ChakraProvider>
      <Head>
        <title>Resultado Evaluación</title>
      </Head>
      <div className={`${styles.container}`}>
        <Breadcrumb separator={<ChevronRightIcon />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">Grupos</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">{group}</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">{student}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 tabIndex={0}>{student}</h1>
        <div className={`row ${styles.space}`}>
          <div className={styles["stats-box"]}>
            <div className="row">
              <ProgressBar value="92" variant="small"></ProgressBar>
              <div className="row">
                <Image alt="lecturas enviadas" src={SentTasksIcon} />
                <span>Enviadas: 25</span>
              </div>
              <div className="row">
                <Image alt="lecturas pendientes" src={PendingTasksIcon} />
                <span>Pendientes: 25</span>
              </div>
              <div className="row">
                <Image alt="lecturas atrasadas" src={IncompleteTasksIcon} />
                <span>Atrasadas: 25</span>
              </div>
            </div>
          </div>
          <div>
            <DatePicker
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
            />
          </div>
        </div>
        <h2 tabIndex={0}>Métricas</h2>
        <div className={`col ${styles.stats} ${styles.border}`}>
          <h5 tabIndex={0}>Cantidad Pausas: 4</h5>
          <h5 tabIndex={0}>Cantidad Repeticiones 4</h5>
          <h5 tabIndex={0}>Velocidad de lectura : 120 palabras/minuto</h5>
        </div>
      </div>
    </ChakraProvider>
  );
}
