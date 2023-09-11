import React from "react";
import styles from "./Card.module.css";

interface ReadCardProps {
  title: string;
  children: JSX.Element;
}

const ReadCard: React.FC<ReadCardProps> = ({ title, children }) => {
  return (
    <div className={`${styles["read-card"]} col`}>
      {children}
      <span>{title}</span>
    </div>
  );
};

export default ReadCard;
