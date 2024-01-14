import Image from "next/image";
import { forwardRef } from "react";
import Star from "../../assets/images/star.svg";
import styles from "./Card.module.css";

interface ReadCardProps {
  title: string;
  starsCount: number;
  image?: string;
  onClick?: () => void;
}

const ReadCard = forwardRef<HTMLDivElement, ReadCardProps>(({ title, image, starsCount, onClick = undefined }, ref) => {
  const stars = Array.from({ length: starsCount }, (_, index) => (
    <Image key={`star-${index}`} src={Star} alt="estrella" />
  ));
  return (
    <div className={`${styles["read-card"]} col ${!onClick ? "" : styles.pointer}`} ref={ref} onClick={onClick}>
      {/* TODO Replace SuarezReading with a default image */}
      <Image src={image ?? ""} alt={`Imagen de la lectura '${title}'`} width={200} height={300} priority />
      <span>{title}</span>
      <div className={`${styles.stars} row`}>{stars}</div>
    </div>
  );
});

ReadCard.displayName = "ReadCard";

export default ReadCard;
