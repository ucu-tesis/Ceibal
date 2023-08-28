import React, { useState } from "react";
import styles from "./accordion.module.css";

interface AccordionProps {
  title: string;
  children: string | JSX.Element | JSX.Element[];
}

const PrimaryAccordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  const onClickAccordeon = () => {
    setOpen(!open);
  };
  return (
    <div className={`${styles.accordeon}`}>
      <span className={` ${!open ? styles.closed : ""}`} tabIndex={0} title={title} onClick={onClickAccordeon}>
        {title}
      </span>
      <div className={`${styles.body} ${open ? styles.open : ""}`}>{open && children}</div>
    </div>
  );
};

export default PrimaryAccordion;
