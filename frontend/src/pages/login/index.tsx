import React, { useEffect } from "react";
import styles from "./login.module.css";

const Login: React.FC = () => {
  useEffect(() => {
    document.getElementById("header")?.remove();
    document.querySelector("hr")?.remove();
  }, []);

  return (
    <div className={`${styles["login-layout"]} row`}>
      <div></div>
      <div></div>
    </div>
  );
};

export default Login;
