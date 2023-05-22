import React from "react";
import styles from "./Button.module.css";

interface RecordButtonProps {
  onClick?: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ onClick }) => {
  return (
    <button type="submit" className={`${styles.button} row`} onClick={onClick}>
      <div className={styles["record-fill"]}></div>
      <div>Grabar</div>
    </button>
  );
};

export default RecordButton;
