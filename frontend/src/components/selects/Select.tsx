import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import styles from "./Select.module.css";

interface SelectProps {
  id?: string;
  onChange?: () => void;
  options: Option[];
  defaultValue: Option;
}

type Option = {
  value: string;
  label: string;
};

const Select: React.FC<SelectProps> = ({ options, defaultValue }) => {
  const divRef = useRef(null);
  const [selectValue, setValue] = useState(defaultValue);
  const [openOptions, setOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      const element = e.target as HTMLElement;
      if (divRef?.current) {
        const divElement = divRef.current as HTMLDivElement;
        if (!divElement.contains(element)) {
          setOpen(false);
        }
      }
    });
  }, []);

  return (
    <div
      className={`${styles["select-bar"]} row`}
      ref={divRef}
      onClick={() => {
        setOpen(true);
      }}
    >
      {selectValue.label}
      <ChevronDownIcon />
      {openOptions && (
        <div className={`${styles.options} col`}>
          {options.map((element, index) => {
            return (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setValue(element);
                  setOpen(false);
                }}
              >
                {element.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
