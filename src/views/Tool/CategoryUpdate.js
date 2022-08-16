/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
//import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
//import Tabs from "components/CustomTabs/CustomTabs.js";
//import Tasks from "components/Tasks/Tasks.js";
import Button from "components/CustomButtons/Button.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Info from "components/Typography/Info";
import { toast, ToastContainer } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
import CustomInput from "components/CustomInput/CustomInput";
import ReactLoading from "react-loading";
import Select from "react-dropdown-select";


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
export default function CategoryUpdate() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const categoryId = location.state.toolcategory_id;
  const [categoryData, setCategoryData] = useStateWithCallbackLazy("");
  const urlCategory = process.env.REACT_APP_SERVER_URL + "/api/toolcategories/";
  //const [clientName, setClientName] = useState("");
  //const [data, setData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  //const [buttonCreateFormulaStatus, setButtonCreateFormulaStatus] = useStateWithCallbackLazy(true);
  const fetchData = () => {
    axios.get(urlCategory + categoryId, {
      headers: {
        'Conttent-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then((res) => {
        console.log(res.data);
        setCategoryData(res.data, (currentResponse) => {
          console.log(currentResponse);
          setCategoryData(currentResponse);
        });
        console.log(categoryData);
      })
      .catch((error) => {
        console.log(error);
      });
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  }
  useEffect(() => {
    fetchData();

  }, []);

  /*function deacticeTool() {
    const urlDeactive = process.env.REACT_APP_SERVER_URL + `/api/tools/${toolId}`;
    const noti = toast("Please wait...");
    fetch(urlDeactive, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else {
          toast.update(noti, {
            render: "Hủy kích hoạt dự án thành công",
            type: "success",
            isLoading: false,
          });
          return response.status;
        }
      })
  }

  function activateTool() {
  }*/


  /*var buttonText = "Hủy Kích Hoạt";
  var buttonColor = "danger";
  var buttonFunc = deacticeTool;
  var dis = false;
  if (projectData.project_status == "canceled") {
    buttonColor = "white";
    buttonText = "Kích Hoạt";
    dis = true;
    buttonFunc = activateProject;
  }*/
  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const classes = useStyles();

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
    const urlCategoryUpdate = process.env.REACT_APP_SERVER_URL + `/api/toolcategories/${categoryId}`;
    const noti = toast("Please wait...");
    fetch(urlCategoryUpdate, {
      method: "PUT",
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
            render: "Cập nhật thành công",
            type: "success",
            isLoading: false,
          });
          history.push("/other");
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
  return isLoading ? (
    <div
      style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        right: "50%",
        bottom: "40%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <ReactLoading
        type="spinningBubbles"
        color="#8B0000"
        height={300}
        width={150}
      />
    </div>
  ) : (
    <>
      <div className="navbar">
        <AdminNavbarLinks />
      </div>
      <form id="update-category-form" onSubmit={onSubmit}>
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
                  Thông Tin Công Cụ
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <>
                        <Info> Tên Công cụ</Info>
                        <CustomInput
                          color="primary"
                          id="toolcategory_name"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            multiline: true,
                            rows: 1,
                            defaultValue: categoryData.toolcategory_name,
                          }}
                        />
                      </>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={2}>
                      <>
                        <Info> Chức năng</Info>
                        <CustomInput
                          color="primary"
                          id="description"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            multiline: true,
                            rows: 3,
                            defaultValue: categoryData.description,
                          }}
                        />
                      </>
                    </GridItem>

                    <Button type="submit" color="info">Chỉnh sửa loại công cụ</Button>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </form>
    </>

  );
}