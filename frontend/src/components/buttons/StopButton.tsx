import React from "react";
import styles from "./Button.module.css";
import Image from "next/image";
import StopIcon from "../../Assets/images/stop_icon.svg";
import localFont from "next/font/local";

interface StopButtonProps {
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

const StopButton: React.FC<StopButtonProps> = ({ onClick }) => {
  return (
    <button type="submit" className={`${styles.button} ${styles.big} ${styles["stop-fill"]} row`} onClick={onClick}>
      <div>
        <Image src={StopIcon} alt=""></Image>
      </div>
      <div style={{fontFamily: mozaicFont.style.fontFamily}}>Parar</div>
    </button>
  );
};

export default StopButton;
