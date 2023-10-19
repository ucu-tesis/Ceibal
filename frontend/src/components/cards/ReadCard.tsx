import Image from "next/image";
import { forwardRef } from "react";
import Star from "../../assets/images/star.svg";
import SuarezReading from "../../assets/images/suarez.svg";
import styles from "./Card.module.css";

interface ReadCardProps {
  title: string;
  starsCount: number;
  image?: string;
}

// eslint-disable-next-line react/display-name
const ReadCard = forwardRef<HTMLDivElement, ReadCardProps>(
  ({ title, image, starsCount }, ref) => {
    const stars = Array<JSX.Element>(starsCount).fill(
      <Image src={Star} alt="star" />
    );
    return (
      <div className={`${styles["read-card"]} col`} ref={ref}>
        {/* TODO Replace SuarezReading with a default image */}
        <Image
          src={image ?? SuarezReading}
          alt={`Imagen de la lectura '${title}'`}
          width={200}
          height={300}
          priority
        />
        <span>{title}</span>
        <div className={`${styles.stars} row`}>{stars}</div>
      </div>
    );
  }
);

export default ReadCard;
