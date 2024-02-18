import React from 'react';
import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'small' | 'big';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'big' }) => {
  return (
    <div className={`${styles.ring} ${styles[size]}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Spinner;
