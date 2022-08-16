/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import DataTable from "react-data-table-component";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
//import Tabs from "components/CustomTabs/CustomTabs.js";
//import Tasks from "components/Tasks/Tasks.js";
import Container from "components/Container/ClientModalContainer";
import CustomInput from "components/CustomInput/CustomInput.js";
//import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import FilterComponent from "components/Filter/FilterComponent";
import { useHistory } from "react-router-dom";
//import ClientDetail from "./ClientDetail";
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

const useStyles = makeStyles(styles);

export default function ClientTable() {
  const classes = useStyles();
  const rdToken = process.env.REACT_APP_RD_TOKEN;
  const urlSupplier = process.env.REACT_APP_WAREHOUSE + "/api/v1/customer";
  var [clients, setClients] = useState([]);

  var [isClicked, setIsClicked] = useState(false);
  var [clientId, setClientId] = useState();
  var [url, setUrl] = useState("");

  //const [clientInfo, setClientInfo] = useState({});

  const [locationKeys, setLocationKeys] = useState([]);
  const history = useHistory();
  const fetchData = () => {
    axios.get(urlSupplier, {
      headers: {
        "Conttent-Type": "application/json",
        "rd-token": `${rdToken}`,
      },
    })
      .then((res) => {
        if (res.status == 200)
          setClients(
            res.data.customers
          )
        console.log(res.data.customers);
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
  const filteredItems = clients.filter(
    client => client.name && client.name.toLowerCase().includes(filterText.toLowerCase()),
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
      cell: (row, index) => (<div>{index + 1}</div>)
    },
    {
      name: 'Khách hàng',
      selector: row => row.name,
      sortable: true,
      cell: row => (<div>{row.name}</div>)
    },
    {
      name: 'Địa chỉ',
      selector: row => row.address,
      sortable: true,
      cell: row => (<div>{row.address}, {row.ward}, {row.district}, {row.city}</div>)
    },
    {
      name: 'Số điện thoại',
      selector: row => row.phone,
      sortable: true,
      cell: row => (<div>{row.phone}</div>)
    },
    {
      name: 'Ngày cập nhật',
      selector: row => row.modifiedTime,
      sortable: true,
      cell: row => (<div>{row.modifiedTime}</div>)
    },
  ]

  const onRowClicked = (row) => {
    setClientId(row._id);
    console.log(clientId);
    console.log(row._id);
    setUrl("/admin/other/client/detail/" + row._id);
    console.log(url);
    setIsClicked(true);
    console.log(isClicked);
    // setClientInfo({
    //   client_id: row._id,
    //   client_name: row.name,
    //   client_address: row.address,
    //   client_ward: row.ward,
    //   client_district: row.district,
    //   client_city: row.city,
    //   client_phone: row.phone,
    //   client_email: row.email,
    // })
    // console.log(clientInfo);

    history.push('/other/client/detail', { client_id: row._id });
  }
  window.onhashchange = function () {
    window.history.back();
  }
  // if (isClicked != false && clientId != undefined) {
  //   console.log("clientId: " + clientId);
  //   return (
  //     <>
  //       <BrowserRouter>
  //         <Switch>
  //           <Route path={url}>
  //             <ClientDetail client={clientInfo} />
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
            <Container triggertext="thêm khách hàng" />
          </div>
        </GridItem>
        <Card>
          <CardHeader color="info" className={classes.cardTitleWhite}>
            Khách Hàng
          </CardHeader>
          <GridItem xs={10} sm={10} md={2}>
            <CustomInput
              labelText="Tìm"
              id=""
              formControlProps={{
                fullWidth: true
              }}
            />
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
              customStyles={customStyles}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
  //}
}