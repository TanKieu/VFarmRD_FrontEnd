/* eslint-disable prettier/prettier */
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
import DataTable from "react-data-table-component";
import { useState } from "react";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Info from "components/Typography/Info";
import { toast, ToastContainer } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
import ReactLoading from "react-loading";
import ButtonBack from "components/ButtonBack";


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
export default function ProjectDetail() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const role = JSON.parse(localStorage.getItem("role"));
  const projectId = location.state.project_info;
  const [projectData, setProjectData] = useStateWithCallbackLazy("");
  const [clientName, setClientName] = useState("");
  const [data, setData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [createForbtn, setCreateForbtn] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [buttonCreateFormulaStatus, setButtonCreateFormulaStatus] = useStateWithCallbackLazy(true);
  console.log(projectId);
  const urlProduct = process.env.REACT_APP_SERVER_URL + `/api/projects/${projectId}`
  const urlGetFormula = process.env.REACT_APP_SERVER_URL + `/api/formulas?project_id=${projectId}`
  const fetchData = () => {
    axios.get(urlProduct, {
      headers: {
        "Conttent-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.project_status == "canceled") {
          setCreateForbtn(false);
        }
        setProjectData(res.data, (currentResponse) => {
          console.log(currentResponse);
          const rdToken = process.env.REACT_APP_RD_TOKEN;
          const urlSupplier = process.env.REACT_APP_WAREHOUSE + `/api/v1/customer/${currentResponse.client_id}`;
          axios.get(urlSupplier, {
            headers: {
              "Conttent-Type": "application/json",
              "rd-token": `${rdToken}`,
            },
          })
            .then((res) => {
              if (res.status == 200)
                setClientName(res.data.customer.name);
            }).catch((error) => {
              console.log(error);
            })
          setProjectData(currentResponse);
        });
        console.log(projectData);
      })
      .catch((error) => {
        console.log(error);
      });

    axios.get(urlGetFormula, {
      headers: {
        "Conttent-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }
  useEffect(() => {
    fetchData();
    checkRole();
  }, [setData]);

  function deacticeProject() {
    const urlDeactive = process.env.REACT_APP_SERVER_URL + `/api/projects/${projectId}`;
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
          window.location.reload();
          return response.status;
        }
      })
  }

  function activateProject() {
    const urlDeactive = process.env.REACT_APP_SERVER_URL + `/api/projects/${projectId}/recover-project`;
    const noti = toast("Please wait...");
    fetch(urlDeactive, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else {
          toast.update(noti, {
            render: "Kích hoạt dự án thành công",
            type: "success",
            isLoading: false,
          });
          window.location.reload();
          return response.status;
        }
      })
  }


  var buttonText = "Hủy Kích Hoạt";
  var buttonColor = "danger";
  var buttonFunc = deacticeProject;
  var dis = false;
  if (projectData.project_status == "canceled") {
    buttonColor = "info";
    buttonText = "Kích Hoạt";
    dis = true;
    buttonFunc = activateProject;
  }
  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const columns = [
    {
      name: 'Phiên bản',
      center: true,
      selector: row => row.formula_version,
      sortable: true,
      cell: row => (<div>{row.formula_version}</div>)
    },
    {
      name: 'Chi phí',
      selector: row => row.formula_cost,
      right: true,
      sortable: true,
      cell: row => (<div>{parseFloat(row.formula_cost).toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      })}{" "}</div>)
    },
    {
      name: 'Người cập nhật',
      center: true,
      selector: row => row.user_name,
      sortable: true,
      cell: row => (<div>{row.user_name}</div>)
    },
    {
      name: 'Ngày cập nhật',
      center: true,
      selector: row => {
        if (row.modified_time == null) return row.created_time;
        else return row.modified_time;
      },
      sortable: true,
      cell: row => {
        if (row.modified_time == null)
          return (<div>{new Date(row.created_time).toLocaleDateString("en-SG")}</div>);
        else
          return (<div>{new Date(row.modified_time).toLocaleDateString("en-SG")}</div>);
      }
    },
    {
      name: 'Trạng thái',
      center: true,
      selector: row => row.formula_status,
      sortable: true,
      cell: row => (<div>{row.formula_status}</div>)
    },
  ]
  const classes = useStyles();
  console.log(location.state.product_info);
  const onFormulaClick = (row) => {
    history.push("/formula/detail", { formula_id: row.formula_id, formula_version: row.formula_version, formula_status: row.formula_status, project: projectData, clientName: clientName });
  }
  const checkRole = () => {
    if (role == "staff") {
      setButtonCreateFormulaStatus(false);
    }
  }
  const formatReq = (require) => {
    var result = [];
    if (require != undefined) {
      const requireArr = require.toString().split(",");
      console.log(requireArr);
      result = requireArr;
    }
    return result;
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
      <div className="navbar1">
        <AdminNavbarLinks />
      </div>
      <ButtonBack />
      <div className="productDetailInfor">
        <GridContainer>
          <ToastContainer />
          <GridItem xs={12} sm={12} md={12}>
            <div className="deactiveButton">
              <Button className="form-control btn btn-primary"
                type="submit"
                color={buttonColor}
                onClick={buttonFunc}>
                {buttonText}
              </Button>
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardHeader color="info" className={classes.cardTitleWhite}>
                Thông Tin Dự Án
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info><b>Tên dự án</b></Info>
                      <b>{projectData.project_name}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <>
                      <Info><b>Mã dự án</b></Info>
                      <b>{projectData.project_code}</b>
                    </>
                  </GridItem>
                  {/* <GridItem xs={12} sm={12} md={2}>
      <>
      <Info>Thương hiệu</Info>
      <b>{projectData.brand_name}</b>
      </>
  </GridItem> */}
                  <GridItem xs={12} sm={12} md={2}>
                    <>
                      <Info><b>Khối lượng dự tính</b></Info>
                      <b>{projectData.estimated_weight} g</b>
                    </>
                  </GridItem>
                  {/* <GridItem xs={12} sm={12} md={2}>
      <>
      <Info>Thể tích</Info>
      <b>{productData.capacity}</b>
      </>
  </GridItem> */}
                  {/* <GridItem xs={12} sm={12} md={2}>
      <>
      <Info>d</Info>
      <b>{productData.d}</b>
      </>
  </GridItem> */}
                  {/* <GridItem xs={12} sm={12} md={2}>
      <>
      <Info>Độ hao hụt</Info>
      <b>{productData.tolerance}</b>
      </>
  </GridItem> */}
                  {/* <GridItem xs={12} sm={12} md={2}>
      <>
      <Info>Hao hụt nguyên liệu</Info>
      <b>{productData.material_norm_loss}</b>
      </>
  </GridItem> */}

                  <GridItem xs={12} sm={12} md={4}>
                    <>
                      <Info><b>Yêu cầu sản phẩm</b></Info>
                      {formatReq(projectData.requirement).map((word, index) => {
                        return (
                          <>
                            <b key={index}>{word}</b> <br />
                          </>
                        );
                      })}
                    </>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info><b>Ngày bắt đầu</b></Info>
                      <b>{new Date(projectData.start_date).toLocaleDateString("en-SG")}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info><b>Ngày phải hoàn thành</b></Info>
                      <b>{new Date(projectData.complete_date).toLocaleDateString("en-SG")}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info><b>Khách hàng</b></Info>
                      <b>{clientName}</b>
                    </>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={2}>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info><b>Người tạo</b></Info>
                      <b>{projectData.created_user_name}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                  <Info><b>Nhân viên phụ trách</b></Info>
                  {projectData.listUserInProject !=undefined && projectData.listUserInProject.map((emp, index) => {
                    console.log(emp);
                    return(
                      <><b key={index}>{emp.fullname}</b><br /></>
                    )
                  })}
                    
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info><b>Trạng thái</b></Info>
                      <b>{projectData.project_status}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                  <Button type="button" disabled={dis} color="info" onClick={() => { history.push("/project/update", { project_Info: projectData, project_id: projectId, clientName: clientName, assigned_user_name: projectData.assigned_user_name }); }}>Chỉnh sửa dự án</Button>
                  </GridItem>

                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          {/* <GridItem xs={12} sm={12} md={10}>
            <Button type="button" disabled={!createForbtn} color="info" onClick={() => { history.push("/formula/create", { project_id: projectId, weight: projectData.estimated_weight }); }}>Thêm công thức</Button>
          </GridItem> */}
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardHeader color="info" className={classes.cardTitleWhite}>
                Công thức
              </CardHeader>
              <CardBody>
                <DataTable columns={columns}
                  data={data}
                  pagination
                  // optionally, a hook to reset pagination to page 1
                  subHeader
                  persistTableHead
                  onRowClicked={onFormulaClick}
                  defaultSortFieldId={4}
                  defaultSortAsc={false}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div></>

  );
}