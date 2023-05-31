import React from "react";
import styles from "./Button.module.css";
import RecordIcon from "../../Assets/images/record_icon.svg";
import RecordAgainIcon from "../../Assets/images/record_again_icon.svg";
import Image from "next/image";
import localFont from "next/font/local";

interface PrimaryButtonProps {
  onClick?: () => void;
  variant: keyof Object;
  children: string | JSX.Element | JSX.Element[];
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick, variant, children }) => {
  const classVariants = {
    pink: styles["stop-fill"],
  };

  return (
    <button
      type="submit"
      className={`${styles.button} ${styles.big} ${classVariants[variant] ?? ""} row`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
