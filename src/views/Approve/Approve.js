/* eslint-disable prettier/prettier */
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
// eslint-disable-next-line no-unused-vars
import Tabs from "components/CustomTabs/CustomTabs.js";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";

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
// const divStyle = {
//   marginTop: "2%"
// };

const useStyles = makeStyles(styles);
const urlRequest = process.env.REACT_APP_SERVER_URL + "/api/projects/have-formula-status?formula_status=pending";
const urlSubmit = process.env.REACT_APP_SERVER_URL + "/api/projects/have-formula-status?formula_status=on20%process";
export default function Approve() {

  const [locationKeys, setLocationKeys] = useState([]);
  const history = useHistory();
  var [isClicked, setIsClicked] = useState(false);
  var [projectId, setProjectId] = useState();

  const classes = useStyles();
  // const [compon, setCompon] = useState("");

  var [data, setData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  var [dataSubmit, setDataSubmit] = useState([]);
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
        data = res.data.projects;
        console.log(res.data);
        console.log(data);
      }
    }).catch((error) => {
      console.log(error);
    });
    axios.get(urlSubmit, {
      headers: {
        'Conttent-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      if (res.status == 200) {
        setDataSubmit(res.data);
        dataSubmit = res.data.projects;
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
          history.push("/admin/approve");

        }
      }
    })
  }, [locationKeys,]);


  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const filteredItems = data.filter(
    item => item.project_name && item.project_name.toLowerCase().includes(filterText.toLowerCase()),
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

  //data of submit formula
  // const [filterSubmit, setFilterSubmit] = React.useState("");
  // const [resetSubmitPaginationToggle, setSubmitResetPaginationToggle] = React.useState(false);
  // const filteredSubmit = dataSubmit.filter(
  //   item => item.project_name && item.project_name.toLowerCase().includes(filterText.toLowerCase()),
  // );

  // const subSubmitHeaderComponentMemo = React.useMemo(() => {
  //   const handleClear = () => {
  //     if (filterSubmit) {
  //       setSubmitResetPaginationToggle(!resetSubmitPaginationToggle);
  //       setFilterSubmit('');
  //     }
  //   };

  //   return (
  //     <FilterComponent onFilter={e => setFilterSubmit(e.target.value)} onClear={handleClear} filterSubmit={filterSubmit} />
  //   );
  // }, [filterSubmit, resetSubmitPaginationToggle]);

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
      name: 'Mã Dự Án',
      selector: row => row.project_code,
      sortable: true,
      cell: row => (<div>{row.project_code}</div>)
    },
    {
      name: 'Tên Dự Án',
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
      name: 'Nhân viên phụ trách tạo công thức',
      selector: row => row.assigned_user_name,
      sortable: true,
      cell: row => (<div>{row.assigned_user_name}</div>)
    },
  ]

  // const buttonAddClick = () => {
  //   setCompon("addproduct");
  // }
  // const buttonBackClick = () => {
  //   setCompon("back");
  // }
  // if (compon === "addproduct") {
  //   return (
  //     <div style={divStyle} className={classes.cardTitleWhite}>
  //       <Button type="button" color="info" onClick={buttonBackClick}>Trở về</Button>
  //       <AddProduct></AddProduct>
  //     </div>
  //   );
  // }

  const onRowClicked = (row) => {
    setProjectId(row.project_id);

    console.log(projectId);
    setIsClicked(true);
    console.log(isClicked);

    history.push("/approve/formula", { project_info: row.project_id, project_name: row.project_name });
  }
  // eslint-disable-next-line no-unused-vars
  const onRowSubmitClicked = (row) => {
    setProjectId(row.project_id);

    console.log(projectId);
    setIsClicked(true);
    console.log(isClicked);

    history.push("/submit/formula", { project_info: row.project_id, project_name: row.project_name, formula_status: row.formula_status });
  }
  window.onhashchange = function () {
    window.history.back();
  }
  return (
    <GridContainer>
    <ToastContainer />
    <GridItem xs={12} sm={12} md={12}>
      <Card>
        <CardHeader color="info" className={classes.cardTitleWhite} >
          Dự Án Có Công Thức chờ duyệt
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
            customStyles={customStyles} />
        </CardBody>
      </Card>
    </GridItem>
  </GridContainer>
    // <Tabs
    //   headerColor="info"
    //   tabs={[
    //     {
    //       tabName: "Duyệt công thức",
    //       tabContent: (
    //         <GridContainer>
    //           <ToastContainer />
    //           <GridItem xs={12} sm={12} md={12}>
    //             <Card>
    //               <CardHeader color="info" className={classes.cardTitleWhite} >
    //                 Dự Án Có Công Thức chờ duyệt
    //               </CardHeader>
    //               <CardBody className={classes.cardTitleWhite}>
    //                 <DataTable columns={columns}
    //                   data={filteredItems}
    //                   pagination
    //                   paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
    //                   subHeader
    //                   subHeaderComponent={subHeaderComponentMemo}
    //                   persistTableHead
    //                   onRowClicked={onRowClicked} 
    //                   customStyles={customStyles} />
    //               </CardBody>
    //             </Card>
    //           </GridItem>
    //         </GridContainer>
    //       )
    //     },
    //     {
    //       tabName: "Nộp công thức",
    //       tabContent: (
    //         <GridContainer>
    //           <ToastContainer />
    //           <GridItem xs={12} sm={12} md={12}>
    //             <Card>
    //               <CardHeader color="info" className={classes.cardTitleWhite} >
    //                 Công Thức chờ nộp
    //               </CardHeader>
    //               <CardBody className={classes.cardTitleWhite}>
    //                 <DataTable columns={columns}
    //                   data={filteredSubmit}
    //                   pagination
    //                   paginationResetDefaultPage={resetSubmitPaginationToggle} // optionally, a hook to reset pagination to page 1
    //                   subHeader
    //                   subHeaderComponent={subSubmitHeaderComponentMemo}
    //                   persistTableHead
    //                   onRowClicked={onRowSubmitClicked} 
    //                   customStyles={customStyles} />
    //               </CardBody>
    //             </Card>
    //           </GridItem>
    //         </GridContainer>
    //       )
    //     }
    //   ]}
    // />
  );

}
