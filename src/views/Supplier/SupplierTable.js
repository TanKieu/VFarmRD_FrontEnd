/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
// @material-ui/core components
//import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import DataTable from "react-data-table-component";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
//import Tabs from "components/CustomTabs/CustomTabs.js";
//import Tasks from "components/Tasks/Tasks.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Container from "components/Container/SupplierModalContainer";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import FilterComponent from "components/Filter/FilterComponent";
// import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
// import SupplierDetail from "./SupplierDetail";
import axios from "axios";



export default function SupplierTable() {
  const rdToken = process.env.REACT_APP_RD_TOKEN;
  const urlSupplier = process.env.REACT_APP_WAREHOUSE + "/api/v1/supplier/all";
  var [suppliers, setSuppliers] = useState([]);
  const [locationKeys, setLocationKeys] = useState([]);
  const history = useHistory();

  var [isClicked, setIsClicked] = useState(false);
  var [supid, setSupId] = useState();
  var [url, setUrl] = useState("");

  //const [supplierInfo, setSupplierInfo] = useState({});

  const fetchData = () => {
    axios.get(urlSupplier, {
      headers: {
        "Conttent-Type": "application/json",
        "rd-token": `${rdToken}`,
      },
    })
      .then((res) => {
        if (res.status == 200)
          setSuppliers(
            res.data.suppliers
          )
      }).catch((error) => {
        console.log(error);
      })
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
          history.push("/admin/other");

        }
      }
    })
  }, [locationKeys,])

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const filteredItems = suppliers.filter(
    sup => sup.name && sup.name.toLowerCase().includes(filterText.toLowerCase()),
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
      selector: row => row._id,
      sortable: true,
      cell: (row,index) => (<div>{index+1}</div>)
    },
    {
      name: 'Nhà cung cấp',
      selector: row => row.name,
      sortable: true,
      cell: row => (<div>{row.name}</div>)
    },
    {
      name: 'Người liên lạc',
      selector: row => row.contactPerson,
      sortable: true,
      cell: row => (<div>{row.contactPerson}</div>)
    },
    {
      name: 'Số điện thoại',
      selector: row => row.contactPhone,
      sortable: true,
      cell: row => (<div>{row.contactPhone}</div>)
    },
    {
      name: 'Email',
      selector: row => row.contactEmail,
      sortable: true,
      cell: row => (<div>{row.contactEmail}</div>)
    },
    {
      name: 'Ngày cập nhật',
      selector: row => row.modifiedTime,
      sortable: true,
      cell: row => (<div>{row.modifiedTime}</div>)
    },
  ]

  const onRowClicked = (row) => {
    setSupId(row._id);
    console.log(supid);
    setUrl("/admin/other/supplier/detail/" + row._id);
    console.log("direct đi " + url);
    setIsClicked(true);
    console.log(isClicked);
    /*setSupplierInfo({
      sup_id: row._id,
      sup_name: row.name,
      sup_contactPerson: row.contactPerson,
      sup_contactPhone: row.contactPhone,
      sup_contactEmail: row.contactEmail,
    });*/
    //console.log(supplierInfo);

    history.push('/other/supplier/detail', { supID: row._id });
  }
  window.onhashchange = function () {
    window.history.back();
  }
  //const classes = useStyles();
  // if (isClicked != false && supid !== undefined) {
  //   console.log(supid);
  //   return (
  //     <>
  //       <BrowserRouter>
  //         <Switch>
  //           <Route path={url}>
  //             <SupplierDetail supplier={supplierInfo} />
  //           </Route>
  //         </Switch>
  //         <Redirect push to={url} />
  //       </BrowserRouter>
  //     </>
  //   )
  // } else {
  return (
    <GridContainer>
      <ToastContainer />
      <GridItem xs={12} sm={12} md={12}>
        <GridItem xs={10} sm={10} md={2}>
          <div>
            <Container triggertext="thêm nhà cung cấp" />
          </div>
        </GridItem>
        <Card>
          <CardHeader color="info" >
            Nhà Cung Cấp
          </CardHeader>
          <GridItem xs={10} sm={10} md={2}>
          </GridItem>
          <CardBody>
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
  );
  //}
}