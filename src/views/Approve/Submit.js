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
import DataTable from "react-data-table-component";
import axios from "axios";

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
export default function ApproveFormula() {
  const classes = useStyles();

  //const urlGetFormula = process.env.REACT_APP_SERVER_URL + `/api/formulas?product_id=${productId}&formula_status=on20%process`;

  const [locationKeys, setLocationKeys] = useState([]);
  const history = useHistory();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  //const userId = localStorage.getItem("userId");
  // eslint-disable-next-line no-unused-vars
  var [data, setData] = useState([])

  //const filteredItems = data.filter(
  // item => item.product_name && item.product_name.toLowerCase().includes(filterText.toLowerCase()),
  //);
  var [dataSubmit, setDataSubmit] = useState([]);
  const [filterSubmit, setFilterSubmit] = React.useState("");
  const [resetSubmitPaginationToggle, setSubmitResetPaginationToggle] = React.useState(false);
  const filteredSubmit = dataSubmit.filter(
    item => item.project_name && item.project_name.toLowerCase().includes(filterSubmit.toLowerCase()),
  );

  const fetchData = () => {
    const urlRequest = process.env.REACT_APP_SERVER_URL + `/api/projects/have-formula-status?formula_status=on%20process&user_id=${userId}`;
    axios.get(urlRequest, {
      headers: {
        "Conttent-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status == 200) {
          setDataSubmit(res.data);
          dataSubmit = res.data.projects;
          console.log(res.data);
          console.log(data);
        }
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
  }, [setData]);

  const subSubmitHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterSubmit) {
        setSubmitResetPaginationToggle(!resetSubmitPaginationToggle);
        setFilterSubmit('');
      }
    };

    return (
      <FilterComponent onFilter={e => setFilterSubmit(e.target.value)} onClear={handleClear} filterSubmit={filterSubmit} />
    );
  }, [filterSubmit, resetSubmitPaginationToggle]);


  const onRowSubmitClicked = (row) => {
    history.push("/submit/formula", { project_info: row.project_id, project_name: row.project_name });
  }
  window.onhashchange = function () {
    window.history.back();
  }


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

  return (
    <GridContainer>
      <ToastContainer />
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" className={classes.cardTitleWhite} >
            Công Thức chờ nộp
          </CardHeader>
          <CardBody className={classes.cardTitleWhite}>
            <DataTable columns={columns}
              data={filteredSubmit}
              pagination
              paginationResetDefaultPage={resetSubmitPaginationToggle} // optionally, a hook to reset pagination to page 1
              subHeader
              subHeaderComponent={subSubmitHeaderComponentMemo}
              persistTableHead
              onRowClicked={onRowSubmitClicked} />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
