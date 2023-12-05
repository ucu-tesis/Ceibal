import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { ChakraProvider } from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import ChakraTable, { ChakraTableColumn } from "@/components/tables/ChakraTable";
import Select from "@/components/selects/Select";
import ProgressBar from "@/components/progress/ProgressBar";
import dayjs from "dayjs";
import styles from "./tarea.module.css";
import { SearchIcon, ChevronRightIcon } from "@chakra-ui/icons";
import SentTasksIcon from "../../../../../assets/images/lecturas_enviadas.svg";
import PendingTasksIcon from "../../../../../assets/images/lecturas_pendientes.svg";
import IncompleteTasksIcon from "../../../../../assets/images/lecturas_atrasadas.svg";
import { Pie, Radar } from "react-chartjs-2";
import useChartJSInitializer from "@/hooks/teachers/useChartJSInitializer";
import { AssignmentReading } from "@/models/AssignmentReading";
import { dateFormats, inputRegex } from "@/constants/constants";
import useFilteredEvaluations from "@/hooks/teachers/useFilteredEvaluations";

interface Params {
  alumno: string;
  grupo: number;
  groupName: string;
  tarea: number;
}

type Option = {
  value?: string;
  label: string;
};

const readingColumns: ChakraTableColumn[] = [
  { label: "Nombre" },
  { label: "Documento" },
  { label: "Mail" },
  { label: "Estado" },
  { label: "Fecha de Entrega" },
];

const metrics = ["Repeticiones", "Pausar", "Faltas", "Velocidad", "Pronunciación"];

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

const dataPie = {
  labels: ["Pepe", "Tortuga", "Dormido"],
  datasets: [
    {
      label: "My First Dataset",
      data: [300, 50, 100],
      backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)"],
      hoverOffset: 4,
    },
  ],
};

const defaultOption: Option = {
  label: "Todos",
  value: undefined,
};

const readingList: AssignmentReading[] = [
  {
    studentName: "Ana García",
    studentId: "4866987-2",
    email: "agarcia@gmail.com",
    status: "Procesando",
    dateSubmitted: new Date(),
  },
  {
    studentName: "Pedro López",
    studentId: "4866987-2",
    email: "plopez@gmail.com",
    status: "Enviado",
    dateSubmitted: new Date(),
  },
  {
    studentName: "Luis Torres",
    studentId: "4866987-2",
    email: "ltorres@gmail.com",
    status: "Pendiente",
    dateSubmitted: new Date(),
  },
  {
    studentName: "Javier Alaves",
    studentId: "4866987-2",
    email: "jalaves@gmail.com",
    status: "Pendiente",
    dateSubmitted: new Date(),
  },
];

export default function Page({ params }: { params: Params }) {
  const router = useRouter();
  const assignment = router.query.tarea;
  const readingCategory = router.query.readingCategory;
  const readingSubcategory = router.query.readingSubCategory;
  const group = router.query.groupName;

  useChartJSInitializer();

  const [readingSearchQuery, setReadingSearchQuery] = useState("");
  const [statusOption, setStatusOption] = useState<string | undefined>(undefined);

  const { filteredReadings } = useFilteredEvaluations(readingList, readingSearchQuery, statusOption);

  const statusOptions: Option[] = [
    defaultOption,
    { label: "Procesando", value: "Procesando" },
    { label: "Enviado", value: "Enviado" },
    { label: "Pendiente", value: "Pendiente" },
  ];

  const toTableListEvaluation = (readings: AssignmentReading[]) =>
    readings.map((reading) => ({
      ...reading,
      dateSubmitted: dayjs(reading.dateSubmitted).format(dateFormats.assignmentDueDate),
      link: (
        <Link
          href={{
            pathname: "/maestro/grupos/[grupo]/resultado/[evaluacion]",
            query: { grupo: group, groupName: group, alumno: reading.studentName, evaluacion: 1 },
          }}
        >
          Ver detalles
        </Link>
      ),
    }));

  return (
    <ChakraProvider>
      <Head>
        <title>Resultado Tarea</title>
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
            <BreadcrumbLink href="#">{group}</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">{assignment}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 tabIndex={0}>Resultado de evaluación</h1>

        <div className={`row ${styles.space} ${styles["tablet-col"]}`}>
          <div className={`col ${styles.stats}`}>
            <h5 tabIndex={0}>Lectura: {assignment}</h5>
            <h5 tabIndex={0}>Categoría: {readingCategory}</h5>
            <h5 tabIndex={0}>Subcategoría: {readingSubcategory}</h5>
            <h5 tabIndex={0}>Fecha de Creación: 2023-05-19 09:15</h5>
            <h5 tabIndex={0}>Fecha de Cierre: 2023-10-20 09:15</h5>
          </div>
          <div className={styles["stats-box"]}>
            <div className={`row ${styles["mob-col"]}`}>
              <ProgressBar value="92" variant="small"></ProgressBar>
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
        </div>
        <div className={`row ${styles.canvas} ${styles.space}`}>
          <Radar width={600} data={dataRadar}></Radar>
          <Pie width={600} data={dataPie}></Pie>
        </div>
        <h2 tabIndex={0}>Alumnos</h2>
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
                setReadingSearchQuery(value.toLowerCase());
              }}
              maxLength={30}
              placeholder="Documento o nombre"
            />
            <InputRightAddon>
              <SearchIcon />
            </InputRightAddon>
          </InputGroup>
          <div className="col">
            <label>Estado</label>
            <Select
              defaultValue={defaultOption}
              options={statusOptions}
              onChange={(option) => {
                setStatusOption(option.value);
              }}
            ></Select>
          </div>
        </div>
        <ChakraTable columns={readingColumns} data={toTableListEvaluation(filteredReadings)}></ChakraTable>
      </div>
    </ChakraProvider>
  );
}
