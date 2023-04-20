import React from "react";
import "./styles.css";

interface StopButtonProps {
  onClick?: () => void;
}

const StopButton: React.FC<StopButtonProps> = ({ onClick }) => {
  return (
    <button type="submit" className="button row" onClick={onClick}>
      <div className="stop-fill"></div>
      <div>Parar</div>
    </button>
  );
};

export default StopButton;
