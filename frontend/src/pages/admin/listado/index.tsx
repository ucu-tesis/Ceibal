import React from "react";
import Head from "next/head";
import Link from "next/link";
import { ChakraProvider, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useDisclosure } from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { Button, Switch } from "@chakra-ui/react";
import { SearchIcon, ChevronRightIcon, AddIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
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

type Classroom = {
  school: string;
  year: string;
};

const ListTeachers: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const schools: Classroom[] = [
    { school: "Escuela 15", year: "1er año" },
    { school: "Escuela 16", year: "2do año" },
    { school: "Escuela 17", year: "2do año" },
    { school: "Escuela 18", year: "1er año" },
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
                      <Link href="#" onClick={onOpen}>
                        Editar
                      </Link>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Editar</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className={`${styles["edit-modal"]} row`}>
                <div className="col">
                  <span>Primer Nombre</span>
                  <span>Segundo Nombre</span>
                  <span>Apellido(s)</span>
                  <span>E-mail</span>
                  <span>Documento</span>
                  <span>Habilitado</span>
                </div>
                <div className="col">
                  <Input width="auto" size="xs" />
                  <Input width="auto" size="xs" />
                  <Input width="auto" size="xs" />
                  <Input width="auto" size="xs" />
                  <Input width="auto" size="xs" />
                  <Switch size="md" colorScheme="green" />
                </div>
              </div>
              <div className={`${styles["add-class"]} row`}>
                <span>Clases</span>
                <Button borderRadius="24px" leftIcon={<AddIcon />} colorScheme="green" variant="solid">
                  Agregar Clase
                </Button>
              </div>

              <TableContainer>
                <Table className={`${styles["main-table"]}`}>
                  <Thead>
                    <Tr>
                      <Th>Escuela</Th>
                      <Th>Clase</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {schools.map(({ school, year }, index) => {
                      return (
                        <Tr key={index}>
                          <Td>{school}</Td>
                          <Td>{year}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost">Cancelar</Button>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Guardar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </ChakraProvider>
  );
};

export default ListTeachers;
