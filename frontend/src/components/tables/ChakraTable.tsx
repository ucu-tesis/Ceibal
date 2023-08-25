import React, { ReactNode } from "react";
import { ChakraProvider, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useDisclosure } from "@chakra-ui/react";
import styles from "./Table.module.css"

interface TableProps {
    columns: JSX.Element[];
    data: any[];
}

const ChakraTable: React.FC<TableProps> = ({columns, data}) => {
  return (
    <TableContainer className={`${styles["table-border"]}`}>
      <Table className={`${styles["main-table"]}`}>
        <Thead>
          <Tr>
            {columns.map((element) => element)}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, index) => {
            const rowKeys = Object.keys(row);
            return (
              <Tr key={index}>
                {rowKeys.map((key: any, index) =>  <Td key={index}>{row[key]}</Td>)}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ChakraTable;
