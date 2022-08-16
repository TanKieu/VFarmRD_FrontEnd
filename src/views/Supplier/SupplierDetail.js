/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import DataTable from "react-data-table-component";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Tabs from "components/CustomTabs/CustomTabs.js";
import { useStateWithCallbackLazy } from "use-state-with-callback";
//import Tasks from "components/Tasks/Tasks.js";
//import CustomInput from "components/CustomInput/CustomInput.js";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom";
import Button from "components/CustomButtons/Button.js";
import Container from "components/Container/MaterialModalContainer";
import Info from "components/Typography/Info";
import ReactLoading from "react-loading";
import FilterComponent from "components/Filter/FilterComponent";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
//import FilterComponent from "components/Filter/FilterComponent";

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

export default function MaterialTable() {
  const classes = useStyles();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const urlMaterialRequest = process.env.REACT_APP_WAREHOUSE + "/api/v1/material";
  const rdToken = process.env.REACT_APP_RD_TOKEN;
  const supID = location.state.supID;
  const [supData, setSupData] = useStateWithCallbackLazy([]);

  const urlSupplier = process.env.REACT_APP_WAREHOUSE + `/api/v1/supplier/${supID}`;
  const history = useHistory();
  const [locationKeys, setLocationKeys] = useState([]);

  const [matData, setMatData] = useState([]);

  const fetchData = async () => {
    await axios
      .get(urlSupplier, {
        headers: {
          "Conttent-Type": "application/json",
          "rd-token": `${rdToken}`,
        },
      }).then((res) => {
        setSupData(
          res.data.supplier, () => {
            console.log(res.data.supplier);
          }
        )
      });
    await axios
      .get(urlMaterialRequest, {
        headers: {
          "Conttent-Type": "application/json",
          "rd-token": `${rdToken}`,
        },
      })
      .then((res) => {
        const isMaterial = [];
        res.data.materialList.map((material) => {
          if (material.warehouse === "600a8a1e3fb5d34046a6f4c4") {
            if (material.supplier === supID) {
              isMaterial.push(material);
            }
          }
        });
        setMatData(isMaterial);
        console.log(isMaterial);
      })
      .catch((error) => {
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
  const filteredItems = matData.filter(
    item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
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

  const matColumns = [
    {
      name: "Code",
      selector: row => row.code,
      sortable: true,
      cell: row => (<div>{row.code}</div>)
    },
    {
      name: "Tên nguyên liệu",
      selector: row => row.name,
      sortable: true,
      cell: row => (<div>{row.name + row.tradeName}</div>)
    },
    {
      name: "inciName",
      selector: row => row.inciName,
      sortable: true,
      cell: row => (<div>{row.inciName}</div>)
    },
    {
      name: "Đơn vị tính",
      selector: row => row.unit,
      sortable: true,
      cell: row => (<div>{row.unit}</div>)
    }
  ]

  // const convertSupIDToSup = (supID) => {
  //   const sup = supList.find((e) => e._id == supID);
  //   if (sup !== undefined) {
  //     return sup.name;
  //   }
  // }


  const onMatRowClicked = (row) => {
    history.push("/material/detail", { material_Info: row._id })
    console.log(row._id);
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
    <>
      <div className="navbar">
        <AdminNavbarLinks />
      </div>
      <GridContainer>
        <ToastContainer />
        <GridItem xs={12} sm={12} md={10}>
          <Card>
            <CardHeader color="info">
              <GridItem>
                Thông Tin Nhà Cung Cấp
              </GridItem>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <Info><b>Tên nhà cung cấp:</b></Info>
                  <b>{supData.name}</b>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Info><b>Tên người liên lạc:</b></Info>
                  <b>{supData.contactPerson}</b>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Info><b>Số điện thoại:</b></Info>
                  <b>{supData.contactPhone}</b>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Info><b>Email:</b></Info>
                  <b>{supData.contactEmail}</b>
                </GridItem>
              </GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Button type="button" color="info" onClick={() => { history.push("/other/supplier/update", { supData: supData }) }}>Cập nhật</Button>
              </GridItem>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={10}>
          <GridItem xs={10} sm={10} md={2}>
            <Container triggertext="thêm Nguyên liệu" />
          </GridItem>
          <Card>
            <GridItem xs={10} sm={10} md={2}>
            </GridItem>
            <CardBody>
              <DataTable columns={matColumns}
                data={filteredItems}
                pagination
                paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
                onRowClicked={onMatRowClicked} />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  )
}
