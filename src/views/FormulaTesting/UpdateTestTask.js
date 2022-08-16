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
import Select from "react-dropdown-select";
import axios from "axios";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
import ButtonBack from "components/ButtonBack";

const useStyles = makeStyles(styles);

export default function UpdateTestTask() {
  const classes = useStyles();
  const location = useLocation();
  const forumulaId = location.state.formula_id;
  const [standardOptions, setStandardOption] = useState([]);
  const token = localStorage.getItem("token");
  console.log(forumulaId);
  // const [test, setTest] = useState({
  //   test_id: 0,
  //   test_content: null,
  //   test_expect: null,
  // });
  const [testTask, setTestTask] = useState(location.state.testTask);
  console.log(testTask);

  //   const fetchData = () => {
  //     const urlStandard =
  //       process.env.REACT_APP_SERVER_URL + "/api/teststandardsets";
  //     axios
  //       .get(urlStandard, {
  //         headers: {
  //           "Conttent-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((res) => {
  //         setStandardOption(
  //           res.data.map((standard) => {
  //             var option = {
  //               value: standard.teststandardset_id,
  //               label:
  //                 standard.teststandardset_name +
  //                 " Mô tả: " +
  //                 standard.description,
  //             };
  //             return option;
  //           })
  //         );
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  //   const getStandardContent = (standardId) => {
  //     const urlStandard =
  //       process.env.REACT_APP_SERVER_URL + `/api/teststandardsets/${standardId}`;
  //     axios
  //       .get(urlStandard, {
  //         headers: {
  //           "Conttent-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((res) => {
  //         const testList = [];
  //         res.data.testStandard.map((standard) => {
  //           var test = {
  //             content: standard.teststandard_name,
  //             expected: standard.description,
  //           };
  //           testList.push(test);
  //         });
  //         console.log(testList);
  //         setTestTask(testList);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  //   const handleStandardSelect = (e) => {
  //     console.log(e[0].value);
  //     const id = e[0].value;
  //     getStandardContent(id);
  //   };

  const handleInputChange = (e, inputName, index) => {
    console.log(e);
    const list = [...testTask];
    list[index][inputName] = e.target.value;
    setTestTask(list);
  };
  const handleRemoveClick = (index) => {
    const list = [...testTask];
    list.splice(index, 1);
    console.log(list);
    setTestTask(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setTestTask([
      ...testTask,
      { test_content: null, test_expect: null, test_id: 0 },
    ]);
  };

  useEffect(() => {}, []);

  const createObjectJson = () => {
    const listTestCreateValues = [];
    testTask.map((test) => {
      if (test.test_content != null) {
        const testDetail = {
          test_id: test.test_id,
          test_content: test.test_content,
          test_expect: test.test_expect,
          test_result: false,
        };
        listTestCreateValues.push(testDetail);
      }
    });
    console.log(listTestCreateValues);
    return listTestCreateValues;
  };
  const checkTest = () => {
    var result = true;
    if (testTask.length == 1) {
      if (testTask[0].test_content == null) result = false;
    } else if (testTask.length == 0) {
      result = false;
    }
    return result;
  };

  const updateTest = () => {
    const createTestURL =
      process.env.REACT_APP_SERVER_URL + `/api/tests/formulas/${forumulaId}`;
    if (checkTest() == false) {
      const noti = toast.error("Tiêu chuẩn không hợp lệ!");
    } else {
      const noti = toast("Vui lòng đợi ...");
      const obj = createObjectJson();
      console.log(JSON.stringify(obj));
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
  useEffect(() => {}, []);
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
          marginTop: "3%",
          minHeight: "800px",
          position: "absolute",
          width: "85%",
        }}
      >
        <ToastContainer />
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info" className={classes.cardTitleWhite}>
                Tiêu chuẩn kiểm tra chất lượng
              </CardHeader>
              <CardBody>
                {testTask.map((task, i) => {
                  return (
                    <>
                      <GridContainer>
                        <GridItem xs={6} sm={6} md={4}>
                          <CustomInput
                            inputProps={{
                              placeholder: "Tên tiêu chuẩn",
                              value: task.test_content,
                              onChange: (e) =>
                                handleInputChange(e, "test_content", i),
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
                              value: task.test_expect,
                              onChange: (e) =>
                                handleInputChange(e, "test_expect", i),
                            }}
                            formControlProps={{
                              fullWidth: true,
                            }}
                          />
                        </GridItem>
                        <div className="btn-box" style={{ marginTop: "3%" }}>
                          {testTask.length !== 1 && (
                            <button
                              className="mr10"
                              onClick={() => handleRemoveClick(i)}
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                        <div className="btn-box" style={{ margin: "3%" }}>
                          {testTask.length - 1 === i && (
                            <GridItem xs={12} sm={12} md={2}>
                              <button
                                className="mr10"
                                onClick={() => handleAddClick()}
                              >
                                Thêm
                              </button>
                            </GridItem>
                          )}
                        </div>
                      </GridContainer>
                    </>
                  );
                })}
              </CardBody>
            </Card>
          </GridItem>
          <div>
            <GridItem>
              <Button type="button" color="info" onClick={updateTest}>
                Cập nhật tiêu chuẩn
              </Button>
            </GridItem>
          </div>
        </GridContainer>
      </div>
    </>
  );
}
