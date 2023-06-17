import React, { useEffect } from "react";
import styles from "./login.module.css";
import Image from "next/image";
import LogoCeibal from "../../assets/images/logo_ceibal.png"
import InputText from "@/components/inputs/InputText";

const Login: React.FC = () => {
  useEffect(() => {
    document.getElementById("header")?.remove();
    document.querySelector("hr")?.remove();
  }, []);

  return (
    <div className={`${styles["login-layout"]} row`}>
      <div className={`${styles["col"]}`}>
        <Image src={LogoCeibal} alt=""></Image>
        <p>Inicio de Sesión</p>
        <InputText placeholder="Documento"></InputText>
        <InputText placeholder="Contraseña"></InputText>
      </div>
      <div></div>
    </div>
  );
};

export default Login;
