import React from "react";
import styles from "./Input.module.css";

const InputDate: React.FC = () => {
  return <input type="date" className={styles["input-date"]}></input>;
};

export default InputDate;
