import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import Spinner from "../spinners/Spinner";
import styles from "./Select.module.css";

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

interface FilteredOptionsProps {
  filteredOptions: Option[];
  isLoading: boolean;
  onChange: (option: Option) => void;
  setOpen: (open: boolean) => void;
}

const FilteredOptions: React.FC<FilteredOptionsProps> = ({
  filteredOptions,
  isLoading,
  onChange,
  setOpen,
}) => {
  if (isLoading) {
    return (
      <div className={`${styles["spinner-container"]}`}>
        <Spinner size="small" />
      </div>
    );
  }

  if (filteredOptions.length === 0) {
    return <span>No hay resultados</span>;
  }

  return (
    <>
      {filteredOptions.map((element, index) => (
        <div
          tabIndex={0}
          key={`${element.label}-${index}`}
          onKeyDown={enterClick}
          onClick={(e) => {
            e.stopPropagation();
            onChange(element);
            setOpen(false);
          }}
        >
          {element.label}
        </div>
      ))}
    </>
  );
};

interface SearchBoxProps {
  placeholder: string;
  isLoading?: boolean;
  onChange?: (value: Option) => void;
  options: Option[];
  value?: Option;
  disabled?: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder,
  isLoading = false,
  options,
  onChange = () => {},
  value,
  disabled = false,
}) => {
  const divRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [openOptions, setOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    const clickOutSearchBox = (e: Event) => {
      const element = e.target as HTMLElement;

      if (divRef?.current) {
        const divElement = divRef.current as HTMLDivElement;
        if (!divElement.contains(element)) {
          setOpen(false);
        }
      }
    };

    window.addEventListener("click", clickOutSearchBox);
    const chakraModal = document.querySelector('[role="dialog"]');
    chakraModal?.addEventListener("click", clickOutSearchBox);
    return () => {
      window.removeEventListener("click", clickOutSearchBox);
      chakraModal?.removeEventListener("click", clickOutSearchBox);
    };
  }, [openOptions]);

  useEffect(() => {
    setFilteredOptions(
      options.filter(({ label }) =>
        label.toLowerCase()?.includes(searchValue.toLowerCase()),
      ),
    );
  }, [searchValue, options]);

  return (
    <div
      tabIndex={0}
      className={`${styles["select-bar"]} row`}
      onKeyDown={enterClick}
      ref={divRef}
      onClick={(event) => {
        if (disabled) {
          return;
        }
        if (!openOptions) {
          setOpen(true);
        } else if (event.target === divRef?.current) {
          setOpen(false);
        }
      }}
    >
      {value?.label ?? placeholder}
      <ChevronDownIcon />
      {openOptions && (
        <div className={`${styles.options} col`}>
          <span className="row">
            <input
              type="text"
              placeholder="Buscar"
              onChange={(event) => {
                setSearchValue(event.target.value);
              }}
              disabled={disabled}
            />
            <SearchIcon />
          </span>
          <FilteredOptions
            filteredOptions={filteredOptions}
            isLoading={isLoading}
            onChange={onChange}
            setOpen={setOpen}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBox;
