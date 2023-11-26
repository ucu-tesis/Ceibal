import React from "react";
import styles from "./Container.module.css";

export interface TextContainterProps {
  content: string;
}

const TextContainer: React.FC<TextContainterProps> = ({ content }) => (
  <div tabIndex={0} className={`${styles.text_container}`}>
    {content}
  </div>
);

export default TextContainer;
