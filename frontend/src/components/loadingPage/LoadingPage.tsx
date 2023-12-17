import { useIsStudent } from "@/providers/hooks/user";
import React from "react";
import Spinner from "../spinners/Spinner";
import styles from "./LoadingPage.module.css";

const LoadingPage: React.FC = () => {
  const isStudent = useIsStudent();
  return (
    <div className={`${styles.container}`}>
      <Spinner />
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

export default LoadingPage;
