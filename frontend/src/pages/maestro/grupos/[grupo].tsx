import useFetchGroupDetails from "@/api/teachers/hooks/useFetchGroupDetails";
import ErrorPage from "@/components/errorPage/ErrorPage";
import InputDate from "@/components/inputs/InputDate";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import Select from "@/components/selects/Select";
import ChakraTable, {
  ChakraTableColumn,
} from "@/components/tables/ChakraTable";
import useFilteredAssignments from "@/hooks/teachers/useFilteredAssignments";
import { Assignment } from "@/models/Assignment";
import { Student } from "@/models/Student";
import { AddIcon, ChevronRightIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  ChakraProvider,
  Checkbox,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import {
  CategoryScale,
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  Title,
} from "chart.js";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import useFilteredStudents from "../../../hooks/teachers/useFilteredStudents";
import styles from "./grupos.module.css";

const columns: ChakraTableColumn[] = [
  { label: "Nombre" },
  { label: "Documento" },
  { label: "Correo" },
  { label: "Tareas Realizadas" },
  { label: "Tareas Pendientes" },
  { label: "", reactKey: "link", width: "20%" },
];

const assignmentColumns: ChakraTableColumn[] = [
  { label: "Sección" },
  { label: "Capítulo" },
  { label: "Lectura" },
  { label: "Fecha de Entrega" },
];

const assignmentColumnsModal: ChakraTableColumn[] = [
  { label: "" },
  { label: "Sección" },
  { label: "Capítulo" },
  { label: "Lectura" },
];

const toTableList = (students: Student[], groupId: number, groupName: string) =>
  students.map(
    ({ fullName, cedula, email, assignmentsDone, assignmentsPending }) => ({
      fullName,
      cedula,
      email,
      assignmentsDone,
      assignmentsPending,
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

const toAssignmentTableList = (assignments: Assignment[]) =>
  assignments.map(
    ({
      sectionId,
      chapterId,
      readingTitle,
      dueDate,
      evaluationGroupReadingId,
    }) => ({
      sectionId,
      chapterId,
      readingTitle,
      dueDate: dayjs(dueDate).format("YYYY-MM-DD HH:mm"),
      link: (
        <Link
          href={{
            pathname: "", // TODO use evaluationGroupReadingId
          }}
        >
          Ver detalles
        </Link>
      ),
    })
  );

const toTableListModal = (assignments: Assignment[]) =>
  assignments.map((assignment) => ({
    checkbox: <Checkbox />,
    ...assignment,
  }));

type Option = {
  value?: string;
  label: string;
};

export default function Page({ params }: { params: { grupo: number } }) {
  const { query } = useRouter();
  const groupId = query.grupo;
  const { data, isLoading, isError } = useFetchGroupDetails(Number(groupId));
  const [searchQuery, setSearchQuery] = useState("");
  const [assignmentSearchQuery, setAssignmentSearchQuery] = useState("");
  const [modalAssignmentSearchQuery, setModalAssignmentSearchQuery] =
    useState("");
  const [sectionOption, setSectionOption] = useState<string | undefined>(
    undefined
  );
  const [sectionOptionModal, setSectionOptionModal] = useState<
    string | undefined
  >(undefined);
  const [chapterOption, setChapterOption] = useState<string | undefined>(
    undefined
  );
  const [chapterOptionModal, setChapterOptionModal] = useState<
    string | undefined
  >(undefined);
  const {
    name: groupName,
    students,
    assignments,
  } = data ?? {
    name: "",
    students: [],
    assignments: [],
  };
  const { filteredStudents } = useFilteredStudents(students ?? [], searchQuery);
  const { filteredAssignments } = useFilteredAssignments(
    assignments,
    assignmentSearchQuery,
    sectionOption,
    chapterOption
  );
  const { filteredAssignments: filteredAssignmentsModal } =
    useFilteredAssignments(
      assignments,
      modalAssignmentSearchQuery,
      sectionOptionModal,
      chapterOptionModal
    );

  console.log(`filteredAssignments: ${JSON.stringify(filteredAssignments)}`);

  const defaultOptionSections: Option = {
    label: "Todas",
    value: undefined,
  };

  const defaultOptionChapters: Option = {
    label: "Todos",
    value: undefined,
  };

  const sectionOptions: Option[] = [
    ...assignments.map(({ sectionId }) => ({
      label: `${sectionId}`,
      value: `${sectionId}`,
    })),
    defaultOptionSections,
  ];

  const chapterOptions: Option[] = [
    ...assignments.map(({ chapterId }) => ({
      label: `${chapterId}`,
      value: `${chapterId}`,
    })),
    defaultOptionChapters,
  ];

  const { isOpen, onClose, onOpen } = useDisclosure();

  const inputRegex = /\w|\d|\-|\s/;

  ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale
  );

  const dataChart = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        id: 1,
        label: "A",
        data: [5, 6, 7, 4, 3, 5],
        backgroundColor: "#B1A5FF",
        borderColor: "#B1A5FF",
      },
      {
        id: 2,
        label: "B",
        data: [3, 2, 1, 4, 7, 3],
        backgroundColor: "#FBE38E",
        borderColor: "#FBE38E",
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
          <Button
            onClick={onOpen}
            leftIcon={<AddIcon />}
            className={styles.primary}
            variant="solid"
          >
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
                data={toTableList(filteredStudents, Number(groupId), groupName)}
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
                      setAssignmentSearchQuery(value.toLowerCase());
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
              <ChakraTable
                columns={assignmentColumns}
                data={toAssignmentTableList(filteredAssignments)}
              ></ChakraTable>
            </TabPanel>
            <TabPanel>
              <div className={styles.canvas}>
                <Line data={dataChart}></Line>
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
                    setModalAssignmentSearchQuery(value.toLowerCase());
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
              columns={assignmentColumnsModal}
              data={toTableListModal(filteredAssignmentsModal)}
            ></ChakraTable>
          </ModalBody>
          <ModalFooter className={styles["flex-center"]}>
            <Button
              onClick={onClose}
              className={styles.primary}
              variant="solid"
            >
              Crear tarea
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
