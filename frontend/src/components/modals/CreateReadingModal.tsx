import React, { ChangeEvent, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
} from "@chakra-ui/react";
import { Input, InputGroup, Button, Switch, useToast } from "@chakra-ui/react";
import Select, { Option } from "../selects/Select";
import { isNullOrEmpty } from "@/util/util";
import { toastDuration } from "@/constants/constants";
import SearchBox from "../selects/SearchBox";
import InputFile from "../inputs/InputFile";

interface CreateReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  styles: any;
}

const categoryOptions: Option[] = [
  { value: "intermedio", label: "Intermedio" },
  { value: "basico", label: "Básico" },
  { value: "avanzado", label: "Avanzado" },
];

const subCategoryOptions: Option[] = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
];

const CreateReadingModal: React.FC<CreateReadingModalProps> = ({ isOpen, onClose, styles }) => {
  const toast = useToast();

  const [name, setName] = useState<string>();
  const [text, setText] = useState<string>();
  const [file, setFile] = useState<any>();

  const fileChangeCallback = (event: ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    setFile(element.files);
  };

  const createCondition = () => {
    return isNullOrEmpty(name) || isNullOrEmpty(text);
  };

  const createReading = () => {
    onClose();
    toast({
      title: "Lectura creada",
      status: "success",
      duration: toastDuration,
      isClosable: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className={styles["modal-content"]}>
        <ModalHeader tabIndex={0}>Crear Lectura</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className={`${styles["form-value"]} col`}>
            <label htmlFor="lectura">Nombre</label>
            <InputGroup className={styles.medium}>
              <Input
                id="lectura"
                width="auto"
                onChange={({ target: { value } }) => {
                  setName(value);
                }}
                maxLength={100}
                placeholder="Lectura"
              />
            </InputGroup>
          </div>
          <div className={`${styles["form-value"]} col`}>
            <label htmlFor="texto">Texto</label>
            <Textarea
              placeholder="Ingrese texto..."
              id="texto"
              onChange={({ target: { value } }) => {
                setText(value);
              }}
              maxLength={1000}
            ></Textarea>
          </div>
          <div className={`${styles["form-value"]} col`}>
            <label>Categoría</label>
            <SearchBox defaultValue={categoryOptions[0]} options={categoryOptions}></SearchBox>
          </div>
          <div className={`${styles["form-value"]} col`}>
            <label>Subcategoría</label>
            <SearchBox defaultValue={subCategoryOptions[0]} options={subCategoryOptions}></SearchBox>
          </div>
          <div className={`${styles["form-value"]} col`}>
            <label htmlFor="repo">Repositorio Público</label>
            <Switch id="repo" colorScheme="green" size="lg" />
          </div>
          <div className={`${styles["form-value"]} col`}>
            <label htmlFor="portada">Portada</label>
            <InputFile
              id="portada"
              accept="image/png, image/gif, image/jpeg"
              value={file}
              onChange={fileChangeCallback}
            ></InputFile>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={createReading} isDisabled={createCondition()} className={styles.primary} variant="solid">
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateReadingModal;
