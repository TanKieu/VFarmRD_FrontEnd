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
import axios from "axios";
import Tabs from "components/CustomTabs/CustomTabs.js";
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
const urlRequest = process.env.REACT_APP_SERVER_URL + "/api/tasks";
const urlProRequest = process.env.REACT_APP_SERVER_URL + "/api/projects/";
const urlEmpRequest = process.env.REACT_APP_SERVER_URL + "/api/users";

export default function TaskTable() {

  var [isClicked, setIsClicked] = useState(false);
  var [data, setData] = useState([]);
  var [dataPro, setDataPro] = useState([]);
  var [dataEmp, setDataEmp] = useState([]);

  const [locationKeys, setLocationKeys] = useState([]);
  const history = useHistory();

  const classes = useStyles();
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
    axios.get(urlProRequest, {
      headers: {
        'Conttent-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      if (res.status == 200) {
        setDataPro(res.data);
        dataPro = res.data;
        console.log(res.data);
        console.log(data);
      }
    }).catch((error) => {
      console.log(error);
    });
    axios.get(urlEmpRequest, {
      headers: {
        'Conttent-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      setDataEmp(res.data);
      dataEmp = res.data;
      console.log(res.data);
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });
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
          history.push("/admin/task");

        }
      }
    })
  }, [locationKeys,])

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

  const [filterTextPro, setFilterTextPro] = React.useState("");
  const [resetPaginationTogglePro, setResetPaginationTogglePro] = React.useState(false);
  const filteredItemsPro = dataPro.filter(
    item => item.project_name && item.project_name.toLowerCase().includes(filterTextPro.toLowerCase()),
  );

  const subHeaderComponentMemoPro = React.useMemo(() => {
    const handleClear = () => {
      if (filterTextPro) {
        setResetPaginationTogglePro(!resetPaginationTogglePro);
        setFilterTextPro('');
      }
    };

    return (
      <FilterComponent onFilter={e => setFilterTextPro(e.target.value)} onClear={handleClear} filterTextPro={filterTextPro} />
    );
  }, [filterTextPro, resetPaginationTogglePro]);

  const [filterTextEmp, setFilterTextEmp] = React.useState("");
  const [resetPaginationToggleEmp, setResetPaginationToggleEmp] = React.useState(false);
  const filteredItemsEmp = dataEmp.filter(
    item => item.fullname && item.fullname.toLowerCase().includes(filterTextEmp.toLowerCase()),
  );

  const subHeaderComponentMemoEmp = React.useMemo(() => {
    const handleClear = () => {
      if (filterTextEmp) {
        setResetPaginationToggleEmp(!resetPaginationToggleEmp);
        setFilterTextEmp('');
      }
    };

    return (
      <FilterComponent onFilter={e => setFilterTextEmp(e.target.value)} onClear={handleClear} filterTextEmp={filterTextEmp} />
    );
  }, [filterTextEmp, resetPaginationToggleEmp]);



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
      name: 'Dự án',
      selector: row => row.project_name,
      sortable: true,
      cell: row => (<div>{row.project_name}</div>)
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

  const columnsEmp = [
    {
      name: 'STT',
      selector: row => row.user_id,
      sortable: true,
      cell: (row, index) => (<div>{index + 1}</div>)
    },
    {
      name: 'Tên',
      selector: row => row.fullname,
      sortable: true,
      cell: row => (<div>{row.fullname}</div>)
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      cell: row => (<div>{row.email}</div>)
    }, {
      name: 'Số Điện Thoại',
      selector: row => row.phone,
      sortable: true,
      cell: row => (<div>{row.phone}</div>)
    },
    {
      name: 'Chức vụ',
      selector: row => row.roles,
      sortable: true,
      cell: row => (<div>{row.role_name}</div>)
    }
  ]

  const columnsPro = [
    {
      name: 'Mã dự án',
      selector: row => row.product_code,
      sortable: true,
      cell: row => (<div>{row.project_code}</div>)
    },
    {
      name: 'Tên sản phẩm',
      selector: row => row.project_name,
      sortable: true,
      cell: row => (<div>{row.project_name}</div>)
    },
    {
      name: 'Yêu cầu',
      selector: row => row.requirement,
      sortable: true,
      cell: row => (<div>{row.requirement}</div>)
    },
    {
      name: "Ngày phải hoàn thành",
      selector: row => row.complete_date,
      sortable: true,
      cell: row => (<div>{new Date(row.complete_date).toLocaleDateString("en-SG")}</div>)

    },
    {
      name: 'Thời gian tạo',
      selector: row => row.created_time,
      sortable: true,
      cell: row => (<div>{new Date(row.created_time).toLocaleDateString("en-SG")}</div>)
    },
  ]

  const onRowClicked = (row) => {
    //setProductId(row.staffName);

    //console.log(productId);
    setIsClicked(true);
    console.log(isClicked);
    console.log(row.task_id);

    history.push("/task/detail", { task_info: row.task_id });
  }
  const onProRowClicked = (row) => {
    console.log(row.project_id);
    history.push('/task/project/', { project_info: row.project_id });
  }
  const onEmpRowClicked = (row) => {
    console.log(row.user_id);
    history.push('/task/employee/', { employee_info: row.user_id });
  }
  window.onhashchange = function () {
    window.history.back();
  }
  return (
    <Tabs
      headerColor="info"
      tabs={[
        {
          tabName: "Công Việc",
          tabContent: (
            <GridContainer>
              <ToastContainer />
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
          )
        },
        {
          tabName: "Công Việc Theo Dự Án",
          tabContent: (
            <GridContainer>
              <ToastContainer />
              <GridItem xs={12} sm={12} md={12}>
                <Button type="button" color="info" onClick={() => { history.push("/task/create") }}> Tạo Công việc </Button>
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <CardHeader color="info" className={classes.cardTitleWhite} >
                    Dự Án
                  </CardHeader>
                  <CardBody className={classes.cardTitleWhite}>
                    <DataTable columns={columnsPro}
                      data={filteredItemsPro}
                      pagination
                      paginationResetDefaultPage={resetPaginationTogglePro} // optionally, a hook to reset pagination to page 1
                      subHeader
                      subHeaderComponent={subHeaderComponentMemoPro}
                      persistTableHead
                      onRowClicked={onProRowClicked}
                      customStyles={customStyles}
                    />
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          )
        },
        {
          tabName: "Công Việc Theo Nhân Viên",
          tabContent: (
            <GridContainer>
              <ToastContainer />
              <GridItem xs={12} sm={12} md={12}>
                <Button type="button" color="info" onClick={() => { history.push("/task/create") }}> Tạo Công việc </Button>
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <CardHeader color="info" className={classes.cardTitleWhite} >
                    Nhân Viên
                  </CardHeader>
                  <CardBody className={classes.cardTitleWhite}>
                    <DataTable columns={columnsEmp}
                      data={filteredItemsEmp}
                      pagination
                      paginationResetDefaultPage={resetPaginationToggleEmp} // optionally, a hook to reset pagination to page 1
                      subHeader
                      subHeaderComponent={subHeaderComponentMemoEmp}
                      persistTableHead
                      onRowClicked={onEmpRowClicked}
                      customStyles={customStyles}
                    />
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          )
        }
      ]}
    />
  );

}
