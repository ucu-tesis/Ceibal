import { Group } from "@/pages/api/teachers/teachers";
import { useMemo } from "react";

const defaultOption = {
    label: "Todos",
    value: undefined,
};

const reducer = (school_years: number[], { school_year }: Group) =>
    school_years.includes(school_year)
        ? school_years
        : [...school_years, school_year];

const useGroupFilterOptions = (groups: Group[]) => {
    const school_years = useMemo(() => groups.reduce(reducer, []), [groups]);
    const filterOptions = useMemo(
        () => [
            defaultOption,
            ...school_years.map((year) => ({
                label: `${year}`,
                value: `${year}`,
            })),
        ],
        [school_years]
    );
    return { filterOptions };
};

export default useGroupFilterOptions;
