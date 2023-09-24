import React from "react";
import logo from "../../assets/images/logo_ceibal.png";
import Image from "next/image";
import { useRouter } from "next/router";
import Casa from "../../assets/images/casa.svg";
import IconButton from "../buttons/IconButton";
import { useUser } from "@/providers/UserContext";
import Link from "next/link";

const MainHeader: React.FC = () => {
  const { pathname, push } = useRouter();
  const user = useUser();

  const onClickHome = () => push("/alumno");
  const isOnStudentPage = pathname.startsWith("/alumno");
  const homeIconDisabled = pathname === "/alumno";
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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
        <span className="name">{user?.firstName}</span>
        <Link href={backendUrl + '/auth/logout'}>Salir</Link>
      </div>
    </div>
  );
};

export default MainHeader;
