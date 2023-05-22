import React from "react";
import styles from "./Button.module.css";

interface StopButtonProps {
  onClick?: () => void;
}

const StopButton: React.FC<StopButtonProps> = ({ onClick }) => {
  return (
    <button type="submit" className={`${styles.button} row`} onClick={onClick}>
      <div className={styles["stop-fill"]}></div>
      <div>Parar</div>
    </button>
  );
};

export default StopButton;
