import React from "react";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { SearchIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Select from "@/components/selects/Select";
import styles from "./listado.module.css";

type Option = {
  value: string;
  label: string;
};

const ListTeachers: React.FC = () => {
  const options: Option[] = [
    { value: "todos", label: "Todos" },
    { value: "habilitado", label: "Habilitado" },
    { value: "deshabilitado", label: "Deshabilitado" },
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
      </div>
    </ChakraProvider>
  );
};

export default ListTeachers;
