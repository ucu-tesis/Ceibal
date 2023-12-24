import Image from "next/image";
import React from "react";
import styles from "./Button.module.css";

interface ImageButtonProps {
  src: any; // Use any to avoid conflicts with @svgr/webpack plugin or babel-plugin-inline-react-svg plugin.
  altText: string;
  description: string;
  variant?: string;
}

const ImageButton: React.FC<ImageButtonProps> = ({ src, altText, description, variant = "" }) => {
  return (
    <div className={`${styles["btn-col"]} col`}>
      <button type="button" className={`${styles["image-btn"]} ${styles[variant] ?? ""}`}>
        <Image src={src} alt={altText}></Image>
      </button>
      <span>{description}</span>
    </div>
  );
};

export default ImageButton;
