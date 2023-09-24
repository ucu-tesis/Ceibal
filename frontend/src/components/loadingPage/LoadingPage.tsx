import React from "react";
import styles from "./LoadingPage.module.css";
import Spinner from "../spinners/Spinner";

const LoadingPage: React.FC = () => {
  return (
    <div className={`${styles.container}`}>
      <Spinner />
    </div>
  );
};

export default LoadingPage;
