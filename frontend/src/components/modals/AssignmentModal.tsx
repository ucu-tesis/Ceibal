import React, { ChangeEvent, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, useSteps } from "@chakra-ui/react";
import { StepSeparator, Input, InputGroup, InputRightAddon, ModalCloseButton } from "@chakra-ui/react";
import { Stack, Checkbox, Button, useToast } from "@chakra-ui/react";
import Select from "../selects/Select";
import { inputRegex, tableMaxHeightModal, toastDuration } from "@/constants/constants";
import ChakraTable, { ChakraTableColumn } from "../tables/ChakraTable";
import { SearchIcon } from "@chakra-ui/icons";
import useAssignmentFilterOptions from "@/hooks/teachers/useAssignmentFilterOptions";
import useFilteredAssignments from "@/hooks/teachers/useFilteredAssignments";
import { Assignment } from "@/models/Assignment";
import { Student } from "@/models/Student";
import useFilteredStudents from "@/hooks/teachers/useFilteredStudents";
import InputDateTimeLocal from "../inputs/InputDateTimeLocal";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { dateFormats } from "@/util/dates";

interface AssignmentModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  assignments: Assignment[];
  students: Student[];
  assignmentColumnsModal: ChakraTableColumn[];
  studentColumnsModal: ChakraTableColumn[];
  evaluationGroupId: number;
  styles: any;
}

const toStudentTableListModal = (
  students: Student[],
  checkedCallback: (student: any) => void,
  uncheckedCallback: (fullName: any) => void,
  defaultValueCallback: (fullName: any) => boolean
) =>
  students.map(({ fullName, cedula, email }) => ({
    checkbox: (
      <Checkbox
        key={fullName}
        defaultChecked={defaultValueCallback(fullName)}
        onChange={(event: ChangeEvent) => {
          const checkbox = event.target as HTMLInputElement;
          if (checkbox.checked) {
            checkedCallback({ fullName, cedula, email });
          } else {
            uncheckedCallback(fullName);
          }
        }}
      />
    ),
    fullName,
    cedula,
    email,
  }));

const toAssignmentTableListModal = (
  assignments: Assignment[],
  checkedCallback: (assignment: any) => void,
  uncheckedCallback: (readingTitle: any) => void,
  defaultValueCallback: (readingTitle: any) => boolean
) =>
  assignments.map(({ readingCategory, readingSubcategory, readingTitle, readingId }) => ({
    checkbox: (
      <Checkbox
        key={readingTitle}
        defaultChecked={defaultValueCallback(readingTitle)}
        onChange={(event: ChangeEvent) => {
          const checkbox = event.target as HTMLInputElement;
          if (checkbox.checked) {
            checkedCallback({ readingCategory, readingSubcategory, readingTitle, readingId });
          } else {
            uncheckedCallback(readingTitle);
          }
        }}
      />
    ),
    readingCategory,
    readingSubcategory,
    readingTitle,
  }));

const READINGS_STEP = "Agregar Tareas";
const STUDENTS_STEP = "Agregar Alumnos";
const SUMMARY_STEP = "Resumen";

