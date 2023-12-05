import React, { ChangeEvent } from "react";
import styles from "./Input.module.css";

interface InputDateProps {
  value?: string;
  onChange?: (event: ChangeEvent) => void;
}

const InputDate: React.FC<InputDateProps> = ({ value, onChange }) => {
  return (
    <input
      type="date"
      className={styles["input-date"]}
      value={value ?? new Date().toISOString().slice(0, 10)}
      onChange={onChange}
    ></input>
  );
};

export default InputDate;
