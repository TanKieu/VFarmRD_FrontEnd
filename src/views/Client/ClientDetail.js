/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Info from "components/Typography/Info";
import DataTable from "react-data-table-component";
import { useStateWithCallbackLazy } from "use-state-with-callback";
//import Tabs from "components/CustomTabs/CustomTabs.js";
//import Tasks from "components/Tasks/Tasks.js";
import Button from "components/CustomButtons/Button.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import { ToastContainer } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom";
import ReactLoading from "react-loading";
import FilterComponent from "components/Filter/FilterComponent";
import axios from "axios";

const styles = {
  errorMessage: {
    color: "red",
  },
};

const useStyles = makeStyles(styles);
export default function ClientDetail() {
  const classes = useStyles();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const clientID = location.state.client_id;
  const rdToken = process.env.REACT_APP_RD_TOKEN;
  const token = localStorage.getItem("token");
  const urlClient = process.env.REACT_APP_WAREHOUSE + `/api/v1/customer/${clientID}`;
  const urlClientProject = process.env.REACT_APP_SERVER_URL + `/api/projects/clients/${clientID}`;
  const [clientData, setClientData] = useStateWithCallbackLazy([]);
  const [clientProjectData, setClientProjectData] = useStateWithCallbackLazy([]);

  const history = useHistory();
  const [locationKeys, setLocationKeys] = useState([]);

  const fetchData = async () => {
    await axios
      .get(urlClient, {
        headers: {
          "Content-Type": "application/json",
          "rd-token": `${rdToken}`,
        },
      }).then((res) => {
        setClientData(
          res.data.customer, () => {
            console.log(res.data.customer);
          }
        )
      }).catch((error) => {
        console.log(error);
      });
    await axios
      .get(urlClientProject, {
        headers: {
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        setClientProjectData(res.data);
        console.log(res.data);
      }).catch((error) => {
        console.log(error);
      });
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
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

        } else {
          setLocationKeys((keys) => [location.key, ...keys])

          window.location.reload();
          history.push("/others");

        }
      }
    })
  }, [locationKeys,])

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const filteredItems = clientProjectData.filter(
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
      name: 'M?? D??? ??n',
      selector: row => row.project_code,
      sortable: true,
      cell: row => (<div>{row.project_code}</div>)
    },
    {
      name: 'T??n D??? ??n',
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
      name: 'Nh??n vi??n ph??? tr??ch t???o c??ng th???c',
      selector: row => row.assigned_user_name,
      sortable: true,
      cell: row => (<div>{row.assigned_user_name}</div>)
    },
  ]
  const onRowClicked = (row) => {
    // var productInfo = {
    //   product_id: row.product_id,
    //   product_name: row.product_name,
    //   product_inquiry: row.product_inquiry
    // }
    //  navigate("/admin/product/detail", { replace: true, state: {product : productInfo}});

    history.push('/project/detail', { project_info: row.project_id });
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
    <GridContainer>
      <ToastContainer />
      <GridItem xs={12} sm={12} md={10}>
        <Card>
          <CardHeader color="info">
            <GridItem>
              Th??ng Tin Kh??ch h??ng
            </GridItem>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <Info>T??n Kh??ch h??ng:</Info>
                <b>{clientData.name}</b>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <Info><b>?????a ch???:</b></Info>
                <b>{clientData.address}</b>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <Info><b>Ph?????ng/X??:</b></Info>
                <b>{clientData.ward}</b>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <Info><b>Qu???n/Huy???n:</b></Info>
                <b>{clientData.district}</b>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <Info><b>T???nh/Th??nh ph???:</b></Info>
                <b>{clientData.city}</b>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <Info><b>S??? ??i???n tho???i:</b></Info>
                <b>{clientData.phone}</b>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <Info><b>Email:</b></Info>
                <b>{clientData.email}</b>
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <Button type="button" color="info" onClick={() => { history.push("/other/client/update", { clientData: clientData }) }}>Ch???nh s???a</Button>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={10}>
        <Card>
          <CardHeader color="info" className={classes.cardTitleWhite} >
            D??? ??n C???a Kh??ch H??ng : {clientData.name}
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
  );
}