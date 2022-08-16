/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
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
//import Button from "components/CustomButtons/Button.js";
//import CustomInput from "components/CustomInput/CustomInput.js";
//import AddProduct from "./AddProduct";
import DataTable from "react-data-table-component";
import FilterComponent from "components/Filter/FilterComponent";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import ReactLoading from "react-loading";
import axios from "axios";
import Info from "components/Typography/Info";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
import { ToastContainer } from "react-toastify";
import { Button } from "@material-ui/core";

const styles = {
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

export default function TaskTableProStaff() {

  const location = useLocation();
  const projectId = location.state.project_info;
  const user_id = localStorage.getItem("userId");
  const urlRequest = process.env.REACT_APP_SERVER_URL + `/api/tasks/filter?project_id=${projectId}&user_id=${user_id}`;
  const urlProject = process.env.REACT_APP_SERVER_URL + `/api/projects/${projectId}`;
  var [isClicked, setIsClicked] = useState(false);
  var [data, setData] = useState([]);

  const [locationKeys, setLocationKeys] = useState([]);
  const history = useHistory();

  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useStateWithCallbackLazy("");
  // const [compon, setCompon] = useState("");

  const token = localStorage.getItem("token");

  const fetchData = () => {
    axios.get(urlRequest, {
      headers: {
        'Conttent-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      if (res.status == 200) {
        setData(res.data);
        data = res.data;
        console.log(res.data);
        console.log(data);
      }
    }).catch((error) => {
      console.log(error);
    });
    axios.get(urlProject, {
      headers: {
        'Conttent-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      if (res.status == 200) {
        setProjectData(res.data);
        console.log(res.data);
        console.log(data);
      }
    }).catch((error) => {
      console.log(error);
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
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
          history.push("/task-project");

        }
      }
    })
  }, [setData]);

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const filteredItems = data.filter(
    item => item.task_name && item.task_name.toLowerCase().includes(filterText.toLowerCase()),
  );

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

  const customStyles = {
    rows: {
      style: {
        minHeight: '72px', // override the row height
        fontSize: '16px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
      },
    },
  };
  const columns = [
    {
      name: 'Tên nhiệm vụ',
      selector: row => row.task_name,
      sortable: true,
      cell: row => (<div>{row.task_name}</div>)
    },
    {
      name: 'Nhân Viên',
      selector: row => row.user_name,
      sortable: true,
      cell: row => (<div>{row.user_name}</div>)
    },
    {
      name: 'Ngày tạo',
      selector: row => row.created_date,
      sortable: true,
      cell: row => (<div>{new Date(row.created_date).toLocaleDateString("en-SG")}</div>)
    },
    {
      name: 'Trạng thái',
      selector: row => row.task_status,
      sortable: true,
      cell: row => (<div>{row.task_status}</div>)
    },
  ]

  const onRowClicked = (row) => {
    //setProductId(row.staffName);

    //console.log(productId);
    setIsClicked(true);
    console.log(isClicked);
    console.log(row.task_id);

    history.push("/task/detail", { task_info: row.task_id, user_name: row.user_name, project_name: row.project_name });
  }

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
    <div style={{ overflow: "hidden" }}>
      <div className="navbar">
        <AdminNavbarLinks />
      </div>
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
                <GridItem xs={12} sm={12} md={3}>
                  <>
                    <Info>Mã dự án</Info>
                    <b>{projectData.project_code}</b>
                  </>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <>
                    <Info>Khối lượng dự tính</Info>
                    <b>{projectData.estimated_weight} g</b>
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
        <GridItem xs={12} sm={12} md={12}>
          <Button type="button" color="info" onClick={() => { history.push("/task/create") }}> Tạo Công việc </Button>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="info" className={classes.cardTitleWhite} >
              Công việc
            </CardHeader>
            <CardBody className={classes.cardTitleWhite}>
              <DataTable columns={columns}
                data={filteredItems}
                pagination
                paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
                onRowClicked={onRowClicked}
                customStyles={customStyles}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );

}
