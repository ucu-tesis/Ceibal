import useFetchAssignmentStats from '@/api/teachers/hooks/useFetchAssignmentStats';
import ErrorPage from '@/components/errorPage/ErrorPage';
import LoadingPage from '@/components/loadingPage/LoadingPage';
import ProgressCircle from '@/components/progress/ProgressCircle';
import Select from '@/components/selects/Select';
import ChakraTable, {
  ChakraTableColumn,
} from '@/components/tables/ChakraTable';
import {
  errorMetrics,
  inputRegex,
  notFoundMessage,
} from '@/constants/constants';
import useChartJSInitializer from '@/hooks/teachers/useChartJSInitializer';
import useFilteredEvaluations from '@/hooks/teachers/useFilteredEvaluations';
import { AssignmentReading } from '@/models/AssignmentReading';
import { AnalysisStatus } from '@/models/Recording';
import { chartOptions } from '@/util/chart';
import { dateFormats } from '@/util/dates';
import { ChevronRightIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ChakraProvider,
  Input,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Pie, Radar } from 'react-chartjs-2';
import IncompleteTasksIcon from '../../../../../assets/images/lecturas_atrasadas.svg';
import SentTasksIcon from '../../../../../assets/images/lecturas_enviadas.svg';
import PendingTasksIcon from '../../../../../assets/images/lecturas_pendientes.svg';
import styles from './tarea.module.css';

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
  { label: 'Nombre' },
  { label: 'Documento' },
  { label: 'Correo' },
  { label: 'Estado' },
  { label: 'Fecha de Entrega' },
];

const defaultOption: Option = {
  label: 'Todos',
  value: undefined,
};

export default function Page({ params }: { params: Params }) {
  const router = useRouter();

  const evaluationGroupReadingId = router.query.tarea;
  const groupId = router.query.grupo;

  const { data, isLoading, isError } = useFetchAssignmentStats(
    Number(groupId),
    Number(evaluationGroupReadingId),
  );

  const {
    assignment,
    assignmentsDone,
    assignmentsPending,
    isOpen,
    averageErrors,
    averageScore,
    mostRepeatedWords,
    recordings,
  } = data ?? {
    assignment: null,
    assignmentsDone: 0,
    assignmentsPending: 0,
    isOpen: false,
    averageScore: 0,
    averageErrors: null,
    mostRepeatedWords: [],
    recordings: [],
  };

  const dataRadar = {
    labels: errorMetrics,
    datasets: [
      {
        label: 'Errores',
        data: [
          averageErrors?.generalErrors,
          averageErrors?.silencesCount,
          averageErrors?.repetitionsCount,
        ],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)',
      },
    ],
  };

  const dataPie = {
    labels: mostRepeatedWords.map(({ word }) => word),
    datasets: [
      {
        label: 'My First Dataset',
        data: mostRepeatedWords.map(({ repetitionCount }) => repetitionCount),
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        hoverOffset: 4,
      },
    ],
  };

  useChartJSInitializer();

  const [readingSearchQuery, setReadingSearchQuery] = useState('');
  const [statusOption, setStatusOption] = useState<string | undefined>(
    undefined,
  );

  const { filteredReadings } = useFilteredEvaluations(
    recordings,
    readingSearchQuery,
    statusOption,
  );

  const statusList: AnalysisStatus[] = [
    'COMPLETED',
    'FAILED',
    'PENDING',
    'WORKING',
  ];

  const statusLabels = {
    COMPLETED: 'Completado',
    FAILED: 'Fallido',
    PENDING: 'Pendiente',
    WORKING: 'Procesando',
  };

  const statusOptions: Option[] = [
    defaultOption,
    ...statusList.map((status) => ({
      label: statusLabels[status],
      value: status,
    })),
  ];

  const toTableListEvaluation = (readings: AssignmentReading[]) =>
    readings.map(
      (reading) =>
        ({
          name: reading.studentName,
          document: reading.cedula,
          email: reading.email,
          status: statusLabels[reading.status as keyof Object],
          dateSubmitted: dayjs(reading.dateSubmitted).format(
            dateFormats.assignmentDueDate,
          ),
          link: (
            <Link
              href={{
                pathname: '/maestro/grupos/[grupo]/tarea/[tarea]/[alumno]',
                query: {
                  grupo: groupId,
                  tarea: evaluationGroupReadingId,
                  alumno: reading.studentId,
                },
              }}
            >
              Ver detalles
            </Link>
          ),
        }) as any,
    );

  if (isLoading) {
    return <LoadingPage />;
  }
  if (isError) {
    return <ErrorPage intendedAction="obtener estadísticas de la tarea" />;
  }

  return (
    <ChakraProvider>
      <Head>
        <title>Resultado Tarea</title>
      </Head>
      <div className={`${styles.container}`}>
        <Breadcrumb separator={<ChevronRightIcon />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/maestro">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/maestro/grupos/">Grupos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={'/maestro/grupos/' + data.groupId}>
              {data.groupName}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/maestro/grupos/${data.groupId}/tarea/${assignment?.evaluationGroupReadingId}`}
            >
              Tarea: {assignment?.readingTitle}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 tabIndex={0}>Resultado de evaluación</h1>

        <div className={`row ${styles.space} ${styles['tablet-col']}`}>
          <div className={`col ${styles.stats}`}>
            <h5 tabIndex={0}>
              Lectura:{' '}
              {assignment?.readingTitle
                ? assignment.readingTitle
                : notFoundMessage}
            </h5>
            <h5 tabIndex={0}>
              Categoría:{' '}
              {assignment?.readingCategory
                ? assignment.readingCategory
                : notFoundMessage}
            </h5>
            <h5 tabIndex={0}>
              Subcategoría:{' '}
              {assignment?.readingSubcategory
                ? assignment.readingSubcategory
                : notFoundMessage}
            </h5>
            <h5 tabIndex={0}>
              {assignment?.createdDate
                ? `Fecha de Creación: ${dayjs(assignment?.createdDate).format(
                    dateFormats.assignmentDueDate,
                  )}`
                : notFoundMessage}
            </h5>
            <h5 tabIndex={0}>
              {assignment?.dueDate
                ? `Fecha de Cierre: ${dayjs(assignment?.dueDate).format(
                    dateFormats.assignmentDueDate,
                  )}`
                : notFoundMessage}
            </h5>
          </div>
          <div className={styles['stats-box']}>
            <div className={`row ${styles['mob-col']}`}>
              <ProgressCircle
                value={Math.round(averageScore).toString()}
                variant="small"
              ></ProgressCircle>
              <div className="row">
                <Image alt="lecturas completadas" src={SentTasksIcon} />
                <span>Completadas: {assignmentsDone}</span>
              </div>
              {isOpen && (
                <div className="row">
                  <Image alt="lecturas pendientes" src={PendingTasksIcon} />
                  <span>Pendientes: {assignmentsPending}</span>
                </div>
              )}
              {!isOpen && (
                <div className="row">
                  <Image alt="lecturas atrasadas" src={IncompleteTasksIcon} />
                  <span>Atrasadas: {assignmentsPending}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={`row ${styles.canvas} ${styles.space}`}>
          <Radar
            width={600}
            data={dataRadar}
            options={chartOptions('Errores cometidos')}
          ></Radar>
          <Pie
            width={600}
            data={dataPie}
            options={chartOptions('Palabras con mayor repetición')}
          ></Pie>
        </div>
        <h2 tabIndex={0}>Entregas</h2>
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
        <ChakraTable
          columns={readingColumns}
          data={toTableListEvaluation(filteredReadings)}
        ></ChakraTable>
      </div>
    </ChakraProvider>
  );
}
