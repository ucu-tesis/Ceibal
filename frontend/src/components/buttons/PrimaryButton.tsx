import React from 'react';
import styles from './Button.module.css';

const classVariants = {
  pink: styles['stop-fill'],
  large: styles.large,
};

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: keyof Object;
  buttonRef?: React.LegacyRef<HTMLButtonElement> | undefined;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  variant,
  children,
  buttonRef,
  disabled,
  ...buttonProps
}) => {
  const disabledClass = disabled ? styles.disabled : '';

  return (
    <button
      ref={buttonRef}
      type="submit"
      className={`${styles.button} ${styles.big} ${
        classVariants[variant] ?? ''
      } row ${disabledClass}`}
      disabled={disabled}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
