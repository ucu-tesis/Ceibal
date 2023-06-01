import React from "react";
import styles from "./Button.module.css";
import RecordAgainIcon from "../../Assets/images/record_again_icon.svg";
import Image from "next/image";
import localFont from "next/font/local";

interface SecondaryButtonProps {
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

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ onClick }) => {
  return (
    <button type="submit" className={`${styles.button} ${styles.big} ${styles["no-fill"]} row`} onClick={onClick}>
      <div>
        <Image src={RecordAgainIcon} alt=""></Image>
      </div>
      <div style={{ fontFamily: mozaicFont.style.fontFamily }}>Grabar otra vez</div>
    </button>
  );
};

export default SecondaryButton;
