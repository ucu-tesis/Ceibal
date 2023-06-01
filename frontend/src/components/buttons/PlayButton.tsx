import React from "react";
import styles from "./Button.module.css";
import PlayIcon from "../../Assets/images/play_icon.svg";
import PauseIcon from "../../Assets/images/pause_icon.svg";
import Image from "next/image";
import localFont from "next/font/local";

interface SendButtonProps {
  onClick?: () => void;
  playing?: boolean;
}

const mozaicFont = localFont({
  src: [
    {
      path: "../../assets/fonts/ceibalmozaic-regular-webfont.woff2",
      style: "normal",
    },
  ],
});

const PlayButton: React.FC<SendButtonProps> = ({ onClick, playing }) => {
  return (
    <button
      type="submit"
      className={`${styles.button} ${styles["no-fill"]} ${styles.large} ${styles.outlined} row`}
      onClick={onClick}
      style={{ width: "323px" }}
    >
      <div>
        <Image src={playing ? PauseIcon : PlayIcon} alt=""></Image>
      </div>
      <div style={{ fontFamily: mozaicFont.style.fontFamily }}>{playing ? "Parar" : "Reproducir"}</div>
    </button>
  );
};

export default PlayButton;
