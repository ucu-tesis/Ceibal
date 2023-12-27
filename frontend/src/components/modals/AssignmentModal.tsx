import {
  inputRegex,
  tableMaxHeightModal,
  toastDuration,
} from "@/constants/constants";
import useAssignmentFilterOptions from "@/hooks/teachers/useAssignmentFilterOptions";
import useFilteredAssignments from "@/hooks/teachers/useFilteredAssignments";
import useFilteredStudents from "@/hooks/teachers/useFilteredStudents";
import { Assignment } from "@/models/Assignment";
import { Student } from "@/models/Student";
import { dateFormats } from "@/util/dates";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  useToast,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { ChangeEvent, useState } from "react";
import InputDateTimeLocal from "../inputs/InputDateTimeLocal";
import Select from "../selects/Select";
import ChakraTable, { ChakraTableColumn } from "../tables/ChakraTable";

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
  assignments.map(({ readingCategory, readingSubcategory, readingTitle }) => ({
    checkbox: (
      <Checkbox
        key={readingTitle}
        defaultChecked={defaultValueCallback(readingTitle)}
        onChange={(event: ChangeEvent) => {
          const checkbox = event.target as HTMLInputElement;
          if (checkbox.checked) {
            checkedCallback({
              readingCategory,
              readingSubcategory,
              readingTitle,
            });
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
  const [modalAssignmentSearchQuery, setModalAssignmentSearchQuery] =
    useState("");
  const [categoryOptionModal, setCategoryOptionModal] = useState<string>();
  const [subcategoryOptionModal, setSubcategoryOptionModal] =
    useState<string>();

  const [selectedAssignments, setSelectedAssignments] = useState<Assignment[]>(
    []
  );
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs(new Date()).format(dateFormats.assignmentDueDate)
  );

  const { filteredStudents: filteredStudentsModal } = useFilteredStudents(
    students ?? [],
    modalStudentSearchQuery
  );

  const { filteredAssignments: filteredAssignmentsModal } =
    useFilteredAssignments(
      assignments,
      modalAssignmentSearchQuery,
      categoryOptionModal,
      subcategoryOptionModal
    );
  const { defaultOption, readingCategoryOptions, readingSubcategoryOptions } =
    useAssignmentFilterOptions(assignments);

  const addStudents = (student: any) => {
    setSelectedStudents((prevSelectedStudents) => [
      ...prevSelectedStudents,
      student,
    ]);
  };

  const removeStudents = (fullName: any) => {
    setSelectedStudents(
      selectedStudents.filter((elem) => elem.fullName !== fullName)
    );
  };

  const findStudent = (fullName: any) => {
    return (
      selectedStudents.find((elem) => elem.fullName === fullName) !== undefined
    );
  };

  const addAssignment = (assignment: any) => {
    setSelectedAssignments((prevSelectedAssignments) => [
      ...prevSelectedAssignments,
      assignment,
    ]);
  };

  const removeAssignment = (readingTitle: any) => {
    setSelectedAssignments(
      selectedAssignments.filter((elem) => elem.readingTitle !== readingTitle)
    );
  };

  const findAssignment = (readingTitle: any) => {
    return (
      selectedAssignments.find((elem) => elem.readingTitle === readingTitle) !==
      undefined
    );
  };

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const toast = useToast();

  const changeStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      setActiveStep(0);
      onClose();
      toast({
        title: "Tarea creada",
        status: "success",
        duration: toastDuration,
        isClosable: true,
      });
    }
  };

  const undoStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const nextCondition = () => {
    if (activeStep === 0) {
      return selectedAssignments.length === 0 || !selectedDate;
    } else if (activeStep === 1) {
      return selectedStudents.length === 0;
    } else {
      return false;
    }
  };
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
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Stack flexShrink="0">
                  <StepTitle>{step}</StepTitle>
                </Stack>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <>
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
                    value={modalAssignmentSearchQuery}
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
                data={toAssignmentTableListModal(
                  filteredAssignmentsModal,
                  addAssignment,
                  removeAssignment,
                  findAssignment
                )}
              ></ChakraTable>
            </>
          )}
          {activeStep === 1 && (
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
                    value={modalStudentSearchQuery}
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
                data={toStudentTableListModal(
                  filteredStudentsModal,
                  addStudents,
                  removeStudents,
                  findStudent
                )}
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
          {activeStep > 0 && (
            <Button
              onClick={undoStep}
              className={styles.secondary}
              variant="outline"
            >
              Volver
            </Button>
          )}
          <Button
            onClick={changeStep}
            isDisabled={nextCondition()}
            className={styles.primary}
            variant="solid"
          >
            {activeStep < 2 ? "Continuar" : "Asignar Tarea"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssignmentModal;
