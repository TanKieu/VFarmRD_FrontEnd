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

const useStyles = makeStyles(styles);

export default function ConflictMaterial() {
  const classes = useStyles();
  const location = useLocation();
  const material_id = location.state.material_id;
  const conflictListJson = location.state.conflictList;
  const materialList = location.state.materialList;
  const token = localStorage.getItem("token");
  const [createStatus, setCreateStatus] = useState(true);
  console.log(material_id);
  const [conflict, setConflict] = useState({
    materialconflict_id: 0,
    material_id: null,
    description: null,
  });
  const [buttonStatus, setButtonStatus] = useState(true);
  const [options, setOptions] = useState([]);
  const [conflictList, setConflictList] = useState([conflict]);
  const [method, setMethod] = useState(createObjectJson);

  const convertConflictList = () => {
    const conflistListtmp = [];
    if (conflictListJson.length != 0) {
      setCreateStatus(false);
      conflictListJson.map((conflict) => {
        const object = {
          materialconflict_id: conflict.materialconflict_id,
          material_id: conflict.second_material_id,
          description: conflict.description,
        };
        conflistListtmp.push(object);
      });
      console.log(conflistListtmp);
      return conflistListtmp;
    } else {
      return [conflict];
    }
  };

  const createOption = () => {
    const optionList = [];
    materialList.forEach((material) => {
      if (material._id != material_id) {
        var option = {
          value: material,
          label:
            material.name +
            "(" +
            material.code +
            ")" +
            "( " +
            material.inciName +
            ")",
        };
        optionList.push(option);
      }
    });
    return optionList;
  };
  useEffect(() => {
    setOptions(createOption());
    setConflictList(convertConflictList());
  }, []);
  const handleInputChange = (e, inputName, index) => {
    console.log(e);
    const list = [...conflictList];
    list[index][inputName] = e.target.value;
    setConflictList(list);
  };
  const handleRemoveClick = (index) => {
    const list = [...conflictList];
    list.splice(index, 1);
    console.log(list);
    setConflictList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setConflictList([
      ...conflictList,
      { materialconflict_id: 0, material_id: null, description: "" },
    ]);
  };

  const createObjectJson = () => {
    const obj = [];
    conflictList.map((conflict) => {
      if (conflict.material_id != null) {
        const conflictData = {
          first_material_id: material_id,
          second_material_id: conflict.material_id,
          description: conflict.description,
        };
        obj.push(conflictData);
      }
    });
    console.log(obj);
    return obj;
  };

  const updateObjectJson = () => {
    const obj = [];
    conflictList.map((conflict) => {
      if (conflict.material_id != null) {
        const conflictData = {
          materialconflict_id: conflict.materialconflict_id,
          first_material_id: material_id,
          second_material_id: conflict.material_id,
          description: conflict.description,
        };
        obj.push(conflictData);
      }
    });
    console.log(obj);
    return obj;
  };
  const checkMaterial = (material_id) => {
    var result = true;
    const material = conflictList.find((conflict) => {
      return conflict.material_id == material_id;
    });
    console.log(material);
    if (material != undefined) {
      result = false;
      toast.error("Đã tồn tại chất trong danh sách");
      setButtonStatus(false);
    } else {
      setButtonStatus(true);
    }
    return result;
  };

  const createConflict = () => {
    const obj = createObjectJson();
    if (obj.length == 0) {
      toast.error("Danh sách đang trống");
    } else {
      const noti = toast("Vui lòng đợi ...");
      const createConflictUrl =
        process.env.REACT_APP_SERVER_URL + "/api/materialconflicts";
      fetch(createConflictUrl, {
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
              render: "Tạo xung đột thành công",
              type: "success",
            });
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

  const updateConflict = () => {
    const obj = updateObjectJson();
    if (obj.length == 0) {
      toast.error("Danh sách đang trống");
    } else {
      const noti = toast("Vui lòng đợi ...");
      const createConflictUrl =
        process.env.REACT_APP_SERVER_URL + "/api/materialconflicts/";
      fetch(createConflictUrl, {
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
              render: "Cập nhật xung đột thành công",
              type: "success",
            });
            setTimeout(() => {
              history.back();
            }, 500);
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
  return (
    <div style={{ marginLeft: "5%", marginRight: "5%", minHeight: "800px" }}>
      <ToastContainer />
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="info" className={classes.cardTitleWhite}>
              Danh sách các chất xung đột
            </CardHeader>
            <CardBody>
              {conflictList.map((conflict, i) => {
                console.log(conflict);
                return (
                  <>
                    {createStatus == true && (
                      <>
                        <GridContainer>
                          <GridItem xs={6} sm={6} md={4}>
                            <div style={{ paddingTop: "40px" }}>
                              <Select
                                placeholder="Nguyên liệu"
                                options={options}
                                onChange={(e) => {
                                  conflictList[i].material_id = null;
                                  if (e[0] != undefined) {
                                    if (checkMaterial(e[0].value._id) == true) {
                                      conflictList[i].material_id =
                                        e[0].value._id;
                                    } else {
                                      conflictList[i].material_id = null;
                                    }
                                  }
                                }}
                              />
                            </div>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={4}>
                            <CustomInput
                              inputProps={{
                                placeholder: "Mô tả xung đột",
                                value: conflict.description,
                                onChange: (e) =>
                                  handleInputChange(e, "description", i),
                              }}
                              formControlProps={{
                                fullWidth: true,
                              }}
                            />
                          </GridItem>
                          <div className="btn-box" style={{ marginTop: "3%" }}>
                            {conflictList.length !== 1 && (
                              <Button
                                className="mr10"
                                onClick={() => handleRemoveClick(i)}
                              >
                                Xóa
                              </Button>
                            )}
                          </div>
                        </GridContainer>
                        <div className="btn-box" style={{ margin: "3%" }}>
                          {conflictList.length - 1 === i && (
                            <GridItem xs={12} sm={12} md={2}>
                              <Button className="mr10" onClick={handleAddClick}>
                                Thêm
                              </Button>
                            </GridItem>
                          )}
                        </div>
                      </>
                    )}
                    {createStatus == false && (
                      <>
                        <GridContainer>
                          <GridItem xs={6} sm={6} md={4}>
                            <div style={{ paddingTop: "40px" }}>
                              {conflict.material_id != null ? (
                                <Select
                                  placeholder="Nguyên liệu"
                                  options={options}
                                  values={[
                                    options.find((opt) => {
                                      return (
                                        opt.value._id === conflict.material_id
                                      );
                                    }),
                                  ]}
                                  onChange={(e) => {
                                    conflictList[i].material_id = null;
                                    if (e[0] != undefined) {
                                      if (
                                        checkMaterial(e[0].value._id) == true
                                      ) {
                                        conflictList[i].material_id =
                                          e[0].value._id;
                                      } else {
                                        conflictList[i].material_id = null;
                                      }
                                    }
                                  }}
                                />
                              ) : (
                                <Select
                                  placeholder="Nguyên liệu"
                                  options={options}
                                  onChange={(e) => {
                                    conflictList[i].material_id = null;
                                    if (e[0] != undefined) {
                                      if (
                                        checkMaterial(e[0].value._id) == true
                                      ) {
                                        conflictList[i].material_id =
                                          e[0].value._id;
                                      } else {
                                        conflictList[i].material_id = null;
                                      }
                                    }
                                  }}
                                />
                              )}
                            </div>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={4}>
                            <CustomInput
                              inputProps={{
                                placeholder: "Mô tả xung đột",
                                value: conflict.description,
                                onChange: (e) =>
                                  handleInputChange(e, "description", i),
                              }}
                              formControlProps={{
                                fullWidth: true,
                              }}
                            />
                          </GridItem>
                          <div className="btn-box" style={{ marginTop: "3%" }}>
                            {conflictList.length !== 1 && (
                              <Button
                                className="mr10"
                                onClick={() => handleRemoveClick(i)}
                                color="danger"
                              >
                                Xóa
                              </Button>
                            )}
                          </div>
                        </GridContainer>
                        <div className="btn-box" style={{ margin: "3%" }}>
                          {conflictList.length - 1 === i && (
                            <GridItem xs={12} sm={12} md={2}>
                              <Button
                                className="mr10"
                                onClick={handleAddClick}
                                color="info"
                              >
                                Thêm
                              </Button>
                            </GridItem>
                          )}
                        </div>
                      </>
                    )}
                  </>
                );
              })}
            </CardBody>
          </Card>
        </GridItem>
        <div>
          <GridItem>
            {createStatus == true ? (
              <Button
                type="button"
                color="info"
                disabled={!buttonStatus}
                onClick={createConflict}
              >
                Tạo
              </Button>
            ) : (
              <Button
                type="button"
                color="info"
                disabled={!buttonStatus}
                onClick={updateConflict}
              >
                Lưu
              </Button>
            )}
            ;
          </GridItem>
        </div>
      </GridContainer>
    </div>
  );
}
