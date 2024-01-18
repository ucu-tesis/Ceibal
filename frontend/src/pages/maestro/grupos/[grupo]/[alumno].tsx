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
import { Assignment, StudentAssignment } from "@/models/Assignment";
import { SPANISH_MONTH_NAMES, dateFormats } from "@/util/dates";
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
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import IncompleteTasksIcon from "../../../../assets/images/lecturas_atrasadas.svg";
import SentTasksIcon from "../../../../assets/images/lecturas_enviadas.svg";
import PendingTasksIcon from "../../../../assets/images/lecturas_pendientes.svg";
import styles from "./alumno.module.css";

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

// const metrics = [
//   "Repeticiones",
//   "Pausar",
//   "Faltas",
//   "Velocidad",
//   "Pronunciación",
// ];

// const dataRadar = {
//   labels: metrics,
//   datasets: [
//     {
//       label: "Puntuación",
//       data: [65, 59, 90, 81, 56, 55, 40],
//       fill: true,
//       backgroundColor: "rgba(255, 99, 132, 0.2)",
//       borderColor: "rgb(255, 99, 132)",
//       pointBackgroundColor: "rgb(255, 99, 132)",
//       pointBorderColor: "#fff",
//       pointHoverBackgroundColor: "#fff",
//       pointHoverBorderColor: "rgb(255, 99, 132)",
//     },
//   ],
// };

const defaultOption: Option = {
  label: "Todas",
  value: undefined,
};

const toTableListAssignment = (
  assignments: Assignment[],
  groupId: string,
  studentId: string
) =>
  (assignments as StudentAssignment[]).map(
    ({
      readingCategory,
      readingSubcategory,
      readingTitle,
      dueDate,
      evaluationGroupReadingId,
      status
    }) => ({
      readingCategory,
      readingSubcategory,
      readingTitle,
      dueDate: dayjs(dueDate).format(dateFormats.assignmentDueDate),
      link: ( status === 'completed' ?
        <Link
          href={{
            pathname: "/maestro/grupos/[grupo]/tarea/[tarea]/[alumno]",
            query: {
              grupo: groupId,
              alumno: studentId,
              tarea: evaluationGroupReadingId,
            },
          }}
        >
          Ver detalles
        </Link> : null
      ),
    })
  );

export default function Page() {
  const router = useRouter();
  useChartJSInitializer();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [taskSearchQuery, setTaskSearchQuery] = useState("");
  const [categoryOption, setCategoryOption] = useState<string>();
  const [subcategoryOption, setSubcategoryOption] = useState<string>();

  const { grupo, alumno } = router.query;

  const { data, isLoading, isError } = useFetchStudentStats(
    Number(grupo),
    Number(alumno)
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
      <ErrorPage intendedAction={`cargar estadísticas de alumno`} />
    );
  }

  const {
    assignmentsDone,
    assignmentsPending,
    assignmentsUncompleted,
    averageScore,
    monthlyAverages,
  } = data;

  const labels = monthlyAverages.map(
    ({ month }) => SPANISH_MONTH_NAMES[month] // Assuming months start at 0
  );

  const groupDataset = {
    id: 1,
    label: "Grupo",
    data: monthlyAverages.map(({ groupAverageScore }) => groupAverageScore),
    backgroundColor: "#B1A5FF",
    borderColor: "#B1A5FF",
  };
  const studentDataset = {
    id: 2,
    label: data.studentName,
    data: monthlyAverages.map(({ studentAverageScore }) => studentAverageScore),
    backgroundColor: "#FBE38E",
    borderColor: "#FBE38E",
  };
  const datasets = [groupDataset, studentDataset];

  const monthlyAveragesChartData = {
    labels,
    datasets,
  };

  return (
    <ChakraProvider>
      <Head>
        <title>Estadísticas de alumno</title>
      </Head>
      <div className={`${styles.container}`}>
        <Breadcrumb separator={<ChevronRightIcon />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/maestro/grupos/">Grupos</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href={'/maestro/grupos/' + data.groupId}>{data.groupName}</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href={'/maestro/grupos/' + data.groupId + '/' + data.studentId}>{data.studentName}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 tabIndex={0}>{data.studentName}</h1>
        <div className={`row ${styles.space} ${styles["tablet-col"]}`}>
          <div className={styles["stats-box"]}>
            <div className={`row ${styles["mob-col"]}`}>
              <ProgressCircle
                value={`${Math.round(averageScore)}`}
                variant="small"
              ></ProgressCircle>
              <div className="row">
                <Image alt="lecturas enviadas" src={SentTasksIcon} />
                <span>Enviadas: {assignmentsDone}</span>
              </div>
              <div className="row">
                <Image alt="lecturas pendientes" src={PendingTasksIcon} />
                <span>Pendientes: {assignmentsPending}</span>
              </div>
              <div className="row">
                <Image alt="lecturas atrasadas" src={IncompleteTasksIcon} />
                <span>Atrasadas: {assignmentsUncompleted}</span>
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
          {monthlyAverages.length > 0 && (
            <Line data={monthlyAveragesChartData} width={400}></Line>
          )}
          {/* <Radar data={dataRadar}></Radar> */}
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
            `${data.groupId}`,
            `${data.studentId}`
          )}
        ></ChakraTable>
      </div>
    </ChakraProvider>
  );
}
