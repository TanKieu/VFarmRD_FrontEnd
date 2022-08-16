/* eslint-disable prettier/prettier */
import React, { useState } from "react";
//import GridContainer from "components/Grid/GridContainer";
//import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button.js";
import { makeStyles } from "@material-ui/core/styles";
import SupplierTable from "views/Supplier/SupplierTable";
import ClientTable from "views/Client/ClientTable";
import ToolTable from "views/Tool/ToolTable";
import Category from "views/Tool/ToolCategories";


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
const divStyle = {
  marginTop: "2%"
};
const buttonStyle = {
  marginRight: "5%",
  marginLeft: "5%",
  marginBottom: "3%",
  minHeight: "20%",
  width: "15%",
  position: "inline"
}

const useStyles = makeStyles(styles);



export default function OtherButton() {
  const classes = useStyles();
  const [compon, setCompon] = useState("");
  const button1Click = () => {
    setCompon("supplier");
  }
  const button2Click = () => {
    setCompon("client");
  }
  const button3Click = () => {
    setCompon("tool");
  }
  const button4Click = () => {
    setCompon("category");
  }
  if (compon === "supplier") {
    return (
      <div style={divStyle} className={classes.cardTitleWhite}>
        <Button type="button" color="info" style={buttonStyle} onClick={button1Click}>Nhà Cung Cấp</Button>
        <Button type="button" color="info" style={buttonStyle} onClick={button2Click}>Khách Hàng</Button>
        <Button type="button" color="info" style={buttonStyle} onClick={button3Click}>Công Cụ</Button>
        <Button type="button" color="info" style={buttonStyle} onClick={button4Click}>Loại Công cụ</Button>
        <SupplierTable></SupplierTable>
      </div>
    );

  }
  else if (compon === "client") {
    return (
      <div style={divStyle} className={classes.cardTitleWhite}>
        <Button type="button" color="info" style={buttonStyle} onClick={button1Click}>Nhà Cung Cấp</Button>
        <Button type="button" color="info" style={buttonStyle} onClick={button2Click}>Khách Hàng</Button>
        <Button type="button" color="info" style={buttonStyle} onClick={button3Click}>Công Cụ</Button>
        <Button type="button" color="info" style={buttonStyle} onClick={button4Click}>Loại Công cụ</Button>
        <ClientTable></ClientTable>
      </div>
    );
  }
  else if (compon === "tool") {
    return (
      <div style={divStyle} className={classes.cardTitleWhite}>
        <Button type="button" color="info" style={buttonStyle} onClick={button1Click}>Nhà Cung Cấp</Button>
        <Button type="button" color="info" style={buttonStyle} onClick={button2Click}>Khách Hàng</Button>
        <Button type="button" color="info" style={buttonStyle} onClick={button3Click}>Công Cụ</Button>
        <Button type="button" color="info" style={buttonStyle} onClick={button4Click}>Loại Công cụ</Button>
        <ToolTable></ToolTable>
      </div>
    );
  }
  else if (compon === "category") {
    return (
      <div style={divStyle} className={classes.cardTitleWhite}>
        <Button type="button" color="info" style={buttonStyle} onClick={button1Click}>Nhà Cung Cấp</Button>
        <Button type="button" color="info" style={buttonStyle} onClick={button2Click}>Khách Hàng</Button>
        <Button type="button" color="info" style={buttonStyle} onClick={button3Click}>Công Cụ</Button>
        <Button type="button" color="info" style={buttonStyle} onClick={button4Click}>Loại Công cụ</Button>
        <Category></Category>
      </div>
    );
  }
  return (
    <div style={divStyle} className={classes.cardTitleWhite}>
      <Button type="button" color="info" style={buttonStyle} onClick={button1Click}>Nhà Cung Cấp</Button>
      <Button type="button" color="info" style={buttonStyle} onClick={button2Click}>Khách Hàng</Button>
      <Button type="button" color="info" style={buttonStyle} onClick={button3Click}>Công Cụ</Button>
      <Button type="button" color="info" style={buttonStyle} onClick={button4Click}>Loại Công cụ</Button>
    </div>
  );



}