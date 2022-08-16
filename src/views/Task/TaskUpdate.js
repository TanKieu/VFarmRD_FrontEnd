/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
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
//import AddProduct from "./AddProduct";
//import DataTable from "react-data-table-component";
//import FilterComponent from "components/Filter/FilterComponent";
//import { useHistory } from "react-router-dom";
import Select from "react-dropdown-select";
import axios from "axios";
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import { useEffect } from "react";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import { toast, ToastContainer } from "react-toastify";
import Info from "components/Typography/Info";
import ReactLoading from "react-loading";


const useStyles = makeStyles(styles);


export default function TaskUpdate() {

  const [locationKeys, setLocationKeys] = useState([]);
  const [disable, setDisabled] = useState(true);
  const history = useHistory();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  const [user_id, setUserId] = useState();
  const [project_id, setProjectId] = useState();
  const [formula_id, setFormulaId] = useState();

  // const [compon, setCompon] = useState("");
  const location = useLocation();
  const token = localStorage.getItem("token");
  const taskId = location.state.taskID;
  const urlTask = process.env.REACT_APP_SERVER_URL + "/api/tasks";
  const urlUserRequest = process.env.REACT_APP_SERVER_URL + "/api/users";
  const urlProjectRequest = process.env.REACT_APP_SERVER_URL + "/api/projects/";
  const urlFormulaRequest = process.env.REACT_APP_SERVER_URL +
    `/api/formulas`;
  var [dataTask, setTaskData] = useState([]);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  //const [status, setStatus] = useState();

  //var emp = new String();

  var [EmpOptions, setEmpOptions] = useState([]);
  var [ProOptions, setProOptions] = useState([]);
  var [ForOptions, setForOptions] = useState([]);


  const fetchData = () => {
    axios
      .get(urlUserRequest, {
        headers: {
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEmpOptions(
          res.data.map((emp) => {
            var option = {
              value: emp.user_id,
              label: emp.fullname + " (" + emp.email + " )",
            };
            return option;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(urlProjectRequest + "?created_user_id=" + userId, {
        headers: {
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setProOptions(
          res.data.map((pro) => {
            var prooption = {
              value: pro.project_id,
              label: "[" + pro.project_code + "] " + pro.project_name,
            };
            return prooption;
          }),
        );
      })
      .catch((error) => {
        console.log(error);
      });
    axios.get(urlTask + "/" + taskId, {
      headers: {
        'Conttent-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res.data);
      setTaskData(res.data);
      dataTask = res.data;
      console.log(dataTask);
      setUserId(dataTask.user_id);
      setProjectId(dataTask.project_id);
      //setStatus(dataTask.task_status);
      const esti = dataTask.estimated_date;
      const cre = dataTask.created_date;
      const end = new Date(esti.slice(0, -6));
      const start = new Date(cre.slice(0, -6));
      setStartDate(start);
      setEndDate(end);
      console.log(endDate);
    })
      .catch((error) => {
        console.log(error);
      });
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  useEffect(() => {
    fetchData();
    //checkStatus();
    return history.listen(location => {
      console.log(location);
      if (history.action === 'PUSH') {
        setLocationKeys([location.key])
      }

      if (history.action === 'POP') {
        if (locationKeys[1] === location.key) {
          // eslint-disable-next-line no-unused-vars
          setLocationKeys(([_, ...keys]) => keys)

          // Handle forward event

        } else {
          setLocationKeys((keys) => [location.key, ...keys])

          window.location.reload();
          history.push("/admin/task");

        }
      }
    })
  }, [locationKeys,]);

  const onClickUpdate = () => {
    setDisabled(false);
  }

  const OnChangeProject = (e) => {
    console.log(e[0].value);
    setProjectId(e[0].value);
    axios.get(urlFormulaRequest + "?project_id= " + project_id + "&formula_status=on20%process", {
      headers: {
        "Conttent-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        setForOptions(
          res.data.map((formula) => {
            var option = {
              value: formula.formula_id,
              label: formula.formula_version + " (" + formula.formula_status + " )",
            };
            return option;
          }),
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const task_name = e.target.task_name.value;
    const description = e.target.description.value;
    const task_status = "doing";
    const estimated_date = endDate;
    const start_date = startDate;
    const dataTask = {
      task_name,
      description,
      user_id,
      task_status,
      estimated_date,
      start_date,
    }
    console.log(dataTask);
    const urlUpdateTask = process.env.REACT_APP_SERVER_URL + "/api/tasks/" + taskId;
    const notiUpdate = toast("Please wait ...");
    fetch(urlUpdateTask, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataTask),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else {
          toast.update(notiUpdate, {
            render: "Cập nhật thành công",
            type: "success",
            isLoading: false,
          });
          return response.status;
        }
      })
      .catch((error) => {
        console.log(error);
        toast.update(notiUpdate, {
          render: error.toString(),
          type: "error",
          isLoading: false,
        });
      });
  };
  window.onhashchange = function () {
    window.history.back();
  }
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
    <form id="update-task-form" onSubmit={onSubmit}>
      <ToastContainer />
      <GridContainer xs={12} sm={12} md={12}>
        <ToastContainer />
        <GridItem xs={12} sm={12} md={10}>
          <Card>
            <CardHeader color="info" className={classes.cardTitleWhite} >
              Công việc
            </CardHeader>
            <CardBody className={classes.cardTitleWhite}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <Info>Tên nhiệm vụ</Info>
                  <CustomInput
                    disabled={disable}
                    color="primary"
                    id="task_name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 1,
                      defaultValue: dataTask.task_name,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <Info>Mô tả nhiệm vụ</Info>
                  <CustomInput
                    disabled={disable}
                    color="primary"
                    id="description"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 3,
                      defaultValue: dataTask.description,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <Info>Nhân Viên</Info>
                  <b>{user_id}</b>
                  <Select
                    disabled={disable}
                    options={EmpOptions}
                    placeholder="Chọn nhân viên"
                    onChange={(e) => {
                      console.log(e[0].value);
                      setUserId(e[0].value);
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <Info>Dự án</Info>
                  <b>{project_id}</b>
                  <Select
                    disabled={disable}
                    options={ProOptions}
                    placeholder="Chọn Dự án"
                    onChange={OnChangeProject}
                  />
                </GridItem>
                {/*<GridItem xs={12} sm={12} md={3}>
                  <label>Công thức</label>
                  <CustomInput
                    color="primary"
                    id="formular_id"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 1,
                      value: formula_id,
                    }}
                  />
                  <Select
                    disabled={disable}
                    options={ForOptions}
                    placeholder="Chọn công thức"
                    onChange={(e) => {
                      console.log(e[0].value);
                      setFormulaId(e[0].value);
                    }}
                  />
                  </GridItem>*/}
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <Info>Ngày Bắt Đầu</Info>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    timeInputLabel="Time:"
                    showTimeInput
                    dateFormat="dd/MM/yyyy h:mm aa"
                    disabled={disable}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <Info>Ngày kết thúc</Info>
                  <DatePicker
                    selected={endDate}
                    timeInputLabel="Time:"
                    showTimeInput
                    dateFormat="dd/MM/yyyy h:mm aa"
                    onChange={(date) => setEndDate(date)}
                    disabled={disable}
                  />
                </GridItem>
              </GridContainer>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <Button type="button" color="info" onClick={onClickUpdate}>
                  Sửa nhiệm vụ
                </Button>
                <Button type="submit" color="info" onSubmit={onSubmit} disabled={disable}>
                  Lưu thay đổi nhiệm vụ
                </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </form>
  );

}
