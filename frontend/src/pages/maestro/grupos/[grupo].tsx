import useFetchGroupDetails from '@/api/teachers/hooks/useFetchGroupDetails';
import useFetchGroupStats from '@/api/teachers/hooks/useFetchGroupStats';
import ErrorPage from '@/components/errorPage/ErrorPage';
import LoadingPage from '@/components/loadingPage/LoadingPage';
import CreateReadingModal from '@/components/modals/CreateReadingModal';
import Select from '@/components/selects/Select';
import ChakraTable, {
  ChakraTableColumn,
} from '@/components/tables/ChakraTable';
import { inputRegex } from '@/constants/constants';
import useAssignmentFilterOptions from '@/hooks/teachers/useAssignmentFilterOptions';
import useChartJSInitializer from '@/hooks/teachers/useChartJSInitializer';
import useFilteredAssignments from '@/hooks/teachers/useFilteredAssignments';
import { Assignment } from '@/models/Assignment';
import { Student } from '@/models/Student';
import { SPANISH_MONTH_NAMES, dateFormats } from '@/util/dates';
import { AddIcon, ChevronRightIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  ChakraProvider,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import IncompleteTasksIcon from '../../../assets/images/lecturas_atrasadas.svg';
import SentTasksIcon from '../../../assets/images/lecturas_enviadas.svg';
import PendingTasksIcon from '../../../assets/images/lecturas_pendientes.svg';
import useFilteredStudents from '../../../hooks/teachers/useFilteredStudents';
import styles from './grupos.module.css';
import Spinner from '@/components/spinners/Spinner';

const columns: ChakraTableColumn[] = [
  { label: 'Nombre' },
  { label: 'Documento' },
  { label: 'Correo' },
  { label: 'Tareas Completadas' },
  { label: '', reactKey: 'link', width: '20%' },
];

const assignmentColumns: ChakraTableColumn[] = [
  { label: 'Categoría' },
  { label: 'Subcategoría' },
  { label: 'Lectura' },
  { label: 'Fecha de Entrega' },
];

const toTableList = (students: Student[], evaluationGroupId: number) =>
  students.map(
    ({
      fullName,
      cedula,
      email,
      assignmentsDone = 0,
      assignmentsPending = 0,
      id,
    }) => ({
      fullName,
      cedula,
      email,
      assignmentsCompleted: `${assignmentsDone}/${
        assignmentsDone + assignmentsPending
      }`,
      link: (
        <Link
          href={{
            pathname: '/maestro/grupos/[grupo]/[alumno]',
            query: {
              grupo: evaluationGroupId,
              alumno: id,
            },
          }}
        >
          Ver detalles
        </Link>
      ),
    }),
  );

const toAssignmentTableList = (
  assignments: Assignment[],
  evaluationGroupId: number,
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
            pathname: '/maestro/grupos/[grupo]/tarea/[tarea]',
            query: {
              grupo: evaluationGroupId,
              tarea: evaluationGroupReadingId,
            },
          }}
        >
          Ver detalles
        </Link>
      ),
    }),
  );

