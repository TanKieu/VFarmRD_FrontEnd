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
import Container from "components/Container/CategoryModalContainer";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import FilterComponent from "components/Filter/FilterComponent";
//import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";



export default function ToolCategories() {
  const token = localStorage.getItem("token");
  const urlCategory = process.env.REACT_APP_SERVER_URL + "/api/toolcategories/";
  //const urlCategory = process.env.REACT_APP_SERVER_URL + "/api/toolcategories/";

  const [category, setCategory] = useState([]);
  const [locationKeys, setLocationKeys] = useState([]);
  const history = useHistory();

  const [isClicked, setIsClicked] = useState(false);
  const [categoryId, setCategoryId] = useState();
  const [url, setUrl] = useState("");
  //const [cateId, setCateId] = useState();

  const fetchData = () => {
    axios.get(urlCategory, {
      headers: {
        'Conttent-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then((res) => {
        if (res.status == 200)
          setCategory(res.data);
        console.log(category);
      }).catch((error) => {
        console.log(error);
      })
    /*axios.get(urlCategory, {
      headers: {
        'Conttent-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then((res) => {
        setCateOptions(
          res.data.map((item) => {
            var option = {
              value: item.toolcategory_id,
              label: item.toolcategory_name,
            };
            return option;
          })
        );
      }).catch((error) => {
        console.log(error);
      })*/
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
  const filteredItems = category.filter(
    category => category.toolcategory_name && category.toolcategory_name.toLowerCase().includes(filterText.toLowerCase()),
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
      selector: row => row.toolcategory_name,
      sortable: true,
      cell: (row ,index) => (<div>{index+1}</div>)
    },
    {
      name: 'Tên loại công cụ',
      selector: row => row.toolcategory_name,
      sortable: true,
      cell: row => (<div>{row.toolcategory_name}</div>)
    },
    {
      name: 'Chức năng',
      selector: row => row.description,
      sortable: true,
      cell: row => (<div>{row.description}</div>)
    },
  ]

  const onRowClicked = (row) => {
    setCategoryId(row._id);
    console.log(categoryId);
    setUrl("/admin/other/category/update/" + row.toolcategory_id);
    console.log("direct đi " + url);
    setIsClicked(true);
    console.log(isClicked);

    history.push('/other/category/update/', { toolcategory_id: row.toolcategory_id });
  }
  window.onhashchange = function () {
    window.history.back();
  }
  //const classes = useStyles();
  return (
    <GridContainer>
      <ToastContainer />
      <GridItem xs={12} sm={12} md={12}>
        <GridItem xs={10} sm={10} md={2}>
          <div>
            <Container triggertext="thêm công cụ" />
          </div>
        </GridItem>
        <Card>
          <CardHeader color="info" >
            Công cụ
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
              customStyles={customStyles} />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}