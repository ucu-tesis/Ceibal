import React from "react";
import styles from "./Button.module.css";

interface PrimaryButtonProps {
  id?: string;
  onClick?: () => void;
  variant: keyof Object;
  children: string | JSX.Element | JSX.Element[];
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ id, onClick, variant, children }) => {
  const classVariants = {
    pink: styles["stop-fill"],
  };

  return (
    <button
      id={id}
      type="submit"
      className={`${styles.button} ${styles.big} ${classVariants[variant] ?? ""} row`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
