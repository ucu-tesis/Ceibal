import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import styles from "./resultado.module.css";

type Option = {
  value?: string;
  label: string;
};

export default function Page({ params }: { params: { alumno: string; grupo: string } }) {
  const router = useRouter();
  const student = router.query.alumno;
  const group = router.query.grupo;

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
        <h1>Resultado de Evaluación</h1>
      </div>
    </ChakraProvider>
  );
}
