import React from "react";
import styles from "./ErrorPage.module.css";

interface ErrorPageProps {
  intendedAction?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ intendedAction }) => {
  return (
    <div className={`${styles.container}`}>
      {intendedAction && (
        <h1>{`¡Ups! Algo salió mal al ${intendedAction}.`}</h1>
      )}
      {!intendedAction && <h1>¡Ups! Algo salió mal.</h1>}
    </div>
  );
};

export default ErrorPage;
