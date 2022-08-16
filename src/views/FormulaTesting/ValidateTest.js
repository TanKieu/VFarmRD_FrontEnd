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
import { isForOfStatement } from "typescript";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
import ButtonBack from "components/ButtonBack";

const useStyles = makeStyles(styles);

export default function ValidateTest() {
  const classes = useStyles();
  const location = useLocation();
  const forumulaId = location.state.formula_id;
  const token = localStorage.getItem("token");
  const createTestURL = " ";
  const createFileURL = process.env.REACT_APP_SERVER_URL + `/api/files/upload`;
  console.log(forumulaId);
  const [testTask, setTestTask] = useState(location.state.testTask);

  const createObjectJson = () => {
    const listTestCreateValues = [];
    testTask.map((test) => {
      const testDetail = {
        test_id: test.test_id,
        test_content: test.content,
        test_expect: test.expected,
        test_result: false,
        object_type: test.object_type,
        fileResponse: test.fileResponse,
      };
      listTestCreateValues.push(testDetail);
    });
    const obj = {
      formula_id: forumulaId,
      listTestCreateValues: listTestCreateValues,
    };
    console.log(obj);
    return obj;
  };

  const createJson = () => {
    const listTestCase = [];
    testTask.map((test) => {
      var file_id = null;
      if (test.file_id != undefined) file_id = test.file_id;
      console.log(file_id);
      const testDetail = {
        test_content: test.content,
        test_expect: test.expected,
        test_result: false,
        file_id: file_id,
      };
      listTestCase.push(testDetail);
    });
    return listTestCase;
  };

  const uploadFile = (test) => {
    const url = createFileURL;
    var dataForm = new FormData();
    dataForm.append("file", test.file[0]);
    dataForm.append("object_type", test.object_type);
    dataForm.append("object_id", test.test_id);
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: dataForm,
    })
      .then((response) => {
        response.json();
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        return true;
      });
  };

  const handleSubmit = () => {
    var listJsonObject = [];
    var checkError = false;
    var error = false;
    const noti = toast("Đang xử lí dữ liệu...");
    testTask.forEach((test) => {
      if (test.file != undefined) {
        checkError = uploadFile(test);
      }
      const testJson = {
        test_content: test.test_content,
        test_expect: test.test_expect,
        test_result: test.test_result,
      };
      console.log(JSON.stringify(testJson));
      const updateTestUrl =
        process.env.REACT_APP_SERVER_URL + `/api/tests/${test.test_id}`;
      fetch(updateTestUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(testJson),
      })
        .then((response) => {
          if (response.status != 200) {
            error = true;
            throw new Error(response.status);
          } else {
            toast.update(noti, {
              render: "Cập nhật đánh giá thành công",
              type: "success",
            });
            console.log(response);
          }
        })
        .catch((error) => {
          checkError = true;
          toast.update(noti, {
            render: "Đã có lỗi xảy ra, vui lòng thử lại sau !",
            type: "error",
            isLoading: false,
          });
          console.log(error);
        });
    });
  };

  const handleCheck = (index) => {
    const list = [...testTask];
    if (list[index].test_result == false) {
      list[index].test_result = true;
    } else {
      list[index].test_result = false;
    }
    setTestTask(list);
  };

  const handleSelectFile = (e, index) => {
    const list = [...testTask];
    list[index].file = e.target.files;
    setTestTask(list);
  };

  // const createTest = () => {
  //   const obj = createObjectJson();
  //   const noti = toast("Vui lòng đợi ...");
  //   fetch(createTestURL, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify(obj),
  //   })
  //     .then((response) => {
  //       if (!response.ok) throw new Error(response.status);
  //       else {
  //         toast.update(noti, {
  //           render: "Tạo tiêu chuẩn thành công",
  //           type: "success",
  //         });
  //         return response.status;
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       toast.update(noti, {
  //         render: error.toString(),
  //         type: "error",
  //         isLoading: true,
  //       });
  //     });
  // };
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
                <GridContainer>
                  <GridItem xs={6} sm={6} md={3}>
                    <Info>
                      <b>Nội dung</b>
                    </Info>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={3}>
                    <Info>
                      <b>Kì vọng </b>
                    </Info>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={3}>
                    <Info>
                      <b>Kết quả</b>
                    </Info>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={3}>
                    <Info>
                      <b>Chứng chỉ</b>
                    </Info>
                  </GridItem>
                </GridContainer>
                {testTask.map((task, i) => {
                  console.log(testTask);
                  return (
                    <>
                      <GridContainer>
                        <GridItem xs={6} sm={6} md={3}>
                          <Info>{task.test_content}</Info>
                        </GridItem>
                        <GridItem xs={6} sm={6} md={3}>
                          <Info>{task.test_expect}</Info>
                        </GridItem>
                        <GridItem xs={6} sm={6} md={3}>
                          <input
                            type="checkbox"
                            name="status"
                            value="Đạt chuẩn"
                            checked={task.test_result == true}
                            onChange={() => handleCheck(i)}
                          />
                          Đạt chuẩn
                        </GridItem>
                        <GridItem xs={6} sm={6} md={3}>
                          {task.fileResponse != null ? (
                            <>
                              <input
                                type="file"
                                onChange={(e) => handleSelectFile(e, i)}
                              />
                              <div>
                                <a
                                  href={task.fileResponse.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {task.fileResponse.name}
                                </a>
                              </div>
                            </>
                          ) : (
                            <input
                              type="file"
                              onChange={(e) => handleSelectFile(e, i)}
                            />
                          )}
                        </GridItem>
                      </GridContainer>
                    </>
                  );
                })}
              </CardBody>
            </Card>
          </GridItem>
          <div>
            <GridItem>
              <Button
                type="button"
                color="info"
                onClick={() => {
                  handleSubmit();
                  setTimeout(() => {
                    history.back();
                  }, 4000);
                }}
              >
                Hoàn tất
              </Button>
            </GridItem>
          </div>
        </GridContainer>
      </div>
    </>
  );
}
