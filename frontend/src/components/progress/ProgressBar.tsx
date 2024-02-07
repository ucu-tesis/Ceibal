import React from 'react';
import styles from './Progress.module.css';

interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div
      className={`${styles['progress-track']} ${
        styles[value > 0 ? 'with-progress' : '.with-no-progress']
      }`}
    >
      {value !== 0 && (
        <div
          className={styles['progress-value']}
          tabIndex={0}
          style={{ width: `${value}%` }}
        >
          {value}%
        </div>
      )}
      {value === 0 && (
        <div className={styles['no-progress']} tabIndex={0}>
          0%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
