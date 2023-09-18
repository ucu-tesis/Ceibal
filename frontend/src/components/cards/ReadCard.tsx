import React from "react";
import styles from "./Card.module.css";
import Star from "../../assets/images/star.svg";
import Image from "next/image";

interface ReadCardProps {
  title: string;
  children: JSX.Element;
  stars: Number;
}

const ReadCard: React.FC<ReadCardProps> = ({ title, children, stars }) => {
  const starArray = Array<JSX.Element>(stars as any).fill(<Image src={Star} alt="star"></Image>);
  return (
    <div className={`${styles["read-card"]} col`}>
      {children}
      <span>{title}</span>
      <div className={`${styles.stars} row`}>{starArray.map((element) => element)}</div>
    </div>
  );
};

export default ReadCard;
