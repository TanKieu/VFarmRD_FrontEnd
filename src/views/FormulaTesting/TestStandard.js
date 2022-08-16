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
//import Container from "components/Container/ClientModalContainer";
// import CustomInput from "components/CustomInput/CustomInput.js";
import { useHistory } from "react-router-dom";
import FilterComponent from "components/Filter/FilterComponent";
import { ToastContainer } from "react-toastify";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import axios from "axios";
import Button from "components/CustomButtons/Button.js";

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

export default function StandardTable() {
  const classes = useStyles();
  const token = localStorage.getItem("token");
  const urlTestSet = process.env.REACT_APP_SERVER_URL +`/api/teststandardsets`;
  const [testSetList, setTestSetList] = useStateWithCallbackLazy([]);



  const [locationKeys, setLocationKeys] = useState([]);
  const history = useHistory();

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
        name: "STT",
        selector: (row) => row.teststandardset_id,
        sortable: true,
        cell: (row, index) => (
            <div>{index + 1}</div>
        )
    },
    {
        name: "Tên bộ kiểm tra",
        selector: (row) => row.teststandardset_name,
        sortable: true,
        cell: (row) => (
            <div>{row.teststandardset_name}</div>
        )
    },
    {
        name: "Mô tả",
        selector: (row) => row.description,
        sortable: true,
        cell: (row) => (
            <div>{row.description}</div>
        )
    }
  ];

  const fetchData = async () => {
    await axios
      .get(urlTestSet, {
        headers: {
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if(res.status == 200){
            console.log(res.data);
            setTestSetList(
                res.data
            );
        } else {
            throw new Error(res.status);
        }
      }).catch((error) => {
        console.log(error);
      })
  };

  const onRowClicked = (row) => {
    const standard_info = {
      teststandardset_id: row.teststandardset_id,
      teststandardset_name: row.teststandardset_name,
      description: row.description
    }
    history.push("/test/standard/detail", {standard: standard_info});
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
  const filteredItems = testSetList.filter(
    testSet => testSet.teststandardset_name && testSet.teststandardset_name.toLowerCase().includes(filterText.toLowerCase()),
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



//   const onRowClicked = (row) => {
//     history.push('/admin/other/client/detail', { client_id: row._id });
//   }
  window.onhashchange = function () {
    window.history.back();
  }
    return (
      <GridContainer>
        <ToastContainer />
        <GridItem xs={12} sm={12} md={12}>
          <GridItem xs={10} sm={10} md={2}>
            <div>
              <Button type="button" color="info" onClick={()=> history.push("/test/standard/create")}>Tạo bộ tiêu chuẩn</Button>
            </div>
          </GridItem>
          <Card>
            <CardHeader color="info" className={classes.cardTitleWhite}>
              Bộ tiêu chuẩn chất lượng
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
                customStyles={customStyles}
                />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
}