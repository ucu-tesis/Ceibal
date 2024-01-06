import React from "react";
import styles from "./Progress.module.css";

interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className={styles["progress-track"]}>
      {value !== 0 && (
        <div tabIndex={0} style={{ width: `${value}%` }}>
          {value}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
