/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
// import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
//import Tabs from "components/CustomTabs/CustomTabs.js";
//import Tasks from "components/Tasks/Tasks.js";
import FilterComponent from "components/Filter/FilterComponent";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DataTable from "react-data-table-component";
import { useLocation } from "react-router-dom";
import ReactLoading from "react-loading";
import axios from "axios";
import Info from "components/Typography/Info";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
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
export default function ApproveFormula() {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useStateWithCallbackLazy("");

  const location = useLocation();
  const projectId = location.state.project_info;
  const [clientName, setClientName] = useState("");
  const urlProject = process.env.REACT_APP_SERVER_URL + `/api/projects/${projectId}`;
  const urlGetFormula = process.env.REACT_APP_SERVER_URL + `/api/formulas?project_id=${projectId}&formula_status=pending`;

  const [locationKeys, setLocationKeys] = useState([]);
  const history = useHistory();
  const token = localStorage.getItem("token");
  // eslint-disable-next-line no-unused-vars
  var [data, setData] = useState([])

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const filteredItems = data.filter(
    item => item.user_name && item.user_name.toLowerCase().includes(filterText.toLowerCase()),
  );

  const fetchData = () => {
    console.log(urlGetFormula);
    axios.get(urlGetFormula, {
      headers: {
        "Conttent-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios.get(urlProject, {
      headers: {
        "Conttent-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
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
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }
  useEffect(() => {
    fetchData();
    return history.listen(location => {
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
          history.push("/approve-formula");

        }
      }
    })
  }, [setData]);

  const project_name = location.state.project_name;
  const onRowClicked = (row) => {

    // setUrl("/formula/detail/" + row.formula_version);
    // console.log("direct đi " + url);
    // var projectInfo = {
    //project_id: row.project_id,
    //   project_name: row.project_name,
    //   project_inquiry: row.project_inquiry
    // }
    //  navigate("/admin/project/detail", { replace: true, state: {project : projectInfo}});

    history.push("/approve/detail",
      {
        formula_id: row.formula_id, project_id: projectId, formula_version: row.formula_version, project_name: project_name
      });
  }
  window.onhashchange = function () {
    window.history.back();
  }

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
    );
  }, [filterText, resetPaginationToggle]);

  const columns = [
    {
      name: 'Phiên bản',
      selector: row => row.formula_version,
      sortable: true,
      cell: row => (<div>{row.formula_version}</div>)
    },
    {
      name: 'Người tạo',
      selector: row => row.user_name,
      sortable: true,
      cell: row => (<div>{row.user_name}</div>)
    },
    {
      name: 'Mô tả công thức',
      selector: row => row.description,
      sortable: true,
      cell: row => (<div>{row.description}</div>)
    },
    {
      name: 'Trạng thái',
      selector: row => row.formula_status,
      sortable: true,
      cell: row => (<div>{row.formula_status}</div>)
    },
  ]
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
    <><div className="navbar1">
        <AdminNavbarLinks />
      </div>
      <ButtonBack />
      <div style={{ overflow: "hidden" }}>
          <GridContainer>
            <ToastContainer />
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
                    {/* <GridItem xs={12} sm={12} md={2}>
<>
<Info>Thương hiệu</Info>
<b>{projectData.brand_name}</b>
</>
</GridItem> */}
                    <GridItem xs={12} sm={12} md={2}>
                      <>
                        <Info>Khối lượng dự tính</Info>
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
                        <b>{new Date(projectData.created_time).toLocaleDateString("en-SG")}</b>
                      </>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <>
                        <Info>Ngày phải hoàn thành</Info>
                        <b>{new Date(projectData.complete_date).toLocaleDateString("en-SG")}</b>
                      </>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <>
                        <Info>Khách hàng</Info>
                        <b>{clientName}</b>
                      </>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={2}>

                    </GridItem>
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
            <GridItem xs={12} sm={12} md={10}>
              <Card>
                <CardHeader color="info" className={classes.cardTitleWhite}>
                  Công thức đang chờ
                </CardHeader>

                <CardBody>
                  <DataTable columns={columns}
                    data={filteredItems}
                    pagination
                    paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    persistTableHead
                    onRowClicked={onRowClicked} />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div></>
  );
}
