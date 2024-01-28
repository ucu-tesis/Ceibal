import React, { ChangeEvent, useState } from "react";
import styles from "./Input.module.css";

interface InputFileProps {
  id: string;
  accept?: string;
  onChange?: (event: ChangeEvent) => void;
  disabled?: boolean;
}

const InputFile: React.FC<InputFileProps> = ({
  id,
  onChange,
  accept,
  disabled = false,
}) => {
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
    }
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className={styles["file-input"]}>
      <input
        onChange={handleFileChange}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
      />
      <div className="row">
        <button>Subir</button>
        <span>
          {fileName ? fileName : "No se ha seleccionado ningún archivo"}
        </span>
      </div>
    </div>
  );
};

export default InputFile;
