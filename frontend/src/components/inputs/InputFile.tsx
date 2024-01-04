import React, { ChangeEvent } from "react";
import styles from "./Input.module.css";

interface InputFileProps {
  id: string;
  value?: any;
  onChange?: (event: ChangeEvent) => void;
}

const InputFile: React.FC<InputFileProps> = ({ value, id, onChange }) => {
  return (
    <div className={styles["file-input"]}>
      <input onChange={onChange} id={id} type="file" accept="image/png, image/gif, image/jpeg" />
      <div className="row">
        <button>Subir</button>
        <span>{value?.[0] ? value?.[0]?.name : "No se ha seleccionado ningún archivo"}</span>
      </div>
    </div>
  );
};

export default InputFile;
