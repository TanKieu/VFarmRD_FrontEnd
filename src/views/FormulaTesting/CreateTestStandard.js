/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import CardHeader from "components/Card/CardHeader";
import Card from "components/Card/Card.js";
import { useLocation } from "react-router-dom";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import CardBody from "components/Card/CardBody";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput";
import { Tooltip } from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import { Add, PermPhoneMsg } from "@material-ui/icons";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Info from "components/Typography/Info";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
import ButtonBack from "components/ButtonBack";

const useStyles = makeStyles(styles);

export default function CreateTestStandard() {
  const classes = useStyles();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const createTestURL =
    process.env.REACT_APP_SERVER_URL + "/api/teststandardsets";
  const [test, setTest] = useState({
    teststandard_name: null,
    description: null,
  });
  const [testTask, setTestTask] = useState([test]);

  const handleInputChange = (e, inputName, index) => {
    const list = [...testTask];
    list[index][inputName] = e.target.value;
    setTestTask(list);
  };
  const handleRemoveClick = (index) => {
    const list = [...testTask];
    list.splice(index, 1);
    setTestTask(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setTestTask([...testTask, { teststandard_name: null, description: null }]);
  };

  const createObjectJson = () => {
    const testStandardRequest = [];
    console.log(testTask);
    testTask.map((test) => {
      if (test.teststandard_name != null) {
        const testDetail = {
          teststandard_name: test.teststandard_name,
          description: test.description,
        };
        testStandardRequest.push(testDetail);
      }
    });
    const obj = {
      teststandardset_name: document.getElementById("testStandardName").value,
      description: document.getElementById("testStandardDescrip").value,
      testStandardRequest,
    };
    console.log(obj);
    return obj;
  };
  const checkTest = () => {
    var result = true;
    console.log(testTask.length);
    if (testTask.length == 1) {
      console.log(testTask);
      if (testTask[0].teststandard_name == null) result = false;
    } else if (testTask.length == 0) {
      result = false;
    }
    return result;
  };

  const createTestStandard = () => {
    if (checkTest() == false) {
      const noti = toast.error("Tiêu chuẩn không hợp lệ!");
    } else {
      const noti = toast("Vui lòng đợi ...");
      const obj = createObjectJson();
      fetch(createTestURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      })
        .then((response) => {
          if (!response.ok) throw new Error(response.status);
          else {
            toast.update(noti, {
              render: "Tạo tiêu chuẩn thành công",
              type: "success",
            });
            setTimeout(() => {
              history.back();
            }, 2000);
            return response.status;
          }
        })
        .catch((error) => {
          console.log(error);
          toast.update(noti, {
            render: error.toString(),
            type: "error",
            isLoading: true,
          });
        });
    }
  };
  useEffect(() => {}, []);
  return (
    <>
      <div className="navbar1">
        <AdminNavbarLinks />
      </div>
      <ButtonBack />
      <div style={{ marginRight: "5%", marginLeft: "5%", paddingTop: "70px" }}>
        <ToastContainer />
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info" className={classes.cardTitleWhite}>
                Tiêu chuẩn kiểm tra chất lượng
              </CardHeader>
              <div style={{ marginTop: "10px" }}>
                <GridItem xs={10} sm={10} md={12}>
                  <GridItem>
                    <CustomInput
                      color="primary"
                      labelText="Tên bộ tiêu chuẩn"
                      id="testStandardName"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        multiline: false,
                        rows: 1,
                      }}
                    />
                  </GridItem>
                  <GridItem>
                    <CustomInput
                      color="primary"
                      labelText="Mô tả"
                      id="testStandardDescrip"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 3,
                      }}
                    />
                  </GridItem>
                </GridItem>
                <GridContainer>
                  <GridItem xs={10} sm={10} md={12}>
                    <h4 style={{ textAlign: "center" }}>
                      <Info>
                        <b style={{ fontSize: "20px" }}>Danh sách tiêu chuẩn</b>
                      </Info>
                    </h4>
                  </GridItem>
                </GridContainer>
                <CardBody>
                  {testTask.map((task, i) => {
                    return (
                      <>
                        <div style={{ paddingLeft: "15%" }}>
                          <GridContainer>
                            <GridItem xs={6} sm={6} md={4}>
                              <CustomInput
                                inputProps={{
                                  placeholder: "Tên tiêu chuẩn",
                                }}
                                formControlProps={{
                                  fullWidth: true,
                                  onChange: (e) =>
                                    handleInputChange(
                                      e,
                                      "teststandard_name",
                                      i
                                    ),
                                }}
                              />
                            </GridItem>
                            <GridItem xs={6} sm={6} md={4}>
                              <CustomInput
                                inputProps={{
                                  placeholder: "Kì vọng",
                                }}
                                formControlProps={{
                                  fullWidth: true,
                                  onChange: (e) =>
                                    handleInputChange(e, "description", i),
                                }}
                              />
                            </GridItem>
                            <div
                              className="btn-box"
                              style={{ marginTop: "3%" }}
                            >
                              {testTask.length !== 1 && (
                                <Button
                                  color="danger"
                                  className="mr10"
                                  onClick={() => handleRemoveClick(i)}
                                >
                                  Xóa
                                </Button>
                              )}
                            </div>
                          </GridContainer>
                          <div className="btn-box" style={{ margin: "3%" }}>
                            {testTask.length - 1 === i && (
                              <GridItem xs={12} sm={12} md={2}>
                                <Button
                                  color="info"
                                  className="mr10"
                                  onClick={() => handleAddClick()}
                                >
                                  Thêm
                                </Button>
                              </GridItem>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })}
                </CardBody>
              </div>
            </Card>
          </GridItem>
          <div>
            <GridItem>
              <Button type="button" color="info" onClick={createTestStandard}>
                Tạo bộ tiêu chuẩn
              </Button>
            </GridItem>
          </div>
        </GridContainer>
      </div>
    </>
  );
}
