import React from "react";
import logo from "../../assets/images/logo_ceibal.png";
import Image from "next/image";
import { useRouter } from "next/router";
import Casa from "../../assets/images/casa.svg";
import IconButton from "../buttons/IconButton";

const MainHeader: React.FC = () => {
  const { pathname, push } = useRouter();

  const onClickHome = () => push("/alumno");
  const isOnStudentPage = pathname.startsWith("/alumno");
  const homeIconDisabled = pathname === "/alumno";

  return (
    <div id="header" className="row">
      <div>
        <Image id="app-logo" src={logo} alt="" />
      </div>
      {isOnStudentPage && (
        <IconButton
          icon={Casa}
          size="big"
          onClick={onClickHome}
          disabled={homeIconDisabled}
        />
      )}
      <div>
        <a className="log-out-link">Salir</a>
      </div>
    </div>
  );
};

export default MainHeader;
