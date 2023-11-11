import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import ProgressBar from "@/components/progress/ProgressBar";
import styles from "./resultado.module.css";

interface Params {
  alumno: string;
  grupo: number;
  groupName: string;
}

export default function Page({ params }: { params: Params }) {
  const router = useRouter();
  const student = router.query.alumno;
  const group = router.query.groupName;

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

          <BreadcrumbItem>
            <BreadcrumbLink href="#">Resultado</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 tabIndex={0}>Resultado de Evaluación</h1>
        <div className={`row ${styles.space}`}>
          <div className={`col ${styles.stats}`}>
            <h5 tabIndex={0}>Alumno: {student}</h5>
            <h5 tabIndex={0}>Lectura: Coco Bandini</h5>
            <h5 tabIndex={0}>Sección: 6</h5>
            <h5 tabIndex={0}>Capítulo: 4</h5>
          </div>
          <ProgressBar value="92"></ProgressBar>
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
