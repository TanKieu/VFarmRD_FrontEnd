/* eslint-disable no-unused-vars */
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import BOMTable from "components/Table/BOMTable";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
import ButtonBack from "components/ButtonBack";
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

export default function FormulaExport() {
  const location = useLocation();
  const formulaBOMJSON = location.state.formulaBOMJSON;
  const project = location.state.project;
  const formula = location.state.formula;
  return (
    <>
      <div className="navbar1">
        <AdminNavbarLinks />
      </div>
      <ButtonBack />
      <div
        style={{
          marginLeft: "5%",
          marginRight: "5%",
          alignContent: "center",
        }}
      >
        <BOMTable
          formula={formula}
          formulaBOMJSON={formulaBOMJSON}
          project={project}
        />
      </div>
    </>
  );
}
