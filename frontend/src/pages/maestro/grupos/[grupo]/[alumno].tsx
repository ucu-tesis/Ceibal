import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { ChakraProvider } from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import ChakraTable, { ChakraTableColumn } from "@/components/tables/ChakraTable";
import Select from "@/components/selects/Select";
import useFilteredTasks from "@/hooks/teachers/useFilteredTasks";
import ProgressBar from "@/components/progress/ProgressBar";
import styles from "./alumno.module.css";
import { SearchIcon, ChevronRightIcon, AddIcon } from "@chakra-ui/icons";
import SentTasksIcon from "../../../../assets/images/lecturas_enviadas.svg";
import PendingTasksIcon from "../../../../assets/images/lecturas_pendientes.svg";
import IncompleteTasksIcon from "../../../../assets/images/lecturas_atrasadas.svg";
import DatePicker from "react-datepicker";
import { Line, Bar, Radar } from "react-chartjs-2";
import useChartJSInitializer from "@/hooks/teachers/useChartJSInitializer";

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

const taskColumns: ChakraTableColumn[] = [{ label: "Sección" }, { label: "Capítulo" }, { label: "Lectura" }];

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"];
const metrics = ["Repeticiones", "Pausar", "Faltas", "Velocidad", "Pronunciación"];

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

const inputRegex = /\w|\d|\-|\s/;

const defaultOptionCategory: Option = {
  label: "Todas",
  value: undefined,
};

const defaultOptionSubcategory: Option = {
  label: "Todas",
  value: undefined,
};

const taskList: Task[] = [
  { category: "6", subcategory: "4", reading: "Coco Bandini" },
  { category: "5", subcategory: "5", reading: "Los fantasmas de la escuela pasaron de clase!" },
  { category: "2", subcategory: "8", reading: "Diogenes" },
];

export default function Page({ params }: { params: Params }) {
  const router = useRouter();
  const student = router.query.alumno;
  const group = router.query.groupName;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useChartJSInitializer();

  const [taskSearchQuery, setTaskSearchQuery] = useState("");
  const [categoryOption, setCategoryOption] = useState<string | undefined>(undefined);
  const [subcategoryOption, setSubcategoryOption] = useState<string | undefined>(undefined);

  const { filteredTasks } = useFilteredTasks(taskList, taskSearchQuery, categoryOption, subcategoryOption);

  const categoryOptions: Option[] = [
    ...taskList.map(({ category }) => ({ label: category, value: category })),
    defaultOptionCategory,
  ];

  const subcategoryOptions: Option[] = [
    ...taskList.map(({ subcategory }) => ({ label: subcategory, value: subcategory })),
    defaultOptionSubcategory,
  ];

  const toTableListTask = (tasks: Task[]) =>
    tasks.map((task) => ({
      ...task,
      link: (
        <Link
          href={{
            pathname: "/maestro/grupos/[grupo]/resultado/[evaluacion]",
            query: { grupo: group, groupName: group, alumno: student, evaluacion: 1 },
          }}
        >
          Ver detalles
        </Link>
      ),
    }));

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
            <BreadcrumbLink href="#">{group}</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">{student}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 tabIndex={0}>{student}</h1>
        <div className={`row ${styles.space} ${styles["tablet-col"]}`}>
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
            <label>Categorías</label>
            <Select
              defaultValue={defaultOptionCategory}
              options={categoryOptions}
              onChange={(option) => {
                setCategoryOption(option.value);
              }}
            ></Select>
          </div>
          <div className="col">
            <label>Subcategorías</label>
            <Select
              defaultValue={defaultOptionSubcategory}
              options={subcategoryOptions}
              onChange={(option) => {
                setSubcategoryOption(option.value);
              }}
            ></Select>
          </div>
        </div>
        <ChakraTable columns={taskColumns} data={toTableListTask(filteredTasks)}></ChakraTable>
      </div>
    </ChakraProvider>
  );
}
