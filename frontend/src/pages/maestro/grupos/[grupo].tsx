import useFetchGroupDetails from "@/api/teachers/hooks/useFetchGroupDetails";
import ErrorPage from "@/components/errorPage/ErrorPage";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import Select from "@/components/selects/Select";
import ChakraTable, { ChakraTableColumn } from "@/components/tables/ChakraTable";
import useAssignmentFilterOptions from "@/hooks/teachers/useAssignmentFilterOptions";
import useChartJSInitializer from "@/hooks/teachers/useChartJSInitializer";
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
  Input,
  InputGroup,
  InputRightAddon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import IncompleteTasksIcon from "../../../assets/images/lecturas_atrasadas.svg";
import SentTasksIcon from "../../../assets/images/lecturas_enviadas.svg";
import PendingTasksIcon from "../../../assets/images/lecturas_pendientes.svg";
import useFilteredStudents from "../../../hooks/teachers/useFilteredStudents";
import styles from "./grupos.module.css";
import { dateFormats, inputRegex } from "@/constants/constants";
import AssignmentModal from "@/components/modals/AssignmentModal";
import CreateReadingModal from "@/components/modals/CreateReadingModal";

const columns: ChakraTableColumn[] = [
  { label: "Nombre" },
  { label: "Documento" },
  { label: "Correo" },
  { label: "Tareas Completadas" },
  { label: "", reactKey: "link", width: "20%" },
];

const assignmentColumns: ChakraTableColumn[] = [
  { label: "Categoría" },
  { label: "Subcategoría" },
  { label: "Lectura" },
  { label: "Fecha de Entrega" },
];

const assignmentColumnsModal: ChakraTableColumn[] = [
  { label: "" },
  { label: "Categoría" },
  { label: "Subcategoría" },
  { label: "Lectura" },
];

const studentColumnsModal: ChakraTableColumn[] = [
  { label: "" },
  { label: "Nombre" },
  { label: "Documento" },
  { label: "Correo" },
];

const toTableList = (students: Student[], groupId: number, groupName: string) =>
  students.map(({ fullName, cedula, email, assignmentsDone = 0, assignmentsPending = 0 }) => ({
    fullName,
    cedula,
    email,
    assignmentsCompleted: `${assignmentsDone}/${assignmentsDone + assignmentsPending}`,
    link: (
      <Link
        href={{
          pathname: "/maestro/grupos/[grupo]/[alumno]",
          query: { grupo: groupId, alumno: fullName, groupName },
        }}
      >
        Ver detalles
      </Link>
    ),
  }));

const toAssignmentTableList = (assignments: Assignment[], groupId: number, groupName: string) =>
  assignments.map(({ readingCategory, readingSubcategory, readingTitle, dueDate, evaluationGroupReadingId }) => ({
    readingCategory,
    readingSubcategory,
    readingTitle,
    dueDate: dayjs(dueDate).format(dateFormats.assignmentDueDate),
    link: (
      <Link
        href={{
          pathname: "/maestro/grupos/[grupo]/tarea/[tarea]",
          query: { grupo: groupId, tarea: readingTitle, groupName, readingCategory, readingSubcategory },
        }}
      >
        Ver detalles
      </Link>
    ),
  }));

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

const steps = ["Agregar Tareas", "Agregar Alumnos", "Resumen"];

export default function Page({ params }: { params: { grupo: number } }) {
  const { query } = useRouter();
  const groupId = query.grupo;
  const { data, isLoading, isError } = useFetchGroupDetails(Number(groupId));
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryOption, setCategoryOption] = useState<string | undefined>(undefined);
  const [subcategoryOption, setSubcategoryOption] = useState<string | undefined>(undefined);
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

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const [assignmentSearchQuery, setAssignmentSearchQuery] = useState("");

  useChartJSInitializer();

  const { filteredAssignments } = useFilteredAssignments(
    assignments,
    assignmentSearchQuery,
    categoryOption,
    subcategoryOption
  );

  const { defaultOption, readingCategoryOptions, readingSubcategoryOptions } = useAssignmentFilterOptions(assignments);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isOpen: isOpenReadingModal, onClose: onCloseReadingModal, onOpen: onOpenReadingModal } = useDisclosure();

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
          <div className={`${styles["mob-col"]} row`}>
            <Button onClick={onOpen} leftIcon={<AddIcon />} className={styles.primary} variant="solid">
              Asignar Tarea
            </Button>
            <Button onClick={onOpenReadingModal} leftIcon={<AddIcon />} className={styles.secondary} variant="outline">
              Crear Lectura
            </Button>
          </div>
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
                  <label>Categoría</label>
                  <Select
                    defaultValue={defaultOption}
                    options={readingCategoryOptions}
                    onChange={(option) => {
                      setCategoryOption(option.value);
                    }}
                  ></Select>
                </div>
                <div className="col">
                  <label>Subcategoría</label>
                  <Select
                    defaultValue={defaultOption}
                    options={readingSubcategoryOptions}
                    onChange={(option) => {
                      setSubcategoryOption(option.value);
                    }}
                  ></Select>
                </div>
              </div>
              <ChakraTable
                columns={assignmentColumns}
                data={toAssignmentTableList(filteredAssignments, Number(groupId), groupName)}
              ></ChakraTable>
            </TabPanel>
            <TabPanel>
              <div className={`row ${styles.space} ${styles["tablet-col"]}`}>
                <div className={styles["stats-box"]}>
                  <div className={`row ${styles["mob-col"]}`}>
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
                <div>
                  <DatePicker
                    selected={startDate}
                    onChange={onChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                  />
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
      <AssignmentModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        assignmentColumnsModal={assignmentColumnsModal}
        assignments={assignments}
        steps={steps}
        studentColumnsModal={studentColumnsModal}
        students={students}
        styles={styles}
      />
      <CreateReadingModal isOpen={isOpenReadingModal} onClose={onCloseReadingModal} styles={styles} />
    </ChakraProvider>
  );
}
