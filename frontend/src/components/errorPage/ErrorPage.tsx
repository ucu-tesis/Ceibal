import { useIsStudent } from '@/providers/hooks/user';
import React from 'react';
import styles from './ErrorPage.module.css';

interface ErrorPageProps {
  intendedAction?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ intendedAction }) => {
  const isStudent = useIsStudent();
  return (
    <div className={`${styles.container}`}>
      {intendedAction && (
        <h1>{`¡Ups! Algo salió mal al ${intendedAction}.`}</h1>
      )}
      {!intendedAction && <h1>¡Ups! Algo salió mal.</h1>}
      {isStudent && (
        <style jsx global>
          {`
            body {
              background: var(--ceibal-student-background);
            }
          `}
        </style>
      )}
    </div>
  );
};

export default ErrorPage;
