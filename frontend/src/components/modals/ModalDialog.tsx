import React from "react";
import styles from "./Modal.module.css"

interface ModalDialogProps {
  children: string | JSX.Element | JSX.Element[];
  title: string;
}

const ModalDialog: React.FC<ModalDialogProps> = ({ children, title }) => {
  return (
    <div className={`${styles.modal} ${styles.overlay}`}>
      <div className={`${styles.card}`}>
        <div className={`${styles.title}`}>{title}</div>
        <div className={`${styles.body}`}>{children}</div>
      </div>
    </div>
  );
};

export default ModalDialog;
