import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  ChakraProvider,
  Button,
  Modal,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Checkbox,
  ModalFooter,
} from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { SearchIcon, ChevronRightIcon, AddIcon } from "@chakra-ui/icons";
import ChakraTable, { ChakraTableColumn } from "@/components/tables/ChakraTable";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import styles from "./grupos.module.css";
import useFetchGroupStudents, { StudentWithFullName } from "@/api/teachers/hooks/useFetchGroupStudents";
import useFilteredStudents from "../../../hooks/teachers/useFilteredStudents";
import useFilteredTasks from "@/hooks/teachers/useFilteredTasks";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import ErrorPage from "@/components/errorPage/ErrorPage";
import Select from "@/components/selects/Select";
import InputDate from "@/components/inputs/InputDate";
import SentTasksIcon from "../../../assets/images/lecturas_enviadas.svg";
import PendingTasksIcon from "../../../assets/images/lecturas_pendientes.svg";
import IncompleteTasksIcon from "../../../assets/images/lecturas_atrasadas.svg";

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

const taskColumnsModal: ChakraTableColumn[] = [
  { label: "" },
  { label: "Sección" },
  { label: "Capítulo" },
  { label: "Lectura" },
];

const taskList: Task[] = [
  { section: "6", chapter: "4", reading: "Coco Bandini" },
  { section: "5", chapter: "5", reading: "Los fantasmas de la escuela pasaron de clase!" },
  { section: "2", chapter: "8", reading: "Diogenes" },
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

const toTableListTask = (tasks: Task[]) =>
  tasks.map((task) => ({
    ...task,
    link: (
      <Link
        href={{
          pathname: "#",
        }}
      >
        Ver detalles
      </Link>
    ),
  }));

const toTableListModal = (tasks: Task[]) =>
  tasks.map((task) => ({
    checkbox: <Checkbox />,
    ...task,
  }));

type Option = {
  value?: string;
  label: string;
};

export default function Page({ params }: { params: { grupo: number } }) {
  const { query } = useRouter();
  const groupId = query.grupo;
  const { data, isLoading, isError } = useFetchGroupStudents(Number(groupId));
  const [searchQuery, setSearchQuery] = useState("");
  const [taskSearchQuery, setTaskSearchQuery] = useState("");
  const [modalTaskSearchQuery, setModalTaskSearchQuery] = useState("");
  const [sectionOption, setSectionOption] = useState<string | undefined>(undefined);
  const [sectionOptionModal, setSectionOptionModal] = useState<string | undefined>(undefined);
  const [chapterOption, setChapterOption] = useState<string | undefined>(undefined);
  const [chapterOptionModal, setChapterOptionModal] = useState<string | undefined>(undefined);
  const { groupName, students } = data ?? { groupName: "", students: [] };
  const { filteredStudents } = useFilteredStudents(students ?? [], searchQuery);
  const { filteredTasks } = useFilteredTasks(taskList, taskSearchQuery, sectionOption, chapterOption);
  const { filteredTasks: filteredTasksModal } = useFilteredTasks(
    taskList,
    modalTaskSearchQuery,
    sectionOptionModal,
    chapterOptionModal
  );

  const defaultOptionSections: Option = {
    label: "Todas",
    value: undefined,
  };

  const defaultOptionChapters: Option = {
    label: "Todos",
    value: undefined,
  };

  const sectionOptions: Option[] = [
    ...taskList.map(({ section }) => ({ label: section, value: section })),
    defaultOptionSections,
  ];

  const chapterOptions: Option[] = [
    ...taskList.map(({ chapter }) => ({ label: chapter, value: chapter })),
    defaultOptionChapters,
  ];

  const { isOpen, onClose, onOpen } = useDisclosure();

  const inputRegex = /\w|\d|\-|\s/;

  ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, BarElement);

  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"];

  const dataLine = {
    labels: months,
    datasets: [
      {
        id: 1,
        label: "Grupos",
        data: [5, 6, 7, 4, 3, 5],
        backgroundColor: "#B1A5FF",
        borderColor: "#B1A5FF",
      },
      {
        id: 2,
        label: "Promedio",
        data: [3, 2, 1, 4, 7, 3],
        backgroundColor: "#FBE38E",
        borderColor: "#FBE38E",
      },
    ],
  };

  const dataBar = {
    labels: months,
    datasets: [
      {
        label: "Tareas",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: "#FED0EEB2",
        borderColor: "#FED0EEB2",
        borderWidth: 1,
      },
      {
        label: "Promedio",
        data: [35, 49, 50, 61, 26, 45, 30],
        backgroundColor: "#D0E8FFB2",
        borderColor: "#D0E8FFB2",
        borderWidth: 1,
      },
    ],
  };

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
        <div className={`${styles.space} row`}>
          <h1 tabIndex={0}>{groupName}</h1>
          <Button onClick={onOpen} leftIcon={<AddIcon />} className={styles.primary} variant="solid">
            Agregar tareas
          </Button>
        </div>
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
                    onChange={({ target: { value } }) => {
                      setTaskSearchQuery(value.toLowerCase());
                    }}
                    maxLength={30}
                    placeholder="Lectura"
                  />
                  <InputRightAddon>
                    <SearchIcon />
                  </InputRightAddon>
                </InputGroup>
                <div className="col">
                  <label>Sección</label>
                  <Select
                    defaultValue={defaultOptionSections}
                    options={sectionOptions}
                    onChange={(option) => {
                      setSectionOption(option.value);
                    }}
                  ></Select>
                </div>
                <div className="col">
                  <label>Capítulo</label>
                  <Select
                    defaultValue={defaultOptionChapters}
                    options={chapterOptions}
                    onChange={(option) => {
                      setChapterOption(option.value);
                    }}
                  ></Select>
                </div>
              </div>
              <ChakraTable columns={taskColumns} data={toTableListTask(filteredTasks)}></ChakraTable>
            </TabPanel>
            <TabPanel>
              <h2>Resumen</h2>
              <div className={styles["stats-box"]}>
                <div className="col">
                  <div className="row">
                    <Image alt="lecturas enviadas" src={SentTasksIcon} />
                    <span>Enviadas: 25</span>
                  </div>
                  <div className="row">
                    <Image alt="lecturas pendientes" src={PendingTasksIcon} />
                    <span>Pendientes: 25</span>
                  </div>
                  <div className="row">
                    <Image alt="lecturas atrasadas" src={IncompleteTasksIcon} />
                    <span>Atrasadas: 25</span>
                  </div>
                </div>
              </div>
              <div className={`row ${styles.canvas}`}>
                <Line data={dataLine}></Line>
                <Bar data={dataBar}></Bar>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className={styles["modal-content"]}>
          <ModalHeader tabIndex={0}>Crear Tarea</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <div className={`${styles.desc} row`}>
                <span tabIndex={0}>Fecha límite:</span>
                <InputDate></InputDate>
              </div>
            </div>
            <div className={`${styles.filters} row`}>
              <InputGroup className={styles.small}>
                <Input
                  width="auto"
                  onKeyDown={(e) => {
                    if (!e.key.match(inputRegex)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={({ target: { value } }) => {
                    setModalTaskSearchQuery(value.toLowerCase());
                  }}
                  maxLength={30}
                  placeholder="Lectura"
                />
                <InputRightAddon>
                  <SearchIcon />
                </InputRightAddon>
              </InputGroup>
              <div className="col">
                <label>Sección</label>
                <Select
                  defaultValue={defaultOptionSections}
                  options={sectionOptions}
                  onChange={(option) => {
                    setSectionOptionModal(option.value);
                  }}
                ></Select>
              </div>
              <div className="col">
                <label>Capítulo</label>
                <Select
                  defaultValue={defaultOptionChapters}
                  options={chapterOptions}
                  onChange={(option) => {
                    setChapterOptionModal(option.value);
                  }}
                ></Select>
              </div>
            </div>
            <ChakraTable
              variant="simple"
              columns={taskColumnsModal}
              data={toTableListModal(filteredTasksModal)}
            ></ChakraTable>
          </ModalBody>
          <ModalFooter className={styles["flex-center"]}>
            <Button onClick={onClose} className={styles.primary} variant="solid">
              Crear tarea
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
