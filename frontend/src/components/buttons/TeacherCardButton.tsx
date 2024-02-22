import React from 'react';
import styles from './Button.module.css';

interface TeacherCardButtonProps {
  icon: JSX.Element;
  backgroundImage: JSX.Element;
  onClick: () => void;
  text: string;
}

const TeacherCardButton: React.FC<TeacherCardButtonProps> = ({
  icon,
  backgroundImage,
  onClick,
  text,
}) => {
  return (
    <button
      className={`${styles.teacher} ${styles['card-button']}`}
      onClick={onClick}
    >
      <div>
        {icon}
        <div className={styles['card-overlay']}>{backgroundImage}</div>
      </div>
      <span>{text}</span>
    </button>
  );
};

export default TeacherCardButton;
