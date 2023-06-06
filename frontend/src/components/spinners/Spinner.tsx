import React from "react";
import styles from "./Spinner.module.css";

const Spinner: React.FC = () => {
  return (
    <div className={`${styles.ring}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Spinner;
