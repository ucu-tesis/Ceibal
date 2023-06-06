import React from "react";
import styles from "./Modal.module.css"

interface ModalDialogProps {
  children: string | JSX.Element | JSX.Element[];
  title: string;
  componentRef: React.LegacyRef<HTMLDivElement> | undefined;
}

const ModalDialog: React.FC<ModalDialogProps> = ({ children, title, componentRef }) => {
  return (
    <div className={`${styles.modal} ${styles.overlay}`}>
      <div ref={componentRef} className={`${styles.card}`}>
        <div className={`${styles.title}`}>{title}</div>
        <div className={`${styles.body}`}>{children}</div>
      </div>
    </div>
  );
};

export default ModalDialog;
