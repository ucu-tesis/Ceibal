import useFetchAllReadings from '@/api/teachers/hooks/useFetchAllReadings';
import CreateReadingModal from '@/components/modals/CreateReadingModal';
import Select, { Option } from '@/components/selects/Select';
import ChakraTable, {
  ChakraTableColumn,
} from '@/components/tables/ChakraTable';
import { inputRegex } from '@/constants/constants';
import { Reading } from '@/models/Reading';
import { getOptionsFromArray } from '@/util/select';
import { AddIcon, ChevronRightIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  ChakraProvider,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from './lecturas.module.css';

const readingSelectionColumns: ChakraTableColumn[] = [
  { label: 'Categoría' },
  { label: 'Subcategoría' },
  { label: 'Lectura' },
  { label: '' },
];

const defaultOption: Option = {
  label: 'Todas',
  value: undefined,
};

const filterReadings = (
  readings: Reading[],
  search: string,
  category?: string,
  subcategory?: string,
) => {
  return readings.filter((reading) => {
    return (
      reading.title.toLowerCase().includes(search) &&
      (!category || reading.category === category) &&
      (!subcategory || reading.subcategory === subcategory)
    );
  });
};

const Page: React.FC = () => {
  const readingsQueryData = useFetchAllReadings();

  const [readingSearch, setReadingSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>();
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>();

  const [activeContent, setActiveContent] = useState<string>();
  const [activeTitle, setActiveTitle] = useState<string>();

  const baseReadings = readingsQueryData?.data
    ? readingsQueryData.data.Readings
    : [];

  const filteredReadings = filterReadings(
    baseReadings, // TODO pagination
    readingSearch,
    categoryFilter,
    subcategoryFilter,
  );

  const {
    isOpen: isOpenReadingModal,
    onClose: onCloseReadingModal,
    onOpen: onOpenReadingModal,
  } = useDisclosure();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const onClickReading = (readingContent: string, readingTitle: string) => {
    setActiveContent(readingContent);
    setActiveTitle(readingTitle);
    onOpen();
  };
  return (
    <ChakraProvider>
      <Head>
        <title>Lecturas</title>
      </Head>
      <div className={`${styles.container}`}>
        <Breadcrumb separator={<ChevronRightIcon />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/maestro">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/maestro/lecturas">Lecturas</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className={`${styles.space} row`}>
          <h1 tabIndex={0}>Lecturas</h1>
          <div className={`${styles['mob-col']} row`}>
            <Button
              onClick={onOpenReadingModal}
              leftIcon={<AddIcon />}
              className={styles.primary}
              variant="solid"
            >
              Crear Lectura
            </Button>
          </div>
        </div>
        <div className={`${styles.filters} row`}>
          <InputGroup>
            <Input
              width="auto"
              onKeyDown={(e) => {
                if (!e.key.match(inputRegex)) {
                  e.preventDefault();
                }
              }}
              maxLength={30}
              placeholder="Lectura"
              onChange={({ target: { value } }) => {
                setReadingSearch(value.toLowerCase());
              }}
            />
            <InputRightAddon>
              <SearchIcon />
            </InputRightAddon>
          </InputGroup>
          <div className="col">
            <label>Categoría</label>
            <Select
              defaultValue={{
                label: categoryFilter || 'Todas',
                value: categoryFilter,
              }}
              options={getOptionsFromArray(
                baseReadings.map((r) => r.category),
                defaultOption,
              )}
              onChange={(option) => {
                setCategoryFilter(option.value);
              }}
            ></Select>
          </div>
          <div className="col">
            <label>Subcategoría</label>
            <Select
              defaultValue={{
                label: subcategoryFilter || 'Todas',
                value: subcategoryFilter,
              }}
              options={getOptionsFromArray(
                baseReadings.map((r) => r.subcategory).filter(Boolean),
                defaultOption,
              )}
              onChange={(option) => {
                setSubcategoryFilter(option.value);
              }}
            ></Select>
          </div>
        </div>
        <ChakraTable
          columns={readingSelectionColumns}
          data={filteredReadings.map((reading) => ({
            category: reading.category,
            subcategory: reading.subcategory,
            title: reading.title,
            action: (
              <Link
                href="#"
                onClick={() => onClickReading(reading.content, reading.title)}
              >
                Ver lectura
              </Link>
            ),
          }))}
        ></ChakraTable>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className={styles['modal-content']}>
          <ModalHeader>{activeTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className={styles['modal-body']}>
            {activeContent}
          </ModalBody>
        </ModalContent>
      </Modal>
      <CreateReadingModal
        isOpen={isOpenReadingModal}
        onClose={onCloseReadingModal}
        styles={styles}
      />
    </ChakraProvider>
  );
};

export default Page;
