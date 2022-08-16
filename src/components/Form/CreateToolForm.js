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

export const CreateToolForm = () => {
  const classes = useStyles();
  const [formError, setFormErrors] = useState({});
  const token = localStorage.getItem("token");
  var [cateOption, setCateOption] = useState();
  const [cateId, setCateId] = useState();
  const urlTool = process.env.REACT_APP_SERVER_URL + `/api/tools`;
  const urlCategory = process.env.REACT_APP_SERVER_URL + "/api/toolcategories/";

  const handleMatName = (e) => {
    if (e.target.value === "") {
      setFormErrors({
        ...formError,
        name: "Tên Bao bì không được để trống",
      });
    } else if (e.target.value.length > 1000) {
      setFormErrors({
        ...formError,
        name: "Tên Bao bì phải ít hơn 1000 ký tự",
      });
    } else {
      setFormErrors({
        ...formError,
        name: "",
      });
    }
  };

  const fetchData = () => {
    axios.get(urlCategory, {
      headers:
      {
        'Conttent-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then((res) => {
        setCateOption(
          res.data.map((item) => {
            var option = {
              value: item.toolcategory_id,
              label: item.toolcategory_name,
            };
            return option;
          })
        );
      }).catch((error) => {
        console.log(error);
      })
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    const tool_name = event.target.tool_name.value;
    const description = event.target.description.value;
    const toolcategory_id = cateId;
    const parameter = event.target.parameter.value;
    const unit = event.target.unit.value;
    const dataJson = {
      tool_name,
      toolcategory_id,
      description,
      parameter,
      unit,
    };
    console.log(JSON.stringify(dataJson));
    console.log(dataJson);
    const urlToolUpdate = process.env.REACT_APP_SERVER_URL + `/api/tools`;
    const noti = toast("Please wait...");
    fetch(urlToolUpdate, {
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
      <form id="create-tool-form" onSubmit={onSubmit}>
        <div className="toolDetailInfor">
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
                  Tạo mới công cụ
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <>
                        <Info> Tên Công cụ</Info>
                        <CustomInput
                          color="primary"
                          id="tool_name"
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
                        <Info> Mô tả Công cụ</Info>
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
                    <GridItem xs={12} sm={12} md={12}>
                      <Select
                        options={cateOption}
                        placeholder="Chọn Loại công cụ"
                        onChange={(e) => { setCateId(e[0].value) }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                      <>
                        <Info> Thông số</Info>
                        <CustomInput
                          color="primary"
                          id="parameter"
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
                    <GridItem xs={12} sm={12} md={12}>
                      <>
                        <Info> Đơn vị</Info>
                        <CustomInput
                          color="primary"
                          id="unit"
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

                    <Button type="submit" color="info">Tạo công cụ</Button>
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
export default CreateToolForm;
