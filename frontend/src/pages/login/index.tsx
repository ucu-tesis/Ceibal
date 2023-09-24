import React, { useEffect } from "react";
import Head from "next/head";
import styles from "./login.module.css";
import Image from "next/image";
import LogoCeibal from "../../assets/images/logo_ceibal.png";
import RightIcon from "../../assets/images/right_icon.svg";
import InputText from "@/components/inputs/InputText";
import InputPassword from "@/components/inputs/InputPassword";
import RoundedButton from "@/components/buttons/RoundedButton";
import Link from "next/link";

const Login: React.FC = () => {
  useEffect(() => {
    document.getElementById("header")?.remove();
    document.querySelector("hr")?.remove();
  }, []);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={`${styles["login-layout"]} row`}>
        <div className={`${styles["col"]}`}>
          <Image src={LogoCeibal} alt=""></Image>
          <p>Inicio de Sesión</p>
          <RoundedButton variant="white">
            <div>Acceder con Google</div>
            <Image src={RightIcon} alt=""></Image>
          </RoundedButton>
          <RoundedButton variant="black">
            <div>Login de prueba: Estudiante</div>
            <Image src={RightIcon} alt=""></Image>
          </RoundedButton>
          <RoundedButton variant="black">
            <div>Login de prueba: Maestro</div>
            <Image src={RightIcon} alt=""></Image>
          </RoundedButton>
          <span>Si aún no te has registrado como usuario/a y quieres acceder a las plataformas, haz <Link href="https://aulas.ceibal.edu.uy/registrarme">clic aquí</Link></span>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Login;
