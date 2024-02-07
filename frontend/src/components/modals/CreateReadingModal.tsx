import useCreateReading from '@/api/teachers/hooks/useCreateReading';
import useFetchCategoriesAndSubcategories from '@/api/teachers/hooks/useFetchCategoriesAndSubcategories';
import { CategoriesAndSubcategoriesResponse } from '@/api/teachers/teachers';
import { toastDuration } from '@/constants/constants';
import {
  Button,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Switch,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import InputFile from '../inputs/InputFile';
import SearchBox from '../selects/SearchBox';
import { Option } from '../selects/Select';

interface CreateReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  styles: any;
}

const emptyCategoriesAndSubcategories: CategoriesAndSubcategoriesResponse = {
  categories: [],
  subcategories: [],
};

const CreateReadingModal: React.FC<CreateReadingModalProps> = ({
  isOpen,
  onClose,
  styles,
}) => {
  const toast = useToast();

  const { data, isLoading: isLoadingCategoriesAndSubcategories } =
    useFetchCategoriesAndSubcategories();
  const { mutate, isLoading: isLoadingCreateReading } = useCreateReading();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | undefined>(undefined);
  const [category, setCategory] = useState<Option>();
  const [subcategory, setSubCategory] = useState<Option>();
  const { categories, subcategories } = data ?? emptyCategoriesAndSubcategories;

  const categoryOptions = useMemo<Option[]>(
    () => categories.map((c) => ({ label: c, value: c })),
    [categories],
  );

  const subcategoryOptions = useMemo<Option[]>(
    () => subcategories.map((sc) => ({ label: sc, value: sc })),
    [subcategories],
  );

  const onSuccess = useCallback(() => {
    setTitle('');
    setContent('');
    setFile(undefined);
    setCategory(undefined);
    setSubCategory(undefined);

    onClose();

    toast({
      title: 'Lectura creada',
      status: 'success',
      duration: toastDuration,
      isClosable: true,
    });
  }, [onClose, toast]);

  const onError = useCallback(() => {
    toast({
      title: 'La lectura no se pudo crear, intentalo de nuevo',
      status: 'error',
      duration: toastDuration,
      isClosable: true,
    });
  }, [toast]);

  const onFileChange = (event: ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    setFile(element.files?.[0]);
  };

  const isAnyRequiredFieldEmpty =
    !category?.value || !content || !file || !title || !subcategory?.value;

  const createReading = () => {
    if (!isAnyRequiredFieldEmpty) {
      mutate(
        {
          category: category.value!,
          subcategory: subcategory.value!,
          content,
          title,
          file,
        },
        {
          onSuccess,
          onError,
        },
      );
    } else {
      toast({
        title: 'Hay campos vacíos',
        status: 'info',
        duration: toastDuration,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className={styles['modal-content']}>
        <ModalHeader tabIndex={0}>Crear Lectura</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className={`${styles['form-value']} col`}>
            <label htmlFor="lectura">Nombre</label>
            <InputGroup className={styles.medium}>
              <Input
                id="lectura"
                width="auto"
                onChange={({ target: { value } }) => {
                  setTitle(value);
                }}
                maxLength={100}
                placeholder="Lectura"
                value={title}
                disabled={isLoadingCreateReading}
              />
            </InputGroup>
          </div>
          <div className={`${styles['form-value']} col`}>
            <label htmlFor="texto">Texto</label>
            <Textarea
              placeholder="Ingrese texto..."
              id="texto"
              onChange={({ target: { value } }) => {
                setContent(value);
              }}
              maxLength={1000}
              value={content}
              disabled={isLoadingCreateReading}
            ></Textarea>
          </div>
          <div className={`${styles['form-value']} col`}>
            <label>Categoría</label>
            <SearchBox
              placeholder="Selecciona una categoría"
              isLoading={isLoadingCategoriesAndSubcategories}
              onChange={setCategory}
              options={categoryOptions}
              value={category}
              disabled={isLoadingCreateReading}
            ></SearchBox>
          </div>
          <div className={`${styles['form-value']} col`}>
            <label>Subcategoría</label>
            <SearchBox
              placeholder="Selecciona una subcategoría"
              isLoading={isLoadingCategoriesAndSubcategories}
              onChange={setSubCategory}
              options={subcategoryOptions}
              value={subcategory}
              disabled={isLoadingCreateReading}
            ></SearchBox>
          </div>
          <div className={`${styles['form-value']} col`}>
            <label htmlFor="repo">Repositorio Público</label>
            <Switch id="repo" colorScheme="green" size="lg" />
          </div>
          <div className={`${styles['form-value']} col`}>
            <label htmlFor="portada">Portada</label>
            <InputFile
              id="portada"
              accept="image/png, image/gif, image/jpeg"
              onChange={onFileChange}
              disabled={isLoadingCreateReading}
            ></InputFile>
          </div>
        </ModalBody>
        <ModalFooter>
          {isLoadingCreateReading ? (
            <Spinner />
          ) : (
            <Button
              onClick={createReading}
              isDisabled={isAnyRequiredFieldEmpty}
              className={styles.primary}
              variant="solid"
            >
              Crear
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateReadingModal;
