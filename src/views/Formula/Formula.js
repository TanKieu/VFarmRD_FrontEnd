/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
// import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
//import Tabs from "components/CustomTabs/CustomTabs.js";
//import Tasks from "components/Tasks/Tasks.js";
import FilterComponent from "components/Filter/FilterComponent";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import DataTable from "react-data-table-component";

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

export default function FormulaTable() {
  const classes = useStyles();
  const [locationKeys, setLocationKeys] = useState([]);
  const history = useHistory();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const urlGetFormula = process.env.REACT_APP_SERVER_URL + `/api/formulas/users/${userId}`;


  // eslint-disable-next-line no-unused-vars
  var [data, setData] = useState([])

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const filteredItems = data.filter(
    item => item.project_name && item.project_name.toLowerCase().includes(filterText.toLowerCase()),
  );
  const fetchData = () => {
    console.log(urlGetFormula);
    axios.get(urlGetFormula, {
      headers: {
        'Conttent-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
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
          history.push("/formula");

        }
      }
    })
  }, [locationKeys,]);

  const onRowClicked = (row) => {

    // setUrl("/formula/detail/" + row.formula_version);
    // console.log("direct đi " + url);
    // var productInfo = {
    //   product_id: row.product_id,
    //   product_name: row.product_name,
    //   product_inquiry: row.product_inquiry
    // }
    //  navigate("/admin/product/detail", { replace: true, state: {product : productInfo}});
    history.push("/formula/detail", { formula_id: row.formula_id, formula_version: row.formula_version, formula_status: row.formula_status, projectID: row.project_id });
  }
  window.onhashchange = function () {
    window.history.back();
  }

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
      name: 'Phiên bản',
      selector: row => row.formula_version,
      sortable: true,
      cell: row => (<div>{row.formula_version}</div>)
    },
    {
      name: 'Dự án',
      selector: row => row.project_name,
      sortable: true,
      cell: row => (<div>{row.project_name}</div>)
    },
    {
      name: 'Ngày tạo',
      selector: row => row.created_time,
      sortable: true,
      cell: row => (<div>{new Date(row.created_time).toLocaleDateString("en-SG")}</div>)
    },
    {
      name: 'Trạng thái',
      selector: row => row.formula_status,
      sortable: true,
      cell: row => (<div>{row.formula_status}</div>)
    },
  ]

  return (
    <GridContainer>
      <ToastContainer />
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" className={classes.cardTitleWhite}>
            Công thức
          </CardHeader>

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
}
