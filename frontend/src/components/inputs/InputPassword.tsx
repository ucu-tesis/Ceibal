import React from 'react';
import styles from './Input.module.css';

interface InputPasswordProps {
  placeholder?: string;
}

const InputPassword: React.FC<InputPasswordProps> = ({ placeholder }) => {
  return (
    <input
      type="password"
      placeholder={placeholder}
      className={`${styles['input-login']}`}
    ></input>
  );
};

export default InputPassword;
