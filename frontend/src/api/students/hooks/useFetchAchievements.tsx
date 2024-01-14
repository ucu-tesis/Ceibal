import { useUser } from "@/providers/UserContext";
import { useQuery } from "@tanstack/react-query";
import { fetchAchievements } from "../students";

const useFetchAchievements = () => {
  const { id } = useUser();
  return useQuery({
    queryKey: ["student", "achievements", id],
    queryFn: fetchAchievements,
  });
};

export default useFetchAchievements;
