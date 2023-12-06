import React, { useState, ChangeEvent } from "react";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { Input, InputGroup } from "@chakra-ui/react";

interface CreateReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  styles: any;
}

const CreateReadingModal: React.FC<CreateReadingModalProps> = ({ isOpen, onClose, styles }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className={styles["modal-content"]}>
        <ModalHeader tabIndex={0}>Crear Lectura</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className={`${styles["form-value"]} col`}>
            <label tabIndex={0}>Nombre</label>
            <InputGroup className={styles.medium}>
              <Input width="auto" maxLength={30} placeholder="Lectura" />
            </InputGroup>
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateReadingModal;
