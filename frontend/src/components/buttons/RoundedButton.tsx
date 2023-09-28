import React from "react";
import styles from "./Button.module.css";
import localFont from "next/font/local";

interface RoundedButtonProps {
  onClick?: () => void;
  variant: 'black' | 'white';
  children: string | JSX.Element | JSX.Element[];
}

const mozaicFont = localFont({
  src: [
    {
      path: "../../assets/fonts/ceibalmozaic-regular-webfont.woff2",
      style: "normal",
    },
  ],
});

const RoundedButton: React.FC<RoundedButtonProps> = ({ children, variant, onClick }) => {
  const classVariants = {
    'black': styles["black"],
    'white': styles["white"],
  };
  return (
    <button
      onClick={onClick}
      className={`${styles.rounded} ${classVariants[variant]} row`}
      style={{ fontFamily: mozaicFont.style.fontFamily }}
    >
      {children}
    </button>
  );
};

export default RoundedButton;
