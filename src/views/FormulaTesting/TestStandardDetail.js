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
import axios from "axios";
import ReactLoading from "react-loading";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
import ButtonBack from "components/ButtonBack";

const useStyles = makeStyles(styles);

export default function TestStandardDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const location = useLocation();
  const standard = location.state.standard;
  const token = localStorage.getItem("token");
  const [test, setTest] = useState({
    teststandardset_id: standard.teststandardset_id,
    teststandard_name: null,
    description: null,
    teststandard_id: 0,
  });
  const [testTask, setTestTask] = useState([test]);
  const [btnUpdateStatus, setbtnUpdateStatus] = useState(false);

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
    setTestTask([
      ...testTask,
      {
        teststandard_name: null,
        description: null,
        teststandard_id: 0,
        teststandardset_id: standard.teststandardset_id,
      },
    ]);
  };

  const createObjectJson = () => {
    const testStandardRequest = [];
    testTask.map((test) => {
      if (test.teststandard_name != null) {
        const testDetail = {
          teststandardset_id: test.teststandardset_id,
          teststandard_name: test.teststandard_name,
          teststandard_id: test.teststandard_id,
          description: test.description,
        };
        testStandardRequest.push(testDetail);
      }
    });
    const obj = {
      teststandardset_name: document.getElementById("testStandardName").value,
      description: document.getElementById("testStandardDescrip").value,
      testStandard: testStandardRequest,
    };
    console.log(obj);
    return obj;
  };
  const checkTest = () => {
    var result = true;
    if (testTask.length == 1) {
      if (testTask[0].eststandard_name == null) result = false;
    } else if (testTask.length == 0) {
      result = false;
    }
    return result;
  };
  const fetchData = () => {
    const urlStandardData =
      process.env.REACT_APP_SERVER_URL +
      `/api/teststandardsets/${test.teststandardset_id}`;
    axios
      .get(urlStandardData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const testList = [];
        res.data.testStandard.map((standard) => {
          var test = {
            teststandard_id: standard.teststandard_id,
            teststandardset_id: standard.teststandardset_id,
            teststandard_name: standard.teststandard_name,
            description: standard.description,
          };
          testList.push(test);
        });
        setTestTask(testList);
      })
      .catch((error) => {
        console.log(error);
      });
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const updateTestStandard = () => {
    if (checkTest() == false) {
      const noti = toast.error("Tiêu chuẩn không hợp lệ!");
    } else {
      const noti = toast("Vui lòng đợi ...");
      const obj = createObjectJson();
      const createTestURL =
        process.env.REACT_APP_SERVER_URL +
        `/api/teststandardsets/${standard.teststandardset_id}`;
      fetch(createTestURL, {
        method: "PUT",
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
              render: "Cập nhật tiêu chuẩn thành công",
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
  useEffect(() => {
    fetchData();
  }, []);
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
                <GridItem>
                  <Button
                    type="button"
                    color="info"
                    onClick={() => {
                      setbtnUpdateStatus(true);
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                </GridItem>
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
                        defaultValue: standard.teststandardset_name,
                        multiline: false,
                        rows: 1,
                        readOnly: !btnUpdateStatus,
                        onChange: (e) => {
                          standard.teststandardset_name = e.target.value;
                        },
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
                        defaultValue: standard.description,
                        multiline: true,
                        readOnly: !btnUpdateStatus,
                        rows: 3,
                        onChange: (e) => {
                          standard.description = e.target.value;
                          console.log(test);
                        },
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
                        <div style={{}}>
                          <GridContainer>
                            <GridItem xs={6} sm={6} md={4}>
                              <CustomInput
                                inputProps={{
                                  placeholder: "Tên tiêu chuẩn",
                                  value: task.teststandard_name,
                                  readOnly: !btnUpdateStatus,
                                  onChange: (e) =>
                                    handleInputChange(
                                      e,
                                      "teststandard_name",
                                      i
                                    ),
                                }}
                                formControlProps={{
                                  fullWidth: true,
                                }}
                              />
                            </GridItem>
                            <GridItem xs={6} sm={6} md={4}>
                              <CustomInput
                                inputProps={{
                                  placeholder: "Kì vọng",
                                  value: task.description,
                                  readOnly: !btnUpdateStatus,
                                  onChange: (e) =>
                                    handleInputChange(e, "description", i),
                                }}
                                formControlProps={{
                                  fullWidth: true,
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
                                  disabled={!btnUpdateStatus}
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
                                  disabled={!btnUpdateStatus}
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
              <Button
                type="button"
                color="info"
                onClick={updateTestStandard}
                disabled={!btnUpdateStatus}
              >
                Cập nhật
              </Button>
            </GridItem>
          </div>
        </GridContainer>
      </div>
    </>
  );
}
