import Image from "next/image";
import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, LayoutProps } from "@chakra-ui/react";
import styles from "./Table.module.css";
import TableSearchIcon from "@/assets/images/table_search.svg";

export interface ChakraTableColumn {
  label: string;
  width?: LayoutProps["width"];
  reactKey?: string;
}
interface TableProps {
  columns: ChakraTableColumn[];
  data: any[];
  variant?: string;
  maxHeight?: string;
}

const ChakraTable: React.FC<TableProps> = ({ columns, data, variant, maxHeight }) => (
  <TableContainer
    maxHeight={maxHeight}
    overflowY="auto"
    className={`${styles["table-border"]} ${variant ? styles[variant] : ""}`}
  >
    <Table className={`${styles["main-table"]}`}>
      <Thead>
        <Tr>
          {columns.map(({ label, reactKey, width }) => (
            <Th width={width} key={reactKey ?? `${label}-th`}>
              {label}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.length === 0 && (
          <Tr className={styles["empty-message"]}>
            <Td colSpan={columns.length}>
              <div className="col">
                <div>
                  <Image src={TableSearchIcon} alt="" />
                </div>
                <span tabIndex={0}>Sin resultados</span>
              </div>
            </Td>
          </Tr>
        )}
        {data.map((row, index) => {
          const rowKeys = Object.keys(row);
          return (
            <Tr key={index}>
              {rowKeys.map((key) => (
                <Td tabIndex={0} key={key}>
                  {row[key]}
                </Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  </TableContainer>
);

export default ChakraTable;