export default function Page({ params }: { params: { grupo: number } }) {
  const { query } = useRouter();
  const evaluationGroupId = Number(query.grupo);
  const { data, isLoading, isError } = useFetchGroupDetails(evaluationGroupId);
  
  const [startDate, setStartDate] = useState(dayjs().startOf('year').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().endOf('year').format('YYYY-MM-DD'));
  const {
    data: statsData,
    isRefetching: statsIsRefetching,
    isError: statsError,
  } = useFetchGroupStats(evaluationGroupId, startDate, endDate);
  const invalidStartDate = !dayjs(startDate, "YYYY-MM-DD").isBefore(dayjs(endDate, "YYYY-MM-DD"));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryOption, setCategoryOption] = useState<string>();
  const [subcategoryOption, setSubcategoryOption] = useState<string>();
  const { name: groupName, students } = data ?? {
    name: '',
    students: [],
    assignments: [],
  };
  const assignments = data?.assignments ?? [];
  const {
    assignmentsDone,
    assignmentsPending,
    assignmentsDelayed,
    monthlyAssignmentsPending,
    monthlyAssignmentsDelayed,
    monthlyAssignmentsDone,
    monthlyScoreAverages,
  } = statsData ?? { assignmentsDone: 0 };

  const { filteredStudents } = useFilteredStudents(students ?? [], searchQuery);

  const [assignmentSearchQuery, setAssignmentSearchQuery] = useState('');

  useChartJSInitializer();

  const router = useRouter();

  const { filteredAssignments } = useFilteredAssignments(
    assignments,
    assignmentSearchQuery,
    categoryOption,
    subcategoryOption,
  );

  const { defaultOption, readingCategoryOptions, readingSubcategoryOptions } =
    useAssignmentFilterOptions(assignments);

  const {
    isOpen: isOpenReadingModal,
    onClose: onCloseReadingModal,
    onOpen: onOpenReadingModal,
  } = useDisclosure();

  const months = monthlyScoreAverages?.map(
    ({ month }) => SPANISH_MONTH_NAMES[month],
  );

  const dataLine = {
    labels: months,
    datasets: [
      {
        id: 2,
        label: 'Promedio',
        data: monthlyScoreAverages?.map(({ value }) => value),
        backgroundColor: '#FBE38E',
        borderColor: '#FBE38E',
      },
    ],
  };

  const dataBar = {
    labels: months,
    datasets: [
      {
        label: 'Tareas hechas',
        data: monthlyAssignmentsDone?.map(({ value }) => value),
        backgroundColor: '#c8fac3',
        borderColor: '#c8fac3',
        borderWidth: 1,
      },
      {
        label: 'Tareas pendientes',
        data: monthlyAssignmentsPending?.map(({ value }) => value),
        backgroundColor: '#D0E8FFB2',
        borderColor: '#D0E8FFB2',
        borderWidth: 1,
      },
      {
        label: 'Tareas atrasadas',
        data: monthlyAssignmentsDelayed?.map(({ value }) => value),
        backgroundColor: '#FED0EEB2',
        borderColor: '#FED0EEB2',
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
  if (statsError) {
    return <ErrorPage intendedAction="recopilar estadisticas del grupo" />;
  }

  return (
    <ChakraProvider>
      <Head>
        <title>Grupos</title>
      </Head>
      <div className={`${styles.container}`}>
        <Breadcrumb separator={<ChevronRightIcon />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/maestro/grupos">Grupos</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href={'/maestro/grupos/' + evaluationGroupId}>
              {groupName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className={`${styles.space} row`}>
          <h1 tabIndex={0}>{groupName}</h1>
          <div className={`${styles['mob-col']} row`}>
            <Button
              onClick={() =>
                router.push(`/maestro/grupos/${evaluationGroupId}/asignartarea`)
              }
              leftIcon={<AddIcon />}
              className={styles.primary}
              variant="solid"
            >
              Asignar Tarea
            </Button>
            <Button
              onClick={onOpenReadingModal}
              leftIcon={<AddIcon />}
              className={styles.secondary}
              variant="outline"
            >
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
                data={toTableList(filteredStudents, evaluationGroupId)}
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
                data={toAssignmentTableList(
                  filteredAssignments,
                  evaluationGroupId,
                )}
              ></ChakraTable>
            </TabPanel>
            <TabPanel>
              <Flex my="4" align="center" gap={4} justify="center" wrap={"wrap"}>
                Desde:
                <Input
                  maxWidth="44"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    // value is empty string when date is invalid (like 31 of february)
                    if (e.target.value) {
                      setStartDate(e.target.value);
                    }
                  }}
                />
                Hasta:
                <Input
                  maxWidth="44"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    // value is empty string when date is invalid (like 31 of february)
                    if (e.target.value) {
                      setEndDate(e.target.value);
                    }
                  }}
                />
                {invalidStartDate && (
                  <Text width="100%" textAlign={"center"} color="red.600"><i>Rango Invalido</i></Text>
                )}
              </Flex>
              {statsIsRefetching ? (
                <Flex my={8} justify={"center"}><Spinner /></Flex>
              ) : (
                <>
                  <div className={`row ${styles.space} ${styles['tablet-col']}`}>
                    <div className={styles['stats-box']}>
                      <div className={`row ${styles['mob-col']}`}>
                        <div className="row">
                          <Image alt="lecturas enviadas" src={SentTasksIcon} />
                          <span>Enviadas: {assignmentsDone}</span>
                        </div>
                        <div className="row">
                          <Image alt="lecturas pendientes" src={PendingTasksIcon} />
                          <span>Pendientes: {assignmentsPending}</span>
                        </div>
                        <div className="row">
                          <Image
                            alt="lecturas atrasadas"
                            src={IncompleteTasksIcon}
                          />
                          <span>Atrasadas: {assignmentsDelayed}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`row ${styles.canvas}`}>
                    <Line data={dataLine}></Line>
                    <Bar data={dataBar}></Bar>
                  </div>
                </>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
      <CreateReadingModal
        isOpen={isOpenReadingModal}
        onClose={onCloseReadingModal}
        styles={styles}
      />
    </ChakraProvider>
  );
}
