import React, { useState, ChangeEvent } from "react";
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
import { Input, InputGroup, Button, Switch } from "@chakra-ui/react";
import Select, { Option } from "../selects/Select";

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
              <Input id="lectura" width="auto" maxLength={30} placeholder="Lectura" />
            </InputGroup>
          </div>
          <div className={`${styles["form-value"]} col`}>
            <label htmlFor="texto">Texto</label>
            <Textarea placeholder="Ingrese texto..." id="texto" className={styles.medium}></Textarea>
          </div>
          <div className={`${styles["form-value"]} col`}>
            <label>Categoría</label>
            <Select defaultValue={categoryOptions[0]} options={categoryOptions}></Select>
          </div>
          <div className={`${styles["form-value"]} col`}>
            <label>Subcategoría</label>
            <Select defaultValue={subCategoryOptions[0]} options={subCategoryOptions}></Select>
          </div>
          <div className={`${styles["form-value"]} col`}>
            <label htmlFor="repo">Repositorio Público</label>
            <Switch id="repo" colorScheme="green" />
          </div>
          <div className={`${styles["form-value"]} col`}>
            <label htmlFor="portada">Portada</label>
            <input id="portada" type="file"></input>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} className={styles.primary} variant="solid">
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateReadingModal;
