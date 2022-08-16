/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
//import TriggerButton from "components/CustomButtons/TriggerButton";
//import CustomInput from "components/CustomInput/CustomInput";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";
import CardHeader from "components/Card/CardHeader";
//import DropDown from "react-dropdown";
//import Select from "@material-ui/core/Select/SelectInput";
//import { InputLabel } from "@material-ui/core";
//import { MenuItem } from "@material-ui/core";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomInput from "components/CustomInput/CustomInput";
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import Select from "react-dropdown-select";
import axios from "axios";
import DatePicker from "react-datepicker";
import Info from "components/Typography/Info";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";

const useStyles = makeStyles(styles);

export default function CreateTask() {
  const token = localStorage.getItem("token");
  const [user_id, setUserId] = useState();
  const [project_id, setProjectId] = useState();

  const [proName, setProName] = useState();
  const client = useSelector((state) => state.sendNoti);

  const [assigned_user_id, setAssignedId] = useState();

  //const history = useHistory();

  //const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  //const [formError, setFormErrors] = useState({});

  const classes = useStyles();

  const urlUserRequest = process.env.REACT_APP_SERVER_URL + "/api/users";
  const urlProjectRequest = process.env.REACT_APP_SERVER_URL + "/api/projects/";

  var [projectOptions, setProjectOptions] = useState([]);
  var [EmpOptions, setEmpOptions] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  //var [data, setData] = useState([]);

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
      .get(urlProjectRequest, {
        headers: {
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProjectOptions(
          res.data.map((project) => {
            var option = {
              value: project.project_id,
              label: "(" + project.project_code + ") " + project.project_name,
            };
            return option;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    const task_name = event.target.task_name.value;
    const task_description = event.target.task_description.value;
    const dataTask = {
      task_name: task_name,
      user_id: user_id,
      project_id: project_id,
      estimated_date: endDate,
      start_date: startDate,
      task_description: task_description,
    };
    console.log(dataTask);
    console.log(token);
    const urlCreateTask = process.env.REACT_APP_SERVER_URL + "/api/tasks";
    const noti = toast("Please wait...");
    fetch(urlCreateTask, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataTask),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        else {
          toast.update(noti, {
            render: "Tạo mới nhiệm vụ thành công",
            type: "success",
            isLoading: false,
          });
          client.send(
            JSON.stringify({
              type: "noti",
              message: `Bạn sẽ được assign vào dự án ${proName} `,
              assignedId: user_id,
            })
          );
          return response.status;
        }
      })
      .catch((error) => {
        console.log(error);
        document.getElementById("create-task-form").reset();
        toast.update(noti, {
          render: error.toString(),
          type: "error",
          isLoading: false,
        });
      });
  };
  return (
    <form id="create-task-form" onSubmit={onSubmit}>
      <div className="form-group">
        <GridContainer xs={12} sm={12} md={12}>
          <ToastContainer />
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info">Tạo Mới Nhiệm Vụ</CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <Info>Tên nhiệm vụ</Info>
                    <CustomInput
                      color="primary"
                      labelText="Nhập tên nhiệm vụ"
                      id="task_name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        multiline: false,
                        rows: 1,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <Info>Mô tả nhiệm vụ</Info>
                    <CustomInput
                      labelText="Nhập mô tả nhiệm vụ"
                      id="task_description"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 3,
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <Info>Nhân viên</Info>
                    <Select
                      options={EmpOptions}
                      placeholder="Chọn Nhân viên"
                      onChange={(e) => {
                        console.log(e[0].value);
                        setUserId(e[0].value);
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <Info>Dự án</Info>
                    <Select
                      options={projectOptions}
                      placeholder="Chọn Dự án"
                      onChange={(e) => {
                        console.log(e[0].value);
                        setProjectId(e[0].value);
                        setProName(e[0].label);
                      }}
                    />
                  </GridItem>
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
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <Info>Ngày kết thúc </Info>
                    <DatePicker
                      selected={endDate}
                      timeInputLabel="Time:"
                      showTimeInput
                      dateFormat="dd/MM/yyyy h:mm aa"
                      onChange={(date) => {
                        setEndDate(date);
                        console.log(endDate);
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <div className="form-group">
                  <Button
                    className="form-control btn btn-primary"
                    type="submit"
                    color="info"
                  >
                    Tạo
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </form>
  );
}
