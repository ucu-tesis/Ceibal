import React from "react";
import styles from "./Button.module.css";

interface PrimaryButtonProps {
  id?: string;
  onClick?: () => void;
  variant: keyof Object;
  children: string | JSX.Element | JSX.Element[];
  buttonRef?: React.LegacyRef<HTMLButtonElement> | undefined;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ id, onClick, variant, children, buttonRef }) => {
  const classVariants = {
    pink: styles["stop-fill"],
    large: styles.large
  };

  return (
    <button
      id={id}
      ref={buttonRef}
      type="submit"
      className={`${styles.button} ${styles.big} ${classVariants[variant] ?? ""} row`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
