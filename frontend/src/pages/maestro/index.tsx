import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useUser } from "@/providers/UserContext";

const TeacherHomeScreen: React.FC = () => {
  const router = useRouter();
  const user = useUser();

  return (
    <>
      <Head>
        <title>Menú Principal</title>
      </Head>
      <div>Dashboard maestro: {user.firstName}</div>
    </>
  );
};

export default TeacherHomeScreen;
