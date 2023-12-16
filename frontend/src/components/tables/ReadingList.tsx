import { ReadingMinimalInfo } from "@/models/Reading";
import { useRouter } from "next/router";
import React from "react";
import styles from "./Table.module.css";

interface ReadingListProps {
  readings: ReadingMinimalInfo[];
}

const ReadingList: React.FC<ReadingListProps> = ({ readings }) => {
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
            {index < readings.length - 1 && (
              <div className={styles["read-list-spacer"]}></div>
            )}
          </>
        );
      })}
    </div>
  );
};

export default ReadingList;
