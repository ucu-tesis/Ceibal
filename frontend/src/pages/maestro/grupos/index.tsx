import useFetchGroups from '@/api/teachers/hooks/useFetchGroups';
import Select from '@/components/selects/Select';
import ChakraTable, {
  ChakraTableColumn,
} from '@/components/tables/ChakraTable';
import { Group } from '@/models/Group';
import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ChakraProvider,
} from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState } from 'react';
import useFilteredGroups from '../../../hooks/teachers/useFilteredGroups';
import useGroupFilterOptions from '../../../hooks/teachers/useGroupFilterOptions';
import styles from './grupos.module.css';

const TEACHER_CI = 2; // TODO: Replace when auth integration is done.

type Option = {
  value?: string;
  label: string;
};

const columns: ChakraTableColumn[] = [
  { label: 'Grupo' },
  { label: 'Año', reactKey: 'anio' },
  { label: '', reactKey: 'link', width: '40%' },
];

const toTableList = (groups: Group[]) => {
  return groups.map(({ name, schoolYear, id }) => {
    return {
      name,
      schoolYear,
      link: (
        <Link
          href={{
            pathname: '/maestro/grupos/[grupo]',
            query: { grupo: id },
          }}
        >
          Ver alumnos
        </Link>
      ),
    };
  });
};

const EvaluationList: React.FC = () => {
  const { data: groups } = useFetchGroups(TEACHER_CI);
  const [yearFilter, setYear] = useState<Option | undefined>(undefined);
  const { filteredGroups } = useFilteredGroups(groups ?? [], yearFilter?.value);
  const { filterOptions } = useGroupFilterOptions(groups ?? []);

  return (
    <ChakraProvider>
      <Head>
        <title>Grupos</title>
      </Head>
      <div className={`${styles.container}`}>
        <Breadcrumb separator={<ChevronRightIcon />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/maestro/grupos">Grupos</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 tabIndex={0}>Grupos</h1>
        <div className={`${styles.filters} row`}>
          <Select
            options={filterOptions}
            defaultValue={filterOptions[0]}
            onChange={(value) => {
              setYear(value);
            }}
          ></Select>
        </div>
        <ChakraTable
          columns={columns}
          data={toTableList(filteredGroups)}
        ></ChakraTable>
      </div>
    </ChakraProvider>
  );
};

export default EvaluationList;
