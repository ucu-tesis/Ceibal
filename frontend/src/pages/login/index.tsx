import React, { useEffect } from "react";
import Head from "next/head";
import styles from "./login.module.css";
import Image from "next/image";
import LogoCeibal from "../../assets/images/logo_ceibal.png";
import RightIcon from "../../assets/images/right_icon.svg";
import RightIconBlack from "../../assets/images/right_icon_black.svg";
import RoundedButton from "@/components/buttons/RoundedButton";
import Link from "next/link";
import { useRouter } from "next/router";

const Login: React.FC = () => {
  useEffect(() => {
    document.getElementById("header")?.remove();
    document.querySelector("hr")?.remove();
  }, []);

  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const goToGoogleAuth = () => {
    router.push(`${backendUrl}/auth/google`);
  };

  const goToFakeStudentLogin = () => {
    router.push(`${backendUrl}/auth/fake-student`);
  };

  const goToFakeTeacherLogin = () => {
    router.push(`${backendUrl}/auth/fake-teacher`);
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={`${styles["login-layout"]} row`}>
        <div className={`${styles["col"]}`}>
          <Image src={LogoCeibal} alt=""></Image>
          <p>Inicio de Sesión</p>
          <RoundedButton variant="white" onClick={goToGoogleAuth}>
            <div>Ingresar con Google</div>
            <Image src={RightIconBlack} alt="" aria-hidden="true"></Image>
          </RoundedButton>
          <RoundedButton variant="black" onClick={goToFakeStudentLogin}>
            <div>Login de prueba: Estudiante</div>
            <Image src={RightIcon} alt="" aria-hidden="true"></Image>
          </RoundedButton>
          <RoundedButton variant="black" onClick={goToFakeTeacherLogin}>
            <div>Login de prueba: Maestro</div>
            <Image src={RightIcon} alt="" aria-hidden="true"></Image>
          </RoundedButton>
          <span>
            Si aún no te has registrado como usuario/a y quieres acceder a las
            plataformas, haz{" "}
            <Link href="https://aulas.ceibal.edu.uy/registrarme">
              clic aquí
            </Link>
          </span>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Login;
