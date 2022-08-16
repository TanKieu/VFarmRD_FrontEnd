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
import { useHistory } from "react-router-dom";
import Button from "components/CustomButtons/Button.js";
import FilterComponent from "components/Filter/FilterComponent";
import Container from "components/Container/MaterialModalContainer";
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
  const urlMaterialRequest = process.env.REACT_APP_WAREHOUSE + "/api/v1/material";
  const urlSupplier = process.env.REACT_APP_WAREHOUSE + "/api/v1/supplier/all";
  const rdToken = process.env.REACT_APP_RD_TOKEN;

  const history = useHistory();
  const [locationKeys, setLocationKeys] = useState([]);

  const [supList, setSupList] = useStateWithCallbackLazy([]);

  const [matData, setMatData] = useState([]);
  const [pakData, setPakData] = useState([]);

  const fetchData = async () => {
    await axios
      .get(urlSupplier, {
        headers: {
          "Conttent-Type": "application/json",
          "rd-token": `${rdToken}`,
        },
      }).then((res) => {
        setSupList(
          res.data.suppliers, () => {
            console.log(res.data.suppliers);
            console.log(supList);
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
        const isPackage = [];
        const haveSup = [];
        const noSup = [];
        res.data.materialList.map((material) => {
          if (material.warehouse === "600a8a1e3fb5d34046a6f4c4") {
            isMaterial.push(material);
          } else if (material.warehouse === "600a8a1e3fb5d34046a6f4c3") {
            isPackage.push(material);
          }
        });
        setMatData(isMaterial);
        setPakData(isPackage);
      })
      .catch((error) => {
        console.log(error);
      });
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
      name: "Nhà cung cấp",
      selector: row => row.supplier,
      sortable: true,
      cell: row => (<div>{convertSupIDToSup(row.supplier)}</div>)
    }
  ]

  const convertSupIDToSup = (supID) => {
    const sup = supList.find((e) => e._id == supID);
    if (sup !== undefined) {
      return sup.name;
    }
  }

  const pakColumns = [
    {
      name: "Code",
      selector: row => row.code,
      sortable: true,
      cell: row => (<div>{row.code}</div>)
    },
    {
      name: "Tên Bao Bì",
      selector: row => row.name,
      sortable: true,
      cell: row => (<div>{row.name}</div>)
    },
    {
      name: "Đơn vị tính",
      selector: row => row.unit,
      sortable: true,
      cell: row => (<div>{row.unit}</div>)
    },
    {
      name: "Nhà cung cấp",
      selector: row => row.supplier,
      sortable: true,
      cell: row => (<div>{convertSupIDToSup(row.supplier)}</div>)
    }
  ]

  const onMatRowClicked = (row) => {
    history.push("/material/detail", { material_Info: row._id })
    console.log(row._id);
  }
  const onPakRowClicked = (row) => {
    history.push("/material/detail", { material_Info: row._id })
    console.log(row._id);
  }

  return (
    <Tabs
      headerColor="info"
      tabs={[
        {
          tabName: "Nguyên Liệu",
          tabContent: (
            <GridContainer>
              <ToastContainer />
              <GridItem xs={12} sm={12} md={12}>
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
                      onRowClicked={onMatRowClicked} 
                      customStyles={customStyles} />
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          )
        },
        /*{
          tabName: "Bao Bì",
          tabContent: (
            <GridContainer>
              <ToastContainer />
              <GridItem xs={12} sm={12} md={12}>
                <GridItem xs={10} sm={10} md={2}>
                  <Container triggertext="thêm Nguyên liệu" />
                </GridItem>
                <Card>
                  <GridItem xs={10} sm={10} md={2}>
                  </GridItem>
                  <CardBody>
                    <DataTable columns={pakColumns}
                      data={pakData}
                      pagination
                      persistTableHead
                      onRowClicked={onPakRowClicked} />
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          )
        }*/
      ]}
    />

  );

}
