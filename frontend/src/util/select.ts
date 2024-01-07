import { Option } from "@/components/selects/Select";

export const getOptionsFromArray = (
  arr: string[],
  defaultOption: Option
): Option[] => [
  ...Array.from(new Set(arr)).map((str) => ({ label: str, value: str })),
  defaultOption,
];
