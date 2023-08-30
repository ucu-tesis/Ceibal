import React from "react";
import styles from "./Table.module.css";

interface ReadListTableProps {
  data: String[];
}

const ReadListTable: React.FC<ReadListTableProps> = ({ data }) => {
  return (
    <div className="col">
      {data.map((element, index) => {
        return (
          <div className={styles["read-list-item"]} key={index}>
            {element}
          </div>
        );
      })}
    </div>
  );
};

export default ReadListTable;
