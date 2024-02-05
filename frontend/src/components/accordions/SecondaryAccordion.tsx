import Image from 'next/image';
import React, { useState } from 'react';
import ChevronRight from '../../assets/images/chevron_right.svg';
import styles from './accordion.module.css';

interface AccordionProps {
  title: string;
  children: string | JSX.Element | JSX.Element[];
}

const SecondaryAccordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  const onClickAccordion = () => {
    setOpen(!open);
  };
  return (
    <div className={`${styles.accordion}`}>
      <span
        className={`row ${styles.secondary} ${!open ? styles.closed : ''}`}
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

export default SecondaryAccordion;
