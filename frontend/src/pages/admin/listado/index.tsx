import React from "react";
import Head from "next/head";
import Link from "next/link";
import { ChakraProvider, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { SearchIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Select from "@/components/selects/Select";
import styles from "./listado.module.css";

type Option = {
  value: string;
  label: string;
};

type Teacher = {
  name: string;
  email: string;
  ci: string;
};

const ListTeachers: React.FC = () => {
  const options: Option[] = [
    { value: "todos", label: "Todos" },
    { value: "habilitado", label: "Habilitado" },
    { value: "deshabilitado", label: "Deshabilitado" },
  ];

  const sampleTeachers: Teacher[] = [
    { name: "Ana Gonzalez", email: "agonzalez@gmail.com", ci: "4485263-8" },
    { name: "Martín Rodriguez", email: "mrodriguez@gmail.com", ci: "4712354-3" },
    { name: "Laura Pereira", email: "lpereira@gmail.com", ci: "3025665-8" },
    { name: "María Fernandez", email: "mfernandez@gmail.com", ci: "3458974-2" },
  ];

  return (
    <ChakraProvider>
      <Head>
        <title>Maestros</title>
      </Head>
      <div className={`${styles.container}`}>
        <Breadcrumb separator={<ChevronRightIcon />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">Habilitaciones</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1>Maestros</h1>
        <div className={`${styles.filters} row`}>
          <InputGroup>
            <Input width="auto" placeholder="Documento o Nombre" />
            <InputRightAddon>
              <SearchIcon />
            </InputRightAddon>
          </InputGroup>
          <Select options={options} defaultValue={options[0]}></Select>
        </div>
        <TableContainer>
          <Table className={`${styles["main-table"]}`}>
            <Thead>
              <Tr>
                <Th>Nombre</Th>
                <Th>Mail</Th>
                <Th>Documento</Th>
                <Th width="40%"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {sampleTeachers.map(({ name, email, ci }, index) => {
                return (
                  <Tr key={index}>
                    <Td>{name}</Td>
                    <Td>{email}</Td>
                    <Td>{ci}</Td>
                    <Td textAlign="right">
                      <Link href="#">Editar</Link>
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

export default ListTeachers;
