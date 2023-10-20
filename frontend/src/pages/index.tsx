import React from "react";
import { useRouter } from "next/router";
import { useUser } from "@/providers/UserContext";

const Home: React.FC = () => {
  const router = useRouter();
  const user = useUser();

  if (!user) {
    router.replace("/login");
  } else if (user.type === "teacher") {
    router.replace("/maestro/grupos");
  } else if (user.type === "student") {
    router.replace("/alumno");
  }

  return <></>;
};

export default Home;
