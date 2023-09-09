import React from "react";
import styles from "./Button.module.css";

interface CardButtonProps {
  onClick: () => void;
  leftIcon: JSX.Element;
  text: string;
}

const CardButton: React.FC<CardButtonProps> = ({ onClick, leftIcon, text }) => {
  return (
    <button className={`${styles["card-button"]}`} onClick={onClick}>
      {leftIcon}
      <span>{text}</span>
    </button>
  );
};

export default CardButton;
