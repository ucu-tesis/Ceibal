import React from "react";
import styles from "./Button.module.css";
import SendIcon from "../../Assets/images/send_icon.svg";
import Image from "next/image";
import localFont from "next/font/local";

interface SendButtonProps {
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

const SendButton: React.FC<SendButtonProps> = ({ onClick }) => {
  return (
    <button type="submit" className={`${styles.button} ${styles.big} ${styles.large} row`} onClick={onClick}>
      <div>
        <Image src={SendIcon} alt=""></Image>
      </div>
      <div style={{fontFamily: mozaicFont.style.fontFamily}}>
        Enviar
      </div>
    </button>
  );
};

export default SendButton;
