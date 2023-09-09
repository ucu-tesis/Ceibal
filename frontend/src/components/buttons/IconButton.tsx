import React from "react";
import styles from "./Button.module.css";
import Image from "next/image";

// Props of <button>.
type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

interface IconButtonProps {
  icon: any; // Use any to avoid conflicts with @svgr/webpack plugin or babel-plugin-inline-react-svg plugin.
  size?: "normal" | "big";
}

const IconButton: React.FC<IconButtonProps & ButtonProps> = ({
  icon,
  size = "normal",
  ...props
}) => {
  return (
    <button className={`${styles["icon-button-container"]}`} {...props}>
      <Image className={`${styles[`icon-button-${size}`]}`} src={icon} alt="" />
    </button>
  );
};

export default IconButton;
