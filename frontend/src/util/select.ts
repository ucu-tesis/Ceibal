import { Option } from "@/components/selects/Select";

export const getOptionsFromArray = (
  arr: string[],
  defaultOption: Option
): Option[] => [
  defaultOption,
  ...Array.from(new Set(arr)).map((str) => ({ label: str, value: str })),
];
