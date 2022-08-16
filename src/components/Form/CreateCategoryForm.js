/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
//import Tabs from "components/CustomTabs/CustomTabs.js";
//import Tasks from "components/Tasks/Tasks.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
// import { useHistory } from "react-router-dom";
import CardFooter from "components/Card/CardFooter";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Select from "react-dropdown-select";
import Info from "components/Typography/Info";

const styles = {
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
  errorMessage: {
    color: "red",
  },
};

const useStyles = makeStyles(styles);

export const CreateCategoryForm = () => {
  const classes = useStyles();
  const [formError, setFormErrors] = useState({});
  const token = localStorage.getItem("token");
  const urlCategory = process.env.REACT_APP_SERVER_URL + `/api/toolcategories`;

  const onSubmit = (event) => {
    event.preventDefault();
    const toolcategory_name = event.target.toolcategory_name.value;
    const description = event.target.description.value;
    const dataJson = {
      toolcategory_name,
      description,
    };
    console.log(JSON.stringify(dataJson));
    console.log(dataJson);
    const noti = toast("Please wait...");
    fetch(urlCategory, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataJson),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else {
          toast.update(noti, {
            render: "Tạo thành công",
            type: "success",
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.update(noti, {
          render: error.toString(),
          type: "error",
          isLoading: false,
        });
      });
  };
  return (
    <>
      <form id="create-category-form" onSubmit={onSubmit}>
        <div className="categoryDetailInfor">
          <GridContainer>
            <ToastContainer />
            {/*<GridItem xs={12} sm={12} md={12}>
          <div className="deactiveButton">
            <Button className="form-control btn btn-primary"
              type="submit"
              color={buttonColor}
              onClick={buttonFunc}>
              {buttonText}
            </Button>
          </div>
        </GridItem>*/}
            <GridItem xs={12} sm={12} md={10}>
              <Card>
                <CardHeader color="info" className={classes.cardTitleWhite}>
                  Tạo mới Loại công cụ
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <>
                        <Info> Tên loại công cụ</Info>
                        <CustomInput
                          color="primary"
                          id="toolcategory_name"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            multiline: true,
                            rows: 1,
                          }}
                        />
                      </>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                      <>
                        <Info> Mô tả loại công cụ</Info>
                        <CustomInput
                          color="primary"
                          id="description"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            multiline: true,
                            rows: 3,
                          }}
                        />
                      </>
                    </GridItem>
                    <Button type="submit" color="info">Tạo loại công cụ</Button>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </form>
    </>
  );
};
export default CreateCategoryForm;
