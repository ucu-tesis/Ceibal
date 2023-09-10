import React, { useState } from "react";
import ChevronRight from "../../assets/images/chevron_right.svg";
import Image from "next/image";
import styles from "./accordion.module.css";

interface AccordionProps {
  title: string;
  children: string | JSX.Element | JSX.Element[];
}

const SecondaryAccordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  const onClickAccordeon = () => {
    setOpen(!open);
  };
  return (
    <div className={`${styles.accordeon}`}>
      <span
        className={`row ${styles.secondary} ${!open ? styles.closed : ""}`}
        tabIndex={0}
        title={title}
        onClick={onClickAccordeon}
      >
        <div>{title}</div>
        <div>
          <Image src={ChevronRight} alt=""></Image>
        </div>
      </span>
      <div className={`${styles.body} ${open ? styles.open : ""}`}>{open && children}</div>
    </div>
  );
};

export default SecondaryAccordion;