// TODO CEIB-151 add STUDENTS_STEP
const steps = [READINGS_STEP, SUMMARY_STEP];

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  assignments,
  students,
  assignmentColumnsModal,
  studentColumnsModal,
  evaluationGroupId,
  styles,
}) => {
  const [modalStudentSearchQuery, setModalStudentSearchQuery] = useState("");
  const [modalAssignmentSearchQuery, setModalAssignmentSearchQuery] = useState("");
  const [categoryOptionModal, setCategoryOptionModal] = useState<string>();
  const [subcategoryOptionModal, setSubcategoryOptionModal] = useState<string>();

  const [selectedAssignments, setSelectedAssignments] = useState<Assignment[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(dayjs(new Date()).format(dateFormats.assignmentDueDate));

  const { filteredStudents: filteredStudentsModal } = useFilteredStudents(students ?? [], modalStudentSearchQuery);

  const { filteredAssignments: filteredAssignmentsModal } = useFilteredAssignments(
    assignments,
    modalAssignmentSearchQuery,
    categoryOptionModal,
    subcategoryOptionModal
  );
  const { defaultOption, readingCategoryOptions, readingSubcategoryOptions } = useAssignmentFilterOptions(assignments);

  const addStudents = (student: any) => {
    setSelectedStudents((prevSelectedStudents) => [...prevSelectedStudents, student]);
  };

  const removeStudents = (fullName: any) => {
    setSelectedStudents(selectedStudents.filter((elem) => elem.fullName !== fullName));
  };

  const findStudent = (fullName: any) => {
    return selectedStudents.find((elem) => elem.fullName === fullName) !== undefined;
  };

  const addAssignment = (assignment: any) => {
    setSelectedAssignments((prevSelectedAssignments) => [...prevSelectedAssignments, assignment]);
  };

  const removeAssignment = (readingTitle: any) => {
    setSelectedAssignments(selectedAssignments.filter((elem) => elem.readingTitle !== readingTitle));
  };

  const findAssignment = (readingTitle: any) => {
    return selectedAssignments.find((elem) => elem.readingTitle === readingTitle) !== undefined;
  };

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const toast = useToast();

  // TODO test this
  const { mutate, isLoading, error } = useMutation({
    mutationFn: async (assignments: Assignment[]) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/evaluationGroups/${evaluationGroupId}/assignments`,
        {
          method: "POST",
          body: JSON.stringify({
            reading_id: assignments[0].readingId,
            due_date: selectedDate,
          }),
        }
      );
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error creating assignment: " + response.status);
      }
    },
    onSuccess: () => {
      setActiveStep(0);
      onClose();
      toast({
        title: "Tarea creada",
        status: "success",
        duration: toastDuration,
        isClosable: true,
      });
    },
    onError: () => {
      // TODO proper error modal
      toast({
        title: "Error",
        status: "error",
        duration: toastDuration,
        isClosable: true,
      });
    },
  });

  const changeStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      mutate(selectedAssignments);
    }
  };

  const undoStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const nextCondition = () => {
    if (steps[activeStep] === READINGS_STEP) {
      return selectedAssignments.length === 0 || !selectedDate;
    } else if (steps[activeStep] === STUDENTS_STEP) {
      return selectedStudents.length === 0;
    } else {
      return false;
    }
  };

  function renderReadingsSelection(): React.ReactNode {
    return <>
      <div className={`${styles.desc} row`}>
        <span tabIndex={0}>Fecha límite:</span>
        <InputDateTimeLocal
          value={selectedDate}
          onChange={(event: ChangeEvent) => {
            const { value } = event.target as HTMLInputElement;
            setSelectedDate(value);
          }}
        ></InputDateTimeLocal>
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
            value={modalAssignmentSearchQuery} />
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
        data={toAssignmentTableListModal(
          filteredAssignmentsModal,
          addAssignment,
          removeAssignment,
          findAssignment
        )}
      ></ChakraTable>
    </>;
  }

  function renderStudentSelection(): React.ReactNode {
    return <>
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
            value={modalStudentSearchQuery} />
          <InputRightAddon>
            <SearchIcon />
          </InputRightAddon>
        </InputGroup>
      </div>
      <ChakraTable
        variant="simple"
        maxHeight={tableMaxHeightModal}
        columns={studentColumnsModal}
        data={toStudentTableListModal(filteredStudentsModal, addStudents, removeStudents, findStudent)}
      ></ChakraTable>
    </>;
  }

  function renderSummary(): React.ReactNode {
    return <>
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
      {steps.includes(STUDENTS_STEP) && (<div className={`${styles.desc} row`}>
        <span tabIndex={0}>Alumnos:</span>
        <ul>
          {selectedStudents.map((student, index) => {
            return <li key={index}>{student?.fullName}</li>;
          })}
        </ul>
      </div>)}
    </>;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className={styles["modal-content"]}>
        <ModalHeader tabIndex={0}>Asignar Tarea</ModalHeader>
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

          {steps[activeStep] === READINGS_STEP && renderReadingsSelection()}
          {steps[activeStep] === STUDENTS_STEP && renderStudentSelection()}
          {steps[activeStep] === SUMMARY_STEP && renderSummary()}
        </ModalBody>
        <ModalFooter className={styles["flex-center"]}>
          {activeStep > 0 && (
            <Button onClick={undoStep} className={styles.secondary} variant="outline">
              Volver
            </Button>
          )}
          <Button onClick={changeStep} isDisabled={nextCondition()} className={styles.primary} variant="solid">
            {activeStep < steps.length - 1 ? "Continuar" : "Asignar Tarea"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssignmentModal;