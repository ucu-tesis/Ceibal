import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { ChakraProvider, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useDisclosure } from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { SearchIcon, ChevronRightIcon, AddIcon } from "@chakra-ui/icons";
import Select from "@/components/selects/Select";
import styles from "./evaluaciones.module.css";

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
        <div className={`${styles.filters} row`}>
          <Select
            options={options}
            defaultValue={options[0]}
            onChange={(value) => {
              setYear(value);
            }}
          ></Select>
        </div>
        <TableContainer className={`${styles["table-border"]}`}>
          <Table className={`${styles["main-table"]}`}>
            <Thead>
              <Tr>
                <Th>Grupo</Th>
                <Th>Año escolar</Th>
                <Th width="40%"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {evalList.map(({ name, year }, index) => {
                return (
                  <Tr key={index}>
                    <Td>{name}</Td>
                    <Td>{year}</Td>
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
};

export default EvaluationList;
