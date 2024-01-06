import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
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

const SearchBox: React.FC<SelectProps> = ({ options, defaultValue, onChange = (value) => {} }) => {
  const divRef = useRef(null);
  const [selectValue, setValue] = useState(defaultValue);
  const [searchValue, setSearchValue] = useState<string>("");
  const [openOptions, setOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

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
  }, [openOptions]);

  useEffect(() => {
    setFilteredOptions(options.filter(({ value }) => value?.includes(searchValue)));
  }, [searchValue, options]);

  return (
    <div
      tabIndex={0}
      className={`${styles["select-bar"]} row`}
      onKeyDown={enterClick}
      ref={divRef}
      onClick={(event) => {
        if (!openOptions) {
          setOpen(true);
        } else if (openOptions && event.target === divRef?.current) {
          setOpen(false);
        }
      }}
    >
      {selectValue.label}
      <ChevronDownIcon />
      {openOptions && (
        <div className={`${styles.options} col`}>
          <div className="row">
            <input
              type="text"
              placeholder="Buscar"
              onChange={(event) => {
                setSearchValue(event.target.value);
              }}
            />
            <SearchIcon />
          </div>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((element, index) => {
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
            })
          ) : (
            <span>No hay resultados</span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
