import Image from 'next/image';
import React from 'react';
import styles from './Button.module.css';

interface ImageButtonProps {
  onClick?: (achievement: any) => void;
  src: any; // Use any to avoid conflicts with @svgr/webpack plugin or babel-plugin-inline-react-svg plugin.
  altText: string;
  title: string;
  variant?: string;
  overlayText?: string;
  unoptimized?: boolean;
}

const ImageButton: React.FC<ImageButtonProps> = ({
  onClick,
  src,
  altText,
  title,
  variant = '',
  overlayText = undefined,
  unoptimized = false,
}) => {
  return (
    <div className={`${styles['btn-col']} col`}>
      <button
        onClick={onClick}
        type="button"
        className={`${styles['image-btn']} ${styles[variant] ?? ''}`}
      >
        <Image
          className={`${styles.image}`}
          src={src}
          alt={altText}
          width={220}
          height={220}
          unoptimized={unoptimized}
        />
        {overlayText && (
          <div className={styles.overlay}>
            <span>{overlayText}</span>
          </div>
        )}
      </button>
      <span>{title}</span>
    </div>
  );
};

export default ImageButton;
