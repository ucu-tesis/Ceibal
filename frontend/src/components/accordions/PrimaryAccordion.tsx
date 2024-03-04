import Image from 'next/image';
import React, { useState } from 'react';
import ChevronRight from '../../assets/images/chevron_right.svg';
import styles from './accordion.module.css';

interface AccordionProps {
  title: string;
  children: string | JSX.Element | JSX.Element[];
}

const PrimaryAccordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  const onClickAccordion = () => {
    setOpen(!open);
  };
  return (
    <div className={`${styles.accordion} ${styles.primaryAccordion}`}>
      <span
        className={`row ${!open ? styles.closed : ''}`}
        tabIndex={0}
        title={title}
        onClick={onClickAccordion}
      >
        <div>{title}</div>
        <div>
          <Image src={ChevronRight} alt=""></Image>
        </div>
      </span>
      <div className={`${styles.body} ${open ? styles.open : ''}`}>
        {open && children}
      </div>
    </div>
  );
};

export default PrimaryAccordion;
