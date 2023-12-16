import React, { ChangeEvent } from "react";
import styles from "./Input.module.css";

interface InputDateProps {
  value?: string;
  onChange?: (event: ChangeEvent) => void;
}

const InputDateTimeLocal: React.FC<InputDateProps> = ({ value, onChange }) => {
  return (
    <input
      type="datetime-local"
      className={styles["input-date"]}
      value={value ?? new Date().toISOString()}
      onChange={onChange}
    ></input>
  );
};

export default InputDateTimeLocal;
