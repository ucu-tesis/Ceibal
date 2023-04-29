import React from "react";
import logo from "../../assets/images/logo_ceibal.png";
import Image from "next/image";

const MainHeader: React.FC = () => {
  return (
    <div id="header" className="row">
      <div>
        <Image id="app-logo" src={logo} alt="" />
      </div>
      <div>Inicio</div>
    </div>
  );
};

export default MainHeader;
