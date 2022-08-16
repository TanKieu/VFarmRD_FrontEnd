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
import Container from "components/Container/ToolModalContainer";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import FilterComponent from "components/Filter/FilterComponent";
//import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";


export default function ToolTable() {
  const token = localStorage.getItem("token");
  const urlTool = process.env.REACT_APP_SERVER_URL + "/api/tools/";
  //const urlCategory = process.env.REACT_APP_SERVER_URL + "/api/toolcategories/";

  const [tool, setTool] = useState([]);
  const [locationKeys, setLocationKeys] = useState([]);
  const history = useHistory();

  const [isClicked, setIsClicked] = useState(false);
  const [toolId, setToolId] = useState();
  const [url, setUrl] = useState("");
  //const [cateId, setCateId] = useState();

  const fetchData = () => {
    axios.get(urlTool, {
      headers: {
        'Conttent-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then((res) => {
        if (res.status == 200)
          setTool(res.data);
        console.log(tool);
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
  const filteredItems = tool.filter(
    tool => tool.tool_name && tool.tool_name.toLowerCase().includes(filterText.toLowerCase()),
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
      name: 'Tên công cụ',
      selector: row => row.tool_name,
      sortable: true,
      cell: row => (<div>{row.tool_name}</div>)
    },
    {
      name: 'Mô tả',
      selector: row => row.description,
      sortable: true,
      cell: row => (<div>{row.description}</div>)
    },
    {
      name: 'Loại Công cụ',
      selector: row => row.toolcategory_name,
      sortable: true,
      cell: row => (<div>{row.toolcategory_name}</div>)
    },
    {
      name: 'Thông số',
      selector: row => row.parameter,
      sortable: true,
      cell: row => (<div>{row.parameter}</div>)
    },
    {
      name: 'Đơn vị tính',
      selector: row => row.unit,
      sortable: true,
      cell: row => (<div>{row.unit}</div>)
    },
  ]

  const onRowClicked = (row) => {
    setToolId(row._id);
    console.log(toolId);
    setUrl("/admin/other/tool/detail/" + row.tool_id);
    console.log("direct đi " + url);
    setIsClicked(true);
    console.log(isClicked);

    history.push('/other/tool/update/', { tool_id: row.tool_id });
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