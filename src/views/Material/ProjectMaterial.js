/* eslint-disable no-unused-vars */
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
// import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
import ReactLoading from "react-loading";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import Info from "components/Typography/Info";
import { useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

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

export default function ProjectMaterial() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const projectData = location.state.project;
  const [clientName, setClientName] = useState("");
  const [materialList, setMaterialList] = useState([]);
  const [materialIdList, setMaterialIdList] = useState([]);
  const token = localStorage.getItem("token");

  const formatReq = (require) => {
    var result = [];
    if (require != undefined) {
      const requireArr = require.toString().split(",");
      console.log(requireArr);
      result = requireArr;
    }
    return result;
  };

  const convertMaterIDToMater = (materialId) => {
    return materialList.find((e) => e._id == materialId);
  };

  const fetchData = () => {
    const rdToken = process.env.REACT_APP_RD_TOKEN;
    const urlSupplier =
      process.env.REACT_APP_WAREHOUSE +
      `/api/v1/customer/${projectData.client_id}`;
    axios
      .get(urlSupplier, {
        headers: {
          "Conttent-Type": "application/json",
          "rd-token": `${rdToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200) setClientName(res.data.customer.name);
      })
      .catch((error) => {
        console.log(error);
      });

    const urlMaterialRequest =
      process.env.REACT_APP_WAREHOUSE + "/api/v1/material";
    axios
      .get(urlMaterialRequest, {
        headers: {
          "Conttent-Type": "application/json",
          "rd-token": `${rdToken}`,
        },
      })
      .then((res) => {
        console.log(res.data.materialList);
        setMaterialList(res.data.materialList, () => {
          console.log(res.data.materialList);
          console.log(materialList);
        });
      });

    const urlGetMaterialList =
      process.env.REACT_APP_SERVER_URL +
      `/api/materialofphase/projects/${projectData.project_id}`;
    axios
      .get(urlGetMaterialList, {
        headers: {
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setMaterialIdList(res.data);
      });
  };
  console.log(projectData);

  const classes = useStyles();

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      name: "STT",
      selector: (row, index) => convertMaterIDToMater(row).code,
      sortable: true,
      cell: (row, index) => <div>{index}</div>,
    },
    {
      name: "Mã nguyên liệu",
      selector: (row) => convertMaterIDToMater(row).code,
      sortable: true,
      cell: (row) => <div>{convertMaterIDToMater(row).code}</div>,
    },
    {
      name: "Tên nguyên liệu",
      selector: (row) => convertMaterIDToMater(row).name,
      sortable: true,
      cell: (row) => <div>{convertMaterIDToMater(row).name}</div>,
    },
    {
      name: "Tên Inci",
      selector: (row) => convertMaterIDToMater(row).inciName,
      sortable: true,
      cell: (row) => <div>{convertMaterIDToMater(row).inciName}</div>,
    },
  ];
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
      <div className="productDetailInfor">
        <GridContainer>
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardHeader color="info" className={classes.cardTitleWhite}>
                Thông Tin Dự Án
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info>Tên dự án</Info>
                      <b>{projectData.project_name}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <>
                      <Info>Mã dự án</Info>
                      <b>{projectData.project_code}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <>
                      <Info>Khối lượng dự tính</Info>
                      <b>{projectData.estimated_weight} g</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <>
                      <Info>Yêu cầu sản phẩm</Info>
                      {formatReq(projectData.requirement).map((word) => {
                        console.log(word);
                        return (
                          <>
                            <b>{word}</b> <br />
                          </>
                        );
                      })}
                    </>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info>Ngày tạo</Info>
                      <b>
                        {new Date(projectData.created_time).toLocaleDateString(
                          "en-US"
                        )}
                      </b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info>Ngày phải hoàn thành</Info>
                      <b>
                        {new Date(projectData.complete_date).toLocaleDateString(
                          "en-US"
                        )}
                      </b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info>Khách hàng</Info>
                      <b>{clientName}</b>
                    </>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={2}></GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info>Người tạo</Info>
                      <b>{projectData.created_user_name}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info>Nhân viên phụ trách</Info>
                      <b>{projectData.assigned_user_name}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info>Trạng thái</Info>
                      <b>{projectData.project_status}</b>
                    </>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardHeader color="info" className={classes.cardTitleWhite}>
                Danh sách nguyên liệu sử dụng
              </CardHeader>
              <CardBody>
                <DataTable
                  columns={columns}
                  data={materialIdList}
                  subHeader
                  persistTableHead
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </>
  );
}
