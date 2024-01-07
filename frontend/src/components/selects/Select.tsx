import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import styles from "./Select.module.css";

interface SelectProps {
  id?: string;
  onChange?: (value: Option) => void;
  options: Option[];
  defaultValue: Option;
}

export type Option = {
  value?: string;
  label: string;
};

const enterClick = (event: any) => {
  if (event.key === "Enter") {
    const element = event.target as HTMLElement;
    element.click();
  }
};

const Select: React.FC<SelectProps> = ({ options, defaultValue, onChange = (value) => {} }) => {
  const divRef = useRef(null);
  const [selectValue, setValue] = useState(defaultValue);
  const [openOptions, setOpen] = useState(false);

  useEffect(() => {
    const clickOutSelect = (e: Event) => {
      const element = e.target as HTMLElement;

      if (divRef?.current) {
        const divElement = divRef.current as HTMLDivElement;
        if (!divElement.contains(element)) {
          setOpen(false);
        }
      }
    };

    window.addEventListener("click", clickOutSelect);
    const chakraModal = document.querySelector('[role="dialog"]');
    chakraModal?.addEventListener("click", clickOutSelect);

    return () => {
      window.removeEventListener("click", clickOutSelect);
      chakraModal?.removeEventListener("click", clickOutSelect);
    };
  }, [openOptions]);

  return (
    <div
      tabIndex={0}
      className={`${styles["select-bar"]} row`}
      onKeyDown={enterClick}
      ref={divRef}
      onClick={() => {
        setOpen(!openOptions);
      }}
    >
      {selectValue.label}
      <ChevronDownIcon />
      {openOptions && (
        <div className={`${styles.options} col`}>
          {options.map((element, index) => {
            return (
              <div
                tabIndex={0}
                key={index}
                onKeyDown={enterClick}
                onClick={(e) => {
                  e.stopPropagation();
                  setValue(element);
                  onChange(element);
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
