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

export default function TaskTable() {

  var [isClicked, setIsClicked] = useState(false);
  var [data, setData] = useState([]);
  var [dataPro, setDataPro] = useState([]);

  const user_id = localStorage.getItem("userId");

  const urlProRequest = process.env.REACT_APP_SERVER_URL + `/api/projects/users/${user_id}`;
  const urlRequest = process.env.REACT_APP_SERVER_URL + `/api/tasks/filter?Employee_id=0&user_id=${user_id}`;

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
      name: 'T??n nhi???m v???',
      selector: row => row.task_name,
      sortable: true,
      cell: row => (<div>{row.task_name}</div>)
    },
    {
      name: 'Nh??n Vi??n',
      selector: row => row.user_name,
      sortable: true,
      cell: row => (<div>{row.user_name}</div>)
    },
    {
      name: 'D??? ??n',
      selector: row => row.project_name,
      sortable: true,
      cell: row => (<div>{row.project_name}</div>)
    },
    {
      name: 'Ng??y t???o',
      selector: row => row.created_date,
      sortable: true,
      cell: row => (<div>{new Date(row.created_date).toLocaleDateString("en-SG")}</div>)
    },
    {
      name: 'Tr???ng th??i',
      selector: row => row.task_status,
      sortable: true,
      cell: row => (<div>{row.task_status}</div>)
    },
  ]

  const columnsPro = [
    {
      name: 'M?? d??? ??n',
      selector: row => row.product_code,
      sortable: true,
      cell: row => (<div>{row.project_code}</div>)
    },
    {
      name: 'T??n s???n ph???m',
      selector: row => row.project_name,
      sortable: true,
      cell: row => (<div>{row.project_name}</div>)
    },
    {
      name: 'Y??u c???u',
      selector: row => row.requirement,
      sortable: true,
      cell: row => (<div>{row.requirement}</div>)
    },
    {
      name: "Ng??y ph???i ho??n th??nh",
      selector: row => row.complete_date,
      sortable: true,
      cell: row => (<div>{new Date(row.complete_date).toLocaleDateString("en-SG")}</div>)

    },
    {
      name: 'Th???i gian t???o',
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
  window.onhashchange = function () {
    window.history.back();
  }
  return (
    <Tabs
      headerColor="info"
      tabs={[
        {
          tabName: "C??ng Vi???c",
          tabContent: (
            <GridContainer>
              <ToastContainer />
              <GridItem xs={12} sm={12} md={12}>
                <Button type="button" color="info" onClick={() => { history.push("/task/create") }}> T???o C??ng vi???c </Button>
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <CardHeader color="info" className={classes.cardTitleWhite} >
                    C??ng vi???c
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
          tabName: "C??ng Vi???c Theo D??? ??n",
          tabContent: (
            <GridContainer>
              <ToastContainer />
              <GridItem xs={12} sm={12} md={12}>
                <Button type="button" color="info" onClick={() => { history.push("/task/create") }}> T???o C??ng vi???c </Button>
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <CardHeader color="info" className={classes.cardTitleWhite} >
                    D??? ??n
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
      ]}
    />
  );

}
