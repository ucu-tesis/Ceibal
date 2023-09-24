import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  LayoutProps,
} from "@chakra-ui/react";
import styles from "./Table.module.css";

export interface ChakraTableColumn {
  label: string;
  width?: LayoutProps["width"];
  reactKey?: string;
}
interface TableProps {
  columns: ChakraTableColumn[];
  data: any[];
}

const ChakraTable: React.FC<TableProps> = ({ columns, data }) => (
  <TableContainer className={`${styles["table-border"]}`}>
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
        {data.map((row, index) => {
          const rowKeys = Object.keys(row);
          return (
            <Tr key={index}>
              {rowKeys.map((key: any, index) => (
                <Td tabIndex={0} key={index}>
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
