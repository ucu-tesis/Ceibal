import React, { ChangeEvent, useReducer, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, useSteps } from "@chakra-ui/react";
import { StepSeparator, Input, InputGroup, InputRightAddon, ModalCloseButton } from "@chakra-ui/react";
import { Stack, Checkbox, Button, useToast } from "@chakra-ui/react";
import Select from "../selects/Select";
import { inputRegex, tableMaxHeightModal, toastDuration } from "@/constants/constants";
import ChakraTable, { ChakraTableColumn } from "../tables/ChakraTable";
import { SearchIcon } from "@chakra-ui/icons";
import InputDateTimeLocal from "../inputs/InputDateTimeLocal";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { dateFormats } from "@/util/dates";
import { createAssignment, fetchAllReadings } from "@/api/teachers/teachers";
import { Reading } from "@/models/Reading";

interface AssignmentCreationModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  evaluationGroupId: number;
  styles: any;
}

const READINGS_STEP = "Agregar Tareas";
const SUMMARY_STEP = "Resumen";

const steps = [READINGS_STEP, SUMMARY_STEP];

const readingSelectionColumns: ChakraTableColumn[] = [
  { label: "" },
  { label: "Categoría" },
  { label: "Subcategoría" },
  { label: "Lectura" },
];

const studentSelectionColumns: ChakraTableColumn[] = [
  { label: "" },
  { label: "Nombre" },
  { label: "Documento" },
  { label: "Correo" },
];

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
}

const getReadingCategories = (readings: Reading[]) => {
  return Array.from(new Set(readings.map(r => r.category)));
};

const getReadingSubcategories = (readings: Reading[]) => {
  return Array.from(
    new Set(readings.map(r => r.subcategory).filter(Boolean))
  );
};

const AssignmentCreationModal: React.FC<AssignmentCreationModalProps> = ({
  isOpen,
  onClose,
  evaluationGroupId,
  styles
}) => {
  const [readingSearch, setReadingSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>();
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>();
  
  const [selectedDueDate, setSelectedDueDate] = useState<string>(dayjs().toISOString());
  const [selectedReadings, setSelectedReadings] = useState<Reading[]>([]);

  // TODO pagination
  const readingsQueryData = useQuery({
    queryKey: ["teacher", "all-readings"],
    queryFn: () => fetchAllReadings(),
  })

  const isReadingSelected = (readingId: number) => {
    return selectedReadings.some((r) => r.id === readingId);
  };

  const toggleReading = (reading: Reading) => {
    if (!isReadingSelected(reading.id)) {
      setSelectedReadings([...selectedReadings, reading]);
    } else {
      setSelectedReadings(selectedReadings.filter((r) => r.id !== reading.id));
    }
  };

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const toast = useToast();

  // TODO test this
  const { mutate, isLoading, isError } = useMutation({
    mutationFn: async (readings: Reading[]) => {
      await createAssignment(evaluationGroupId, readings, selectedDueDate);
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
      mutate(selectedReadings);
    }
  };

  const undoStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const nextCondition = () => {
    if (steps[activeStep] === READINGS_STEP) {
      return selectedReadings.length === 0 || !selectedDueDate;
    } else {
      return false;
    }
  };

  function renderReadingsSelection(): React.ReactNode {
    if (readingsQueryData.isLoading) {
      return 'Loading readings...';
    }
    if (readingsQueryData.isError) {
      return `Error loading readings: ${readingsQueryData.error}`;
    }
    const filteredReadings = filterReadings(
      readingsQueryData.data.Readings, // TODO pagination
      readingSearch,
      categoryFilter,
      subcategoryFilter,
    );
    return <>
      <div className={`${styles.desc} row`}>
        <span tabIndex={0}>Fecha límite:</span>
        <InputDateTimeLocal
          value={selectedDueDate}
          onChange={(event: ChangeEvent) => {
            const { value } = event.target as HTMLInputElement;
            setSelectedDueDate(value);
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
              setReadingSearch(value.toLowerCase());
            }}
            maxLength={30}
            placeholder="Lectura"
            value={readingSearch} />
          <InputRightAddon>
            <SearchIcon />
          </InputRightAddon>
        </InputGroup>
        <div className="col">
          <label>Categoría</label>
          <Select
            defaultValue={{ label: categoryFilter || "Todas", value: categoryFilter }}
            options={[
              { label: "Todas", value: undefined },
              ...getReadingCategories(readingsQueryData.data.Readings).map(c => ({
                label: c,
                value: c,
              })),
            ]}
            onChange={(option) => {
              setCategoryFilter(option.value);
            }}
          ></Select>
        </div>
        <div className="col">
          <label>Subcategoría</label>
          <Select
            defaultValue={{ label: subcategoryFilter || "Todas", value: subcategoryFilter }}
            options={[
              { label: "Todas", value: undefined },
              ...getReadingSubcategories(readingsQueryData.data.Readings).map(sc => ({
                label: sc,
                value: sc,
              })),
            ]}
            onChange={(option) => {
              setSubcategoryFilter(option.value);
            }}
          ></Select>
        </div>
      </div>
      <ChakraTable
        variant="simple"
        maxHeight={tableMaxHeightModal}
        columns={readingSelectionColumns}
        data={
          filteredReadings.map(reading => ({
            checkbox: (
              <Checkbox
                key={reading.id}
                isChecked={isReadingSelected(reading.id)}
                onChange={() => {
                  toggleReading(reading);
                }}
              />
            ),
            category: reading.category,
            subcategory: reading.subcategory,
            title: reading.title,
          }))
        }
      ></ChakraTable>
    </>;
  }

  function renderSummary(): React.ReactNode {
    return <>
      <div className={`${styles.desc} row`}>
        <span tabIndex={0}>Fecha límite:</span>
        <span tabIndex={0}>{selectedDueDate}</span>
      </div>
      <div className={`${styles.desc} row`}>
        <span tabIndex={0}>Lecturas:</span>
        <ul>
          {selectedReadings.map((reading, index) => {
            return <li key={index}>{reading.title}</li>;
          })}
        </ul>
      </div>
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

export default AssignmentCreationModal;
