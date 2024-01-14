import { ReadingMinimalInfo } from "@/models/Reading";
import { SPANISH_MONTH_NAMES } from "@/util/dates";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React from "react";
import styles from "./Table.module.css";

interface ReadingTableProps {
  readings: ReadingMinimalInfo[];
}

const getDueDateString = (date: Date) => {
  const day = dayjs(date).get("date");
  const monthIndex = dayjs(date).get("month");
  const month = SPANISH_MONTH_NAMES[monthIndex];
  const hour = dayjs(date).get("hour");
  const minute = dayjs(date).get("minute");
  return `\n(Tenés tiempo hasta el ${day} de ${month} a las ${hour}${
    hour < 10 ? "0" : ""
  }:${minute}${minute < 10 ? "0" : ""})`;
};

const ReadingTable: React.FC<ReadingTableProps> = ({ readings }) => {
  const router = useRouter();
  return (
    <div className="col">
      {readings.map(({ id, title, dueDate }, index) => {
        return (
          <div
            className={`${styles["read-list-item"]}`}
            key={index}
            onClick={() => router.push(`/alumno/grabar/${id}`)}
          >
            {title}
            {dueDate && getDueDateString(dueDate)}
          </div>
        );
      })}
    </div>
  );
};

export default ReadingTable;
