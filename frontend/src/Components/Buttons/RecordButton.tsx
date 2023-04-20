import React from "react";
import "./styles.css";

interface RecordButtonProps {
  onClick?: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ onClick }) => {
  return (
    <button type="submit" className="button row" onClick={onClick}>
      <div className="record-fill"></div>
      <div>Grabar</div>
    </button>
  );
};

export default RecordButton;
