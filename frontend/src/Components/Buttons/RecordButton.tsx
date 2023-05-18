import React from "react";
import styles from "./Button.module.css";
import RecordIcon from "../../Assets/images/record_icon.svg";
import Image from "next/image";
import localFont from "next/font/local";

interface RecordButtonProps {
  onClick?: () => void;
}

const mozaicFont = localFont({
  src: [
    {
      path: "../../assets/fonts/ceibalmozaic-regular-webfont.woff2",
      style: "normal",
    },
  ],
});

const RecordButton: React.FC<RecordButtonProps> = ({ onClick }) => {
  return (
    <button type="submit" className={`${styles.button} ${styles.big} row`} onClick={onClick}>
      <div>
        <Image src={RecordIcon} alt=""></Image>
      </div>
      <div style={{fontFamily: mozaicFont.style.fontFamily}}>
        Grabar
      </div>
    </button>
  );
};

export default RecordButton;
