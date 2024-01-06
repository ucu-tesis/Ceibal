import useFetchStudentStats from "@/api/teachers/hooks/useFetchStudentStats";
import ErrorPage from "@/components/errorPage/ErrorPage";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import ProgressCircle from "@/components/progress/ProgressCircle";
import Select from "@/components/selects/Select";
import ChakraTable, {
  ChakraTableColumn,
} from "@/components/tables/ChakraTable";
import { inputRegex } from "@/constants/constants";
import useChartJSInitializer from "@/hooks/teachers/useChartJSInitializer";
import useFilteredAssignments from "@/hooks/teachers/useFilteredAssignments";
import { Assignment } from "@/models/Assignment";
import { dateFormats } from "@/util/dates";
import { getOptionsFromArray } from "@/util/select";
import { ChevronRightIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ChakraProvider,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Line, Radar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import IncompleteTasksIcon from "../../../../assets/images/lecturas_atrasadas.svg";
import SentTasksIcon from "../../../../assets/images/lecturas_enviadas.svg";
import PendingTasksIcon from "../../../../assets/images/lecturas_pendientes.svg";
import styles from "./alumno.module.css";

interface Params {
  alumno: string;
  grupo: number;
  groupName: string;
}

interface Task {
  category: string;
  subcategory: string;
  reading: string;
}

type Option = {
  value?: string;
  label: string;
};

const taskColumns: ChakraTableColumn[] = [
  { label: "Categoría" },
  { label: "Subcategoría" },
  { label: "Lectura" },
  { label: "Fecha de entrega" },
];

// TODO integrate with backend
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"];
const metrics = [
  "Repeticiones",
  "Pausar",
  "Faltas",
  "Velocidad",
  "Pronunciación",
];

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

const dataRadar = {
  labels: metrics,
  datasets: [
    {
      label: "Puntuación",
      data: [65, 59, 90, 81, 56, 55, 40],
      fill: true,
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgb(255, 99, 132)",
      pointBackgroundColor: "rgb(255, 99, 132)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(255, 99, 132)",
    },
  ],
};

const defaultOption: Option = {
  label: "Todas",
  value: undefined,
};

const toTableListAssignment = (
  assignments: Assignment[],
  groupId: string,
  groupName: string,
  studentFullName: string
) =>
  assignments.map(
    ({
      readingCategory,
      readingSubcategory,
      readingTitle,
      dueDate,
      evaluationGroupReadingId,
    }) => ({
      readingCategory,
      readingSubcategory,
      readingTitle,
      dueDate: dayjs(dueDate).format(dateFormats.assignmentDueDate),
      link: (
        <Link
          href={{
            pathname: "/maestro/grupos/[grupo]/resultado/[evaluacion]",
            query: {
              grupo: groupId,
              groupName,
              alumno: studentFullName,
              evaluacion: evaluationGroupReadingId,
            },
          }}
        >
          Ver detalles
        </Link>
      ),
    })
  );

export default function Page({ params }: { params: Params }) {
  const router = useRouter();
  useChartJSInitializer();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [taskSearchQuery, setTaskSearchQuery] = useState("");
  const [categoryOption, setCategoryOption] = useState<string>();
  const [subcategoryOption, setSubcategoryOption] = useState<string>();

  const {
    studentId,
    alumno: studentFullName,
    groupName,
    grupo: groupId,
  } = router.query;

  const { data, isLoading, isError } = useFetchStudentStats(
    Number(groupId),
    Number(studentId)
  );

  const categoryOptions = useMemo(
    () =>
      getOptionsFromArray(
        data?.assignments.map((a) => a.readingCategory) ?? [],
        defaultOption
      ),
    [data?.assignments]
  );

  const subcategoryOptions = useMemo(
    () =>
      getOptionsFromArray(
        data?.assignments.map((a) => a.readingSubcategory) ?? [],
        defaultOption
      ),
    [data?.assignments]
  );

  const { filteredAssignments } = useFilteredAssignments(
    data?.assignments ?? [],
    taskSearchQuery,
    categoryOption,
    subcategoryOption
  );

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return (
      <ErrorPage intendedAction={`cargar estadísticas de ${studentFullName}`} />
    );
  }

  return (
    <ChakraProvider>
      <Head>
        <title>Resultado Evaluación</title>
      </Head>
      <div className={`${styles.container}`}>
        <Breadcrumb separator={<ChevronRightIcon />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">Grupos</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">{groupName}</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">{studentFullName}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 tabIndex={0}>{studentFullName}</h1>
        <div className={`row ${styles.space} ${styles["tablet-col"]}`}>
          <div className={styles["stats-box"]}>
            <div className={`row ${styles["mob-col"]}`}>
              <ProgressCircle value="92" variant="small"></ProgressCircle>
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
          <Line data={dataLine} width={400}></Line>
          <Radar data={dataRadar}></Radar>
        </div>
        <h2 tabIndex={0}>Tareas</h2>
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
            <label>Categoría</label>
            <Select
              defaultValue={defaultOption}
              options={categoryOptions}
              onChange={(option) => {
                setCategoryOption(option.value);
              }}
            ></Select>
          </div>
          <div className="col">
            <label>Subcategoría</label>
            <Select
              defaultValue={defaultOption}
              options={subcategoryOptions}
              onChange={(option) => {
                setSubcategoryOption(option.value);
              }}
            ></Select>
          </div>
        </div>
        <ChakraTable
          columns={taskColumns}
          data={toTableListAssignment(
            filteredAssignments,
            `${groupId}`,
            `${groupName}`,
            `${studentFullName}`
          )}
        ></ChakraTable>
      </div>
    </ChakraProvider>
  );
}
