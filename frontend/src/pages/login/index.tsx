import React, { useEffect } from "react";
import Head from "next/head";
import styles from "./login.module.css";
import Image from "next/image";
import LogoCeibal from "../../assets/images/logo_ceibal.png";
import RightIcon from "../../assets/images/right_icon.svg";
import InputText from "@/components/inputs/InputText";
import InputPassword from "@/components/inputs/InputPassword";
import RoundedButton from "@/components/buttons/RoundedButton";

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
          <InputText placeholder="Documento"></InputText>
          <InputPassword placeholder="Contraseña"></InputPassword>
          <RoundedButton variant={"black" as keyof Object}>
            <div>Continuar</div>
            <Image src={RightIcon} alt=""></Image>
          </RoundedButton>
          <span>Si aún no te has registrado como usuario/a y quieres acceder a las plataformas, haz <a href="/registro">clic aquí</a></span>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Login;
