import React from "react";
import { useHistory } from "react-router-dom";
import logo from "assets/img/arrow.png";
import "./style.css";
const ButtonBack = () => {
  let history = useHistory();
  return (
    <button className="btnBack btn_back" onClick={() => history.goBack()}>
      <img
        src={logo}
        style={{ transform: "translate(-49%, -45%)", position: "absolute" }}
      />
    </button>
  );
};

export default ButtonBack;
