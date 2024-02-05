import React from 'react';
import styles from './Button.module.css';
import localFont from 'next/font/local';

interface SecondaryButtonProps {
  onClick?: () => void;
  variant: keyof Object;
  children: string | JSX.Element | JSX.Element[];
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  onClick,
  variant,
  children,
}) => {
  const classVariants = {
    blueFill: styles['blue-fill'],
    redFill: styles['red-fill'],
    noFill: styles['no-fill'],
    outlined: `${styles['no-fill']} ${styles.outlined}`,
  };

  return (
    <button
      type="submit"
      className={`${styles.button} ${styles.large} ${classVariants[variant] ?? ''} row`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
