/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
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
import axios from "axios";
import DataTable from "react-data-table-component";
import FilterComponent from "components/Filter/FilterComponent";
import Container from "components/Container/ModalContainer";
//import RegularButton from "components/CustomButtons/Button";
// import Select from "@material-ui/core/Select/SelectInput";
// import { InputLabel } from "@material-ui/core";
// import { MenuItem } from "@material-ui/core";
// import Icons from "views/Icons/Icons";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
//import ProductDetail from "views/Product/ProductDetail";
//import EmployeeDetail from "./EmployeeDetail";
import EmployeeDetail from "./EmployeeDetail";
import { useHistory } from "react-router-dom";
import NotiContainer from "components/Container/PushNotiContainer";


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


const urlRequest = process.env.REACT_APP_SERVER_URL + "/api/users";
const useStyles = makeStyles(styles);
export default function EmployeeTable() {


const[locationKeys, setLocationKeys] = useState([]);
const history = useHistory();
var [isClicked, setIsClicked] = useState(false);
var [userid, setUserId] = useState();
var [url,setUrl] = useState("");
const [employeeInfo, setEmployeeInfo] = useState();
const [selectedEmp, setSelectedEmp] = useState([]);

var [data, setData] = useState([]);
const token = localStorage.getItem("token");
   const fetchData = () => {
    axios.get(urlRequest, {
    headers: {
      'Conttent-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => {
    setData(res.data);
    data = res.data;
  }).catch((error) => {
    console.log(error);
  });
}
useEffect(() => {
  fetchData();
  return history.listen(location => {
    if (history.action === 'PUSH') {
      setLocationKeys([ location.key ])
    }

    if (history.action === 'POP') {
      if (locationKeys[1] === location.key) {
        // eslint-disable-next-line no-unused-vars
        setLocationKeys(([ _, ...keys ]) => keys)

        // Handle forward event

      } else {
        setLocationKeys((keys) => [ location.key, ...keys ])

        window.location.reload();
        history.push("/admin/employee");

      }
    }
  })
}, [locationKeys, ]);

  const [filterText, setFilterText] = React.useState("");
	const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
	const filteredItems = data.filter(
		item => item.fullname && item.fullname.toLowerCase().includes(filterText.toLowerCase()),
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
      name: 'STT',
      selector: row => row.user_id,
      sortable: true,
      cell: (row,index) => (<div>{index + 1}</div>)
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
    },{
      name: 'Số Điện Thoại',
      selector: row => row.phone,
      sortable: true,
      cell: row => (<div>{row.phone}</div>)
    },
    {
      name: 'Chức vụ',
      selector: row => row.role_name,
      sortable: true,
      cell: row => (<div>{row.role_name}</div>)
    }
  ]
  
  const classes = useStyles();

  const onRowClicked = (row) => {
    setUserId(row.user_id);

    setUrl("/admin/employee/detail/" + row.user_id);
    console.log("direct đi " + url);
    setIsClicked(true);
    console.log(isClicked);
    setEmployeeInfo({
      user_id: row.user_id,
      email: row.email,
      fullname: row.fullname,
      password: row.password,
      phone: row.phone,
      role_name: row.role_name,
      user_name: row.user_name,
      user_status: row.user_status
    });
    console.log(employeeInfo);
    
  }
  window.onhashchange =  function() {
    window.history.back();
  }
  if(isClicked !== false && userid !== undefined) {
    console.log(userid);
    return (
      <>
      <BrowserRouter>
        <Switch>
          <Route path={url}>
            <EmployeeDetail employee = {employeeInfo} />
          </Route>
        </Switch>
        <Redirect push to={url} />
      </BrowserRouter>
      </>
    );
  }else {
  return (
    <GridContainer>
      <ToastContainer />
      <GridItem xs={12} sm={12} md={12}>
        <GridContainer>
        <GridItem xs={10} sm={10} md={2}>
            <Container triggertext="thêm mới nhân viên" />
          </GridItem>
          <GridItem xs={10} sm={10} md={2}>
            <NotiContainer triggertext="Gửi thông báo" empList={selectedEmp} />
          </GridItem>
        </GridContainer>
        <Card>
          <CardHeader color="info" className={classes.cardTitleWhite}> 
          Nhân Viên
          </CardHeader>
          <CardBody>
            <DataTable  columns={columns}
                data={filteredItems}
                pagination
                paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
                onRowClicked={onRowClicked}
                customStyles={customStyles}
                selectableRows
                onSelectedRowsChange={({selectedRows}) => {
                  console.log(selectedRows);
                  const empsId = [];
                  selectedRows.forEach((row) =>{
                    empsId.push(row.user_id);
                  });
                  setSelectedEmp(empsId);
                }} />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
  }
}
