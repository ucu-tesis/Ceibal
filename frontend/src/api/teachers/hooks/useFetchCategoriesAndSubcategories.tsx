import { useQuery } from "@tanstack/react-query";
import { fetchCategoriesAndSubcategories } from "../teachers";

const useFetchCategoriesAndSubcategories = () =>
  useQuery({
    queryKey: ["teacher", "readings", "categories-subcategories"],
    queryFn: fetchCategoriesAndSubcategories,
  });

export default useFetchCategoriesAndSubcategories;
