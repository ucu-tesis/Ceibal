import React from 'react';
import styles from './Progress.module.css';

interface ProgressCircleProps {
  value: string;
  variant?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  variant = '',
}) => {
  return (
    <div
      className={`${styles['progress-bar']} ${styles[variant] ?? ''} col`}
      style={{
        background: `radial-gradient(closest-side, #346608 79%, transparent 80% 100%),
    conic-gradient(#4C950C ${value}%, white 0)`,
      }}
    >
      <span tabIndex={0}>{value}</span>
      <span tabIndex={0}>Puntos</span>
    </div>
  );
};

export default ProgressCircle;
