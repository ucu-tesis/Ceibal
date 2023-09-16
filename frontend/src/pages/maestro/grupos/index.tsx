import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { ChakraProvider, Th } from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Select from "@/components/selects/Select";
import styles from "./grupos.module.css";
import ChakraTable from "@/components/tables/ChakraTable";

type Option = {
  value?: string;
  label: string;
};

type Group = {
  name: string;
  year: string;
};

const EvaluationList: React.FC = () => {
  const options: Option[] = [
    { value: undefined, label: "Todos" },
    { value: "1er año", label: "1er año" },
    { value: "2do año", label: "2do año" },
    { value: "3er año", label: "3er año" },
  ];

  const [sampleList] = useState<Group[]>([
    { name: "Grupo A", year: "1er año" },
    { name: "Grupo B", year: "2do año" },
    { name: "Grupo C", year: "3er año" },
    { name: "Grupo D", year: "1er año" },
    { name: "Grupo E", year: "2do año" },
    { name: "Grupo F", year: "3er año" },
  ]);

  const [evalList, setEvalList] = useState(sampleList);
  const [yearFilter, setYear] = useState<Option | undefined>(undefined);

  useEffect(() => {
    if (yearFilter?.value) {
      const newEvalList = sampleList.filter(({ year }) => {
        return year === yearFilter.value;
      });
      setEvalList(newEvalList);
    } else {
      setEvalList(sampleList);
    }
  }, [yearFilter, sampleList]);

  const columnList = [
    <Th tabIndex={0} key="grupo">
      Grupo
    </Th>,
    <Th tabIndex={0} key="anio">
      Año escolar
    </Th>,
    <Th key="link" width="40%"></Th>,
  ];

  const toTableList = (list: Group[]) => {
    return list.map((group: Group) => {
      return {
        ...group,
        link: (
          <Link
            href={{
              pathname: "/maestro/grupos/[grupo]",
              query: { grupo: group.name },
            }}
          >
            Ver Resultado
          </Link>
        ),
      };
    });
  };

  return (
    <ChakraProvider>
      <Head>
        <title>Grupos</title>
      </Head>
      <div className={`${styles.container}`}>
        <Breadcrumb separator={<ChevronRightIcon />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Inicio</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">Grupos</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 tabIndex={0}>Grupos</h1>
        <div className={`${styles.filters} row`}>
          <Select
            options={options}
            defaultValue={options[0]}
            onChange={(value) => {
              setYear(value);
            }}
          ></Select>
        </div>
        <ChakraTable
          columns={columnList}
          data={toTableList(evalList)}
        ></ChakraTable>
      </div>
    </ChakraProvider>
  );
};

export default EvaluationList;
