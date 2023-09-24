import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { ChakraProvider, Th } from "@chakra-ui/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { SearchIcon, ChevronRightIcon } from "@chakra-ui/icons";
import ChakraTable from "@/components/tables/ChakraTable";
import styles from "./grupos.module.css";
import useFetchGroupStudents, {
  StudentWithFullName,
} from "@/api/teachers/hooks/useFetchGroupStudents";
import useFilteredStudents from "../../../hooks/teachers/useFilteredStudents";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import ErrorPage from "@/components/errorPage/ErrorPage";

const columnList = [
  <Th tabIndex={0} key="nombre">
    Nombre
  </Th>,
  <Th tabIndex={0} key="documento">
    Documento
  </Th>,
  <Th tabIndex={0} key="correo">
    Correo
  </Th>,
  <Th tabIndex={0} key="tareas-realizadas">
    Tareas Realizadas
  </Th>,
  <Th tabIndex={0} key="tareas-pendientes">
    Tareas Pendientes
  </Th>,
  <Th key="link" width="20%"></Th>,
];

const toTableList = (
  students: StudentWithFullName[],
  groupId: number,
  groupName: string
) =>
  students.map(
    ({ fullName, cedula, email, assignments_done, assignments_pending }) => ({
      fullName,
      cedula,
      email,
      assignments_done,
      assignments_pending,
      link: (
        <Link
          href={{
            pathname: "/maestro/grupos/[grupo]/resultado/[alumno]",
            query: { grupo: groupId, alumno: fullName, groupName },
          }}
        >
          Ver detalles
        </Link>
      ),
    })
  );

export default function Page({ params }: { params: { grupo: number } }) {
  const { query } = useRouter();
  const groupId = query.grupo;
  const { data, isLoading, isError } = useFetchGroupStudents(Number(groupId));
  const [searchQuery, setSearchQuery] = useState("");
  const { groupName, students } = data ?? { groupName: "", students: [] };
  const { filteredStudents } = useFilteredStudents(students ?? [], searchQuery);

  const inputRegex = /\w|\d|\-|\s/;

  if (isLoading) {
    return <LoadingPage />;
  }
  if (isError) {
    return <ErrorPage intendedAction="buscar los alumnos del grupo" />;
  }

  return (
    <ChakraProvider>
      <Head>
        <title>Grupos</title>
      </Head>
      <div className={`${styles.container}`}>
        <Breadcrumb separator={<ChevronRightIcon />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/maestro/grupos">Inicio</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="/maestro/grupos">Grupos</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">{groupName}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 tabIndex={0}>{groupName}</h1>
        <div className={`${styles.filters} row`}>
          <InputGroup>
            <Input
              width="auto"
              onKeyDown={(e) => {
                if (!e.key.match(inputRegex)) {
                  e.preventDefault();
                }
              }}
              maxLength={30}
              placeholder="Documento o nombre"
              onChange={({ target: { value } }) => {
                setSearchQuery(value.toLowerCase());
              }}
            />
            <InputRightAddon>
              <SearchIcon />
            </InputRightAddon>
          </InputGroup>
        </div>
        <ChakraTable
          columns={columnList}
          data={toTableList(filteredStudents ?? [], Number(groupId), groupName)}
        ></ChakraTable>
      </div>
    </ChakraProvider>
  );
}
