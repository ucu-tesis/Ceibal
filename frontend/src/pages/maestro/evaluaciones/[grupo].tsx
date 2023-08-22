import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { ChakraProvider, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useDisclosure } from "@chakra-ui/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Badge,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { SearchIcon, ChevronRightIcon, AddIcon } from "@chakra-ui/icons";
import Select from "@/components/selects/Select";
import styles from "./evaluaciones.module.css";

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
  const router = useRouter();
  const group = router.query.grupo;

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

  const [evalList, setEvalList] = useState(sampleList);

  useEffect(() => {
    if (statusFilter?.value) {
      const newList = sampleList.filter(({ status }) => status === statusFilter?.value);
      console.log(statusFilter);
      setEvalList(newList);
    } else {
      setEvalList(sampleList);
    }
  }, [statusFilter, sampleList]);

  useEffect(() => {
    if (searchValue) {
      const searchRegex = new RegExp(searchValue);
      const newList = sampleList.filter(({ student }) => student.toLowerCase().match(searchRegex));
      setEvalList(newList);
    } else {
      setEvalList(sampleList);
    }
  }, [searchValue, sampleList]);

  return (
    <ChakraProvider>
      <Head>
        <title>Evaluaciones</title>
      </Head>
      <div className={`${styles.container}`}>
        <Breadcrumb separator={<ChevronRightIcon />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">Grupos</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1>{group}</h1>
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
                value !== "" ? setSearchValue(value.toLowerCase()) : setSearchValue(null);
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
        <TableContainer className={`${styles["table-border"]}`}>
          <Table className={`${styles["main-table"]}`}>
            <Thead>
              <Tr>
                <Th>Nombre</Th>
                <Th>Lectura</Th>
                <Th>Sección</Th>
                <Th>Capítulo</Th>
                <Th>Fecha de envío</Th>
                <Th>Estado</Th>
                <Th width="20%"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {evalList.map(({ student, reading, chapter, section, sentDate, status }, index) => {
                return (
                  <Tr key={index}>
                    <Td>{student}</Td>
                    <Td>{reading}</Td>
                    <Td>{section}</Td>
                    <Td>{chapter}</Td>
                    <Td>{sentDate}</Td>
                    <Td>
                      <Badge className={`${styles.badge} ${styles[status]}`}>{statusTypes[status]}</Badge>
                    </Td>
                    <Td textAlign="right">
                      <Link
                        href={{
                          pathname: "/maestro/evaluaciones/[grupo]",
                          query: { grupo: "a" },
                        }}
                      >
                        Ver Resultado
                      </Link>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </ChakraProvider>
  );
}
