import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { ChakraProvider, Th } from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Select from "@/components/selects/Select";
import styles from "./grupos.module.css";
import ChakraTable from "@/components/tables/ChakraTable";
import useFetchGroups from "@/pages/api/teachers/hooks/useFetchGroups";
import useFilteredGroups from "./hooks/useFilteredGroups";
import useGroupFilterOptions from "./hooks/useGroupFilterOptions";
import { Group } from "@/pages/api/teachers/teachers";

const TEACHER_CI = 10001; // TODO: Replace when auth integration is done.

type Option = {
  value?: string;
  label: string;
};

const columnList = [
  <Th tabIndex={0} key="grupo">
    Grupo
  </Th>,
  <Th tabIndex={0} key="anio">
    Año
  </Th>,
  <Th key="link" width="40%"></Th>,
];

const toTableList = (groups: Group[]) => {
  return groups.map(({ name, school_year, id }) => {
    return {
      name,
      school_year,
      link: (
        <Link
          href={{
            pathname: "/maestro/grupos/[grupo]",
            query: { grupo: id },
          }}
        >
          Ver alumnos
        </Link>
      ),
    };
  });
};

const EvaluationList: React.FC = () => {
  const { data: groups } = useFetchGroups(TEACHER_CI);
  const [yearFilter, setYear] = useState<Option | undefined>(undefined);
  const { filteredGroups } = useFilteredGroups(groups ?? [], yearFilter?.value);
  const { filterOptions } = useGroupFilterOptions(groups ?? []);

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
            options={filterOptions}
            defaultValue={filterOptions[0]}
            onChange={(value) => {
              setYear(value);
            }}
          ></Select>
        </div>
        <ChakraTable
          columns={columnList}
          data={toTableList(filteredGroups)}
        ></ChakraTable>
      </div>
    </ChakraProvider>
  );
};

export default EvaluationList;
