import React, { ChangeEvent } from "react";

interface InputFileProps {
  id: string;
  value?: any;
  onChange?: (event: ChangeEvent) => void;
}

const InputFile: React.FC<InputFileProps> = ({ value, id, onChange }) => {
  return (
    <div>
      <input onChange={onChange} id={id} type="file" accept="image/png, image/gif, image/jpeg" />
      <span>{value?.[0]?.name}</span>
    </div>
  );
};

export default InputFile;
