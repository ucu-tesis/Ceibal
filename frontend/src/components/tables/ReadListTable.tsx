import React from "react";
import styles from "./Table.module.css";
import { useRouter } from "next/router";

interface ReadListTableProps {
  data: String[];
}

const ReadListTable: React.FC<ReadListTableProps> = ({ data }) => {
  const router = useRouter();
  return (
    <div className="col">
      {data.map((element, index) => {
        return (
          <div className={styles["read-list-item"]} key={index} onClick={() => router.push("/alumno/grabar")}>
            {element}
          </div>
        );
      })}
    </div>
  );
};

export default ReadListTable;
