/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
// @material-ui/core components
// import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import axios from "axios";
//import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import Button from "components/CustomButtons/Button.js";
//import { useStateWithCallbackLazy } from "use-state-with-callback";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import ReactLoading from "react-loading";
import Info from "components/Typography/Info";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";

export default function TaskDetailStaff() {
  const location = useLocation();
  const taskID = location.state.task_info;
  const user_name = location.state.user_name;
  const project_name = location.state.project_name;
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  var [dataTask, setTaskData] = useState([]);
  const token = localStorage.getItem("token");

  const [locationKeys, setLocationKeys] = useState([]);

  const urlTask = process.env.REACT_APP_SERVER_URL + `/api/tasks/${taskID}`;

  const fetchData = () => {
    axios.get(urlTask, {
      headers: {
        'Conttent-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res.data);
      setTaskData(res.data);
      dataTask = res.data;
      console.log(dataTask);
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
    <div style={{ overflow: "hidden" }}>
      <div className="navbar">
        <AdminNavbarLinks />
      </div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={10}>
          <Card>
            {/* <CardHeader color="primary"> */}
            <CardHeader color="info">
              Thông Tin Công Việc
            </CardHeader>
            {/* </CardHeader> */}
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <Info>Tên Công Việc</Info>
                  <b>{dataTask.task_name}</b>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Info>Trạng thái</Info>
                  <b>{dataTask.task_status}</b>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Info>Nhân Viên</Info>
                  <b>{user_name}</b>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Info>Dự án</Info>
                  <b>{project_name}</b>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Info>Ngày Bắt Đầu</Info>
                  <b>{new Date(dataTask.start_date).toLocaleDateString("en-SG")}</b>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Info>Ngày kết thúc</Info>
                  <b>{new Date(dataTask.estimated_date).toLocaleDateString("en-SG")}</b>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Info>Mô tả Công Việc</Info>
                  <b>{dataTask.name}</b>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};