import { ReadingMinimalInfo } from "@/models/Reading";
import { useRouter } from "next/router";
import React from "react";
import styles from "./Table.module.css";

interface ReadingTableProps {
  readings: ReadingMinimalInfo[];
}

const ReadingTable: React.FC<ReadingTableProps> = ({ readings }) => {
  const router = useRouter();
  return (
    <div className="col">
      {readings.map(({ id, title }, index) => {
        return (
          <>
            <div
              className={`${styles["read-list-item"]}`}
              key={index}
              onClick={() => router.push(`/alumno/grabar/${id}`)}
            >
              {title}
            </div>
          </>
        );
      })}
    </div>
  );
};

export default ReadingTable;
