import React from "react";
import logo from "../../Assets/Img/logo_ceibal.png";

const MainHeader: React.FC = () => {
  return (
    <div id="header" className="row">
      <div>
        <img id="app-logo" src={logo} alt="" />
      </div>
      <div>Inicio</div>
    </div>
  );
};

export default MainHeader;
