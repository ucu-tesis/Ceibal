import React, { ChangeEvent, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, useSteps } from "@chakra-ui/react";
import { StepSeparator, Input, InputGroup, InputRightAddon, ModalCloseButton } from "@chakra-ui/react";
import { Stack, Checkbox, Button } from "@chakra-ui/react";
import InputDate from "../inputs/InputDate";
import Select from "../selects/Select";
import { inputRegex, tableMaxHeightModal } from "@/constants/constants";
import ChakraTable, { ChakraTableColumn } from "../tables/ChakraTable";
import { SearchIcon } from "@chakra-ui/icons";
import useAssignmentFilterOptions from "@/hooks/teachers/useAssignmentFilterOptions";
import useFilteredAssignments from "@/hooks/teachers/useFilteredAssignments";
import { Assignment } from "@/models/Assignment";
import { Student } from "@/models/Student";
import useFilteredStudents from "@/hooks/teachers/useFilteredStudents";

interface AssignmentModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  steps: String[];
  assignments: Assignment[];
  students: Student[];
  assignmentColumnsModal: ChakraTableColumn[];
  studentColumnsModal: ChakraTableColumn[];
  styles: any;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  steps,
  assignments,
  students,
  assignmentColumnsModal,
  studentColumnsModal,
  styles,
}) => {
  const [modalStudentSearchQuery, setModalStudentSearchQuery] = useState("");
  const [modalAssignmentSearchQuery, setModalAssignmentSearchQuery] = useState("");
  const [categoryOptionModal, setCategoryOptionModal] = useState<string | undefined>(undefined);
  const [subcategoryOptionModal, setSubcategoryOptionModal] = useState<string | undefined>(undefined);

  const [selectedAssignments, setSelectedAssignments] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const { filteredStudents: filteredStudentsModal } = useFilteredStudents(students ?? [], modalStudentSearchQuery);

  const { filteredAssignments: filteredAssignmentsModal } = useFilteredAssignments(
    assignments,
    modalAssignmentSearchQuery,
    categoryOptionModal,
    subcategoryOptionModal
  );
  const { defaultOption, readingCategoryOptions, readingSubcategoryOptions } = useAssignmentFilterOptions(assignments);

  const toAssignmentTableListModal = (assignments: Assignment[]) =>
    assignments.map(({ readingCategory, readingSubcategory, readingTitle }, index) => ({
      checkbox: (
        <Checkbox
          onChange={(event: ChangeEvent) => {
            const checkbox = event.target as HTMLInputElement;
            if (checkbox.checked) {
              setSelectedAssignments(
                selectedAssignments.concat({ readingCategory, readingSubcategory, readingTitle, index })
              );
            } else {
              setSelectedAssignments(selectedAssignments.filter((elem) => elem.index !== index));
            }
          }}
        />
      ),
      readingCategory,
      readingSubcategory,
      readingTitle,
    }));

  const toStudentTableListModal = (students: Student[]) =>
    students.map(({ fullName, cedula, email }, index) => ({
      checkbox: (
        <Checkbox
          onChange={(event: ChangeEvent) => {
            const checkbox = event.target as HTMLInputElement;
            if (checkbox.checked) {
              setSelectedStudents(selectedStudents.concat({ fullName, cedula, email, index }));
            } else {
              setSelectedStudents(selectedStudents.filter((elem) => elem.index !== index));
            }
          }}
        />
      ),
      fullName,
      cedula,
      email,
    }));

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const changeStep = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
    } else {
      setActiveStep(1);
      onClose();
    }
  };

  const undoStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className={styles["modal-content"]}>
        <ModalHeader tabIndex={0}>Crear Tarea</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stepper index={activeStep}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
                </StepIndicator>

                <Stack flexShrink="0">
                  <StepTitle>{step}</StepTitle>
                </Stack>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>

          {activeStep === 1 && (
            <>
              <div className={`${styles.desc} row`}>
                <span tabIndex={0}>Fecha límite:</span>
                <InputDate
                  value={selectedDate}
                  onChange={(event: ChangeEvent) => {
                    const { value } = event.target as HTMLInputElement;
                    setSelectedDate(value);
                  }}
                ></InputDate>
              </div>
              <span>
                <strong tabIndex={0}>Lecturas:</strong>
              </span>
              <div className={`${styles.filters} row`}>
                <InputGroup className={styles.small}>
                  <Input
                    width="auto"
                    onKeyDown={(e) => {
                      if (!e.key.match(inputRegex)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={({ target: { value } }) => {
                      setModalAssignmentSearchQuery(value.toLowerCase());
                    }}
                    maxLength={30}
                    placeholder="Lectura"
                  />
                  <InputRightAddon>
                    <SearchIcon />
                  </InputRightAddon>
                </InputGroup>
                <div className="col">
                  <label>Categoría</label>
                  <Select
                    defaultValue={defaultOption}
                    options={readingCategoryOptions}
                    onChange={(option) => {
                      setCategoryOptionModal(option.value);
                    }}
                  ></Select>
                </div>
                <div className="col">
                  <label>Subcategoría</label>
                  <Select
                    defaultValue={defaultOption}
                    options={readingSubcategoryOptions}
                    onChange={(option) => {
                      setSubcategoryOptionModal(option.value);
                    }}
                  ></Select>
                </div>
              </div>
              <ChakraTable
                variant="simple"
                maxHeight={tableMaxHeightModal}
                columns={assignmentColumnsModal}
                data={toAssignmentTableListModal(filteredAssignmentsModal)}
              ></ChakraTable>
            </>
          )}
          {activeStep === 2 && (
            <>
              <div className={`${styles.desc} row`}>
                <span tabIndex={0}>Fecha límite:</span>
                <span tabIndex={0}>{selectedDate}</span>
              </div>
              <div className={`${styles.desc} row`}>
                <span tabIndex={0}>Lecturas:</span>
                <ul>
                  {selectedAssignments.map((assignment, index) => {
                    return <li key={index}>{assignment?.readingTitle}</li>;
                  })}
                </ul>
              </div>
              <span>
                <strong tabIndex={0}>Alumnos:</strong>
              </span>
              <div className={`${styles.filters} row`}>
                <InputGroup>
                  <Input
                    width="auto"
                    onKeyDown={(e) => {
                      if (!e.key.match(inputRegex)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={({ target: { value } }) => {
                      setModalStudentSearchQuery(value.toLowerCase());
                    }}
                    maxLength={30}
                    placeholder="Documento o Nombre"
                  />
                  <InputRightAddon>
                    <SearchIcon />
                  </InputRightAddon>
                </InputGroup>
              </div>
              <ChakraTable
                variant="simple"
                maxHeight={tableMaxHeightModal}
                columns={studentColumnsModal}
                data={toStudentTableListModal(filteredStudentsModal)}
              ></ChakraTable>
            </>
          )}
          {activeStep === 3 && (
            <>
              <div className={`${styles.desc} row`}>
                <span tabIndex={0}>Fecha límite:</span>
                <span tabIndex={0}>{selectedDate}</span>
              </div>
              <div className={`${styles.desc} row`}>
                <span tabIndex={0}>Lecturas:</span>
                <ul>
                  {selectedAssignments.map((assignment, index) => {
                    return <li key={index}>{assignment?.readingTitle}</li>;
                  })}
                </ul>
              </div>
              <div className={`${styles.desc} row`}>
                <span tabIndex={0}>Alumnos:</span>
                <ul>
                  {selectedStudents.map((student, index) => {
                    return <li key={index}>{student?.fullName}</li>;
                  })}
                </ul>
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter className={styles["flex-center"]}>
          {activeStep > 1 && (
            <Button onClick={undoStep} className={styles.secondary} variant="outline">
              Volver
            </Button>
          )}
          <Button onClick={changeStep} className={styles.primary} variant="solid">
            {activeStep < 3 ? "Continuar" : "Asignar Tarea"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssignmentModal;
