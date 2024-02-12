import React from 'react';
import styles from './Button.module.css';

interface TeacherCardButtonProps {
  leftIcon: JSX.Element;
  onClick: () => void;
  text: string;
}

const TeacherCardButton: React.FC<TeacherCardButtonProps> = ({
  leftIcon,
  onClick,
  text,
}) => {
  return (
    <button
      className={`${styles.teacher} ${styles['card-button']}`}
      onClick={onClick}
    >
      {leftIcon}
      <span>{text}</span>
    </button>
  );
};

export default TeacherCardButton;
