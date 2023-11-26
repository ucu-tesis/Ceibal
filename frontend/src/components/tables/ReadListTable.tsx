import { StudentReadingSelection } from "@/models/StudentReadingSelection";
import { useRouter } from "next/router";
import React from "react";
import styles from "./Table.module.css";

const readings: StudentReadingSelection[] = [
  {
    id: 1,
    title: "Title 1",
  },
  {
    id: 2,
    title: "Title 2",
  },
  {
    id: 3,
    title: "Title 3",
  },
];

const ReadingList: React.FC = () => {
  const router = useRouter();
  return (
    <div className="col">
      {readings.map(({ id, title }, index) => {
        return (
          <div
            className={styles["read-list-item"]}
            key={index}
            onClick={() => router.push(`/alumno/grabar/${id}`)}
          >
            {title}
          </div>
        );
      })}
    </div>
  );
};

export default ReadingList;
