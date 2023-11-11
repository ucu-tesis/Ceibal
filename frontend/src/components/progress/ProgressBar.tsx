import React from "react";
import styles from "./Progress.module.css";

interface ProgressBarProps {
  value: string;
  variant?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, variant = "" }) => {
  return (
    <div
      className={`${styles["progress-bar"]} ${styles[variant] ?? ""} col`}
      style={{
        background: `radial-gradient(closest-side, #346608 79%, transparent 80% 100%),
    conic-gradient(#4C950C ${value}%, white 0)`,
      }}
    >
      <span tabIndex={0}>{value}</span>
      <span tabIndex={0}>Puntos</span>
    </div>
  );
};

export default ProgressBar;
