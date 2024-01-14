import React from "react";
import styles from "./Button.module.css";

interface CardButtonProps {
  leftIcon: JSX.Element;
  onClick: () => void;
  rightNode?: React.ReactNode;
  text: string;
}

const CardButton: React.FC<CardButtonProps> = ({
  leftIcon,
  onClick,
  rightNode,
  text,
}) => {
  return (
    <button className={`${styles["card-button"]}`} onClick={onClick}>
      {leftIcon}
      <span>{text}</span>
      {rightNode && <div>{rightNode}</div>}
    </button>
  );
};

export default CardButton;
