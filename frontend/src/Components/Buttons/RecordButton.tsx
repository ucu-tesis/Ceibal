import React from "react";
import "./styles.css"

const RecordButton: React.FC = () => {
  return (
    <button type="submit" className="record-button row">
      <div className="record-fill"></div>
      <div>Grabar</div>
    </button>
  );
};

export default RecordButton;
