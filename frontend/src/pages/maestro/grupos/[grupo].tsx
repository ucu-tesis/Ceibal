import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { ChakraProvider, Th } from "@chakra-ui/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Badge,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { SearchIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Select from "@/components/selects/Select";
import ChakraTable from "@/components/tables/ChakraTable";
import styles from "./grupos.module.css";

type Option = {
  value?: string;
  label: string;
};

const statusTypes: any = {
  processed: "Procesado",
  error: "Error",
  pending: "Por Procesar",
};

type Evaluation = {
  student: string;
  reading: string;
  section: string;
  chapter: string;
  sentDate: string;
  status: string;
};

export default function Page({ params }: { params: { grupo: string } }) {
  const { query } = useRouter();
  const group = query.grupo;

  const BadgeComponent = (status: string) => {
    return (
      <Badge className={`${styles.badge} ${styles[status]}`}>
        {statusTypes[status]}
      </Badge>
    );
  };

  const options: Option[] = [
    { value: undefined, label: "Estado" },
    { value: "error", label: "Error" },
    { value: "pending", label: "Por Procesar" },
    { value: "processed", label: "Procesado" },
  ];

  const [statusFilter, setStatus] = useState<Option | undefined>(undefined);
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const inputRegex = /\w|\d|\-/;

  const [sampleList] = useState<Evaluation[]>([
    {
      student: "Ana García",
      reading: "Coco Bandini",
      section: "6",
      chapter: "4",
      sentDate: "2023-05-20 09:15",
      status: "processed",
    },
    {
      student: "Pedro López",
      reading: "Coco Bandini",
      section: "6",
      chapter: "4",
      sentDate: "2023-05-20 09:15",
      status: "error",
    },
    {
      student: "Luis Torres",
      reading: "Coco Bandini",
      section: "6",
      chapter: "4",
      sentDate: "2023-05-20 09:15",
      status: "pending",
    },
  ]);

  const columnList = [
    <Th tabIndex={0} key="nombre">
      Nombre
    </Th>,
    <Th tabIndex={0} key="lectura">
      Lectura
    </Th>,
    <Th tabIndex={0} key="seccion">
      Sección
    </Th>,
    <Th tabIndex={0} key="capitulo">
      Capítulo
    </Th>,
    <Th tabIndex={0} key="fechaenvio">
      Fecha de envío
    </Th>,
    <Th tabIndex={0} key="estado">
      Estado
    </Th>,
    <Th key="link" width="20%"></Th>,
  ];

  const toTableList = (list: Evaluation[]) => {
    return list.map((evaluation: Evaluation) => {
      return {
        ...evaluation,
        status: BadgeComponent(evaluation.status),
        link: (
          <Link
            href={{
              pathname: "/maestro/grupo/resultado/[alumno]",
              query: { alumno: evaluation.student, grupo: group },
            }}
          >
            Ver Resultado
          </Link>
        ),
      };
    });
  };

  const [evalList, setEvalList] = useState(sampleList);

  useEffect(() => {
    if (statusFilter?.value) {
      const newList = sampleList.filter(
        ({ status }) => status === statusFilter?.value
      );
      console.log(statusFilter);
      setEvalList(newList);
    } else {
      setEvalList(sampleList);
    }
  }, [statusFilter, sampleList]);

  useEffect(() => {
    if (searchValue) {
      const searchRegex = new RegExp(searchValue);
      const newList = sampleList.filter(({ student }) =>
        student.toLowerCase().match(searchRegex)
      );
      setEvalList(newList);
    } else {
      setEvalList(sampleList);
    }
  }, [searchValue, sampleList]);

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
            <BreadcrumbLink href="#">{group}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 tabIndex={0}>{group}</h1>
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
              placeholder="Nombre"
              onChange={({ target: { value } }) => {
                value !== ""
                  ? setSearchValue(value.toLowerCase())
                  : setSearchValue(null);
              }}
            />
            <InputRightAddon>
              <SearchIcon />
            </InputRightAddon>
          </InputGroup>
          <Select
            options={options}
            defaultValue={options[0]}
            onChange={(value) => {
              setStatus(value);
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
}
