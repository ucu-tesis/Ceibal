import React from "react";
import styles from "./Button.module.css";
import RecordIcon from "../../Assets/images/record_icon.svg";
import RecordAgainIcon from "../../Assets/images/record_again_icon.svg";
import Image from "next/image";
import localFont from "next/font/local";

interface RecordButtonProps {
  onClick?: () => void;
  recordAgain?: boolean;
}

const mozaicFont = localFont({
  src: [
    {
      path: "../../assets/fonts/ceibalmozaic-regular-webfont.woff2",
      style: "normal",
    },
  ],
});

const RecordButton: React.FC<RecordButtonProps> = ({ onClick, recordAgain }) => {
  return (
    <button
      type="submit"
      className={`${styles.button} ${styles.big} ${recordAgain ? styles["no-fill"] : ""} row`}
      onClick={onClick}
    >
      {recordAgain ? (
        <>
          <div>
            <Image src={RecordAgainIcon} alt=""></Image>
          </div>
          <div style={{ fontFamily: mozaicFont.style.fontFamily }}>Grabar otra vez</div>
        </>
      ) : (
        <>
          <div>
            <Image src={RecordIcon} alt=""></Image>
          </div>
          <div style={{ fontFamily: mozaicFont.style.fontFamily }}>Grabar</div>
        </>
      )}
    </button>
  );
};

export default RecordButton;
