import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { ChakraProvider } from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { SearchIcon, ChevronRightIcon } from "@chakra-ui/icons";
import ChakraTable, { ChakraTableColumn } from "@/components/tables/ChakraTable";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import styles from "./grupos.module.css";
import useFetchGroupStudents, { StudentWithFullName } from "@/api/teachers/hooks/useFetchGroupStudents";
import useFilteredStudents from "../../../hooks/teachers/useFilteredStudents";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import ErrorPage from "@/components/errorPage/ErrorPage";

interface Task {
  section: string;
  chapter: string;
  reading: string;
}

const columns: ChakraTableColumn[] = [
  { label: "Nombre" },
  { label: "Documento" },
  { label: "Correo" },
  { label: "Tareas Realizadas" },
  { label: "Tareas Pendientes" },
  { label: "", reactKey: "link", width: "20%" },
];

const taskColumns: ChakraTableColumn[] = [{ label: "Sección" }, { label: "Capítulo" }, { label: "Lectura" }];

const taskList: Task[] = [
  { chapter: "4", section: "6", reading: "Coco Bandini" },
  { chapter: "5", section: "5", reading: "Los fantasmas de la escuela pasaron de clase!" },
  { chapter: "8", section: "2", reading: "Diogenes" },
];

const toTableList = (students: StudentWithFullName[], groupId: number, groupName: string) =>
  students.map(({ fullName, cedula, email, assignments_done, assignments_pending }) => ({
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
  }));

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
        <Tabs>
          <TabList>
            <Tab>Alumnos</Tab>
            <Tab>Tareas</Tab>
            <Tab>Estadísticas</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
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
                columns={columns}
                data={toTableList(filteredStudents ?? [], Number(groupId), groupName)}
              ></ChakraTable>
            </TabPanel>
            <TabPanel>
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
                    placeholder="Lectura"
                  />
                  <InputRightAddon>
                    <SearchIcon />
                  </InputRightAddon>
                </InputGroup>
              </div>
              <ChakraTable variant="simple" columns={taskColumns} data={taskList}></ChakraTable>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </ChakraProvider>
  );
}
