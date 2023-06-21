import React from "react";
import styles from "./Input.module.css";

interface InputTextProps {
  placeholder?: string;
}

const InputText: React.FC<InputTextProps> = ({ placeholder }) => {
  return <input type="text" placeholder={placeholder} className={`${styles["input-login"]}`}></input>;
};

export default InputText;
