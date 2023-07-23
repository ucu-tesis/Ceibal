import React from "react";
import styles from "./Progress.module.css";

interface ProgressBarProps {
  value: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div
      className={`${styles["progress-bar"]} col`}
      style={{
        background: `radial-gradient(closest-side, #346608 79%, transparent 80% 100%),
    conic-gradient(#4C950C ${value}%, white 0)`,
      }}
    >
      <span>{value}</span>
      <span>Puntos</span>
    </div>
  );
};

export default ProgressBar;
