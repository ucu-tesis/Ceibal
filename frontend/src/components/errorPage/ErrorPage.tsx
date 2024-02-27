import { useIsStudent } from '@/providers/hooks/user';
import React from 'react';
import Image from 'next/image';
import styles from './ErrorPage.module.css';
import ErrorImage from '@/assets/images/error_illustration.png';
import RoundedButton from '../buttons/RoundedButton';

interface ErrorPageProps {
  intendedAction?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ intendedAction }) => {
  const isStudent = useIsStudent();
  return (
    <div className={`${styles.container} col`}>
      {intendedAction && (
        <h1>{`¡Ups! Algo salió mal al ${intendedAction}.`}</h1>
      )}
      {!intendedAction && <h1>¡Ups! Algo salió mal.</h1>}
      <Image width={300} src={ErrorImage} alt="imagen de error" />
      {isStudent && (
        <style jsx global>
          {`
            body {
              background: var(--ceibal-student-background);
            }
          `}
        </style>
      )}
      <RoundedButton onClick={() => location.reload()} variant={'black'}>
        Reintentar
      </RoundedButton>
    </div>
  );
};

export default ErrorPage;
