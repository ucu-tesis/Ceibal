import Image from "next/image";
import React from "react";
import styles from "./Button.module.css";

interface ImageButtonProps {
  src: any; // Use any to avoid conflicts with @svgr/webpack plugin or babel-plugin-inline-react-svg plugin.
  altText: string;
  description: string;
  variant?: string;
  overlayText?: string;
}

const ImageButton: React.FC<ImageButtonProps> = ({
  src,
  altText,
  description,
  variant = "",
  overlayText = undefined,
}) => {
  return (
    <div className={`${styles["btn-col"]} col`}>
      <button type="button" className={`${styles["image-btn"]} ${styles[variant] ?? ""}`}>
        <Image src={src} alt={altText}></Image>
        {overlayText && (
          <div className={styles.overlay}>
            <span>{overlayText}</span>
          </div>
        )}
      </button>
      <span>{description}</span>
    </div>
  );
};

export default ImageButton;
