import useFetchStudentAssignmentDetails from '@/api/teachers/hooks/useFetchRecordingDetails';
import ErrorPage from '@/components/errorPage/ErrorPage';
import LoadingPage from '@/components/loadingPage/LoadingPage';
import ProgressCircle from '@/components/progress/ProgressCircle';
import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ChakraProvider,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from './resultado.module.css';

export default function Page() {
  const { tarea, alumno } = useRouter().query;
  const { data, isLoading, isError } = useFetchStudentAssignmentDetails(
    Number(tarea),
    Number(alumno),
  );

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage intendedAction="obtener resultado de evaluación" />;
  }

  if (!data.recordingId) {
    return <ErrorPage intendedAction="obtener la grabación, esta no existe" />;
  }

  return (
    <ChakraProvider>
      <Head>
        <title>Resultado Evaluación</title>
      </Head>
      <div className={`${styles.container}`}>
        <Breadcrumb separator={<ChevronRightIcon />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/maestro">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/maestro/grupos/">Clases</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={'/maestro/grupos/' + data.groupId}>
              {data.groupName}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              href={'/maestro/grupos/' + data.groupId + '/' + data.studentId}
            >
              {data.studentName}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink>Resultado</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 tabIndex={0}>Resultado de Evaluación</h1>
        <div className={`row ${styles.space}`}>
          <div className={`col ${styles.stats}`}>
            <h5 tabIndex={0}>Alumno: {data.studentName}</h5>
            <h5 tabIndex={0}>Lectura: {data.readingTitle}</h5>
            <h5 tabIndex={0}>Categoría: {data.category}</h5>
            <h5 tabIndex={0}>Subcategoría: {data.subcategory}</h5>
          </div>
          <ProgressCircle
            value={data.score?.toString() ?? '0'}
          ></ProgressCircle>
        </div>
        <h2 tabIndex={0}>Métricas</h2>
        <div className={`row ${styles.stats} ${styles.border}`}>
          <div className={`col`}>
            <h5 tabIndex={0}>Cantidad Pausas: {data.silencesCount}</h5>
            <h5 tabIndex={0}>Cantidad Repeticiones: {data.repetitionsCount}</h5>
            <h5 tabIndex={0}>
              Velocidad de lectura: {data.wordsVelocity} palabras/minuto
            </h5>
          </div>
          {data.recordingUrl ? (
            <audio controls className={`${styles.audio}`}>
              <source src={data.recordingUrl} />\ Your browser does not support
              the audio element.
            </audio>
          ) : null}
        </div>
      </div>
    </ChakraProvider>
  );
}
