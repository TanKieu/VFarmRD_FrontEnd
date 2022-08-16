/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
//import Tabs from "components/CustomTabs/CustomTabs.js";
//import Tasks from "components/Tasks/Tasks.js";
//import Button from "components/CustomButtons/Button.js";
//import CustomInput from "components/CustomInput/CustomInput.js";
//import AddProduct from "./AddProduct";
import DataTable from "react-data-table-component";
import FilterComponent from "components/Filter/FilterComponent";
import { useHistory } from "react-router-dom";
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
// const divStyle = {
//   marginTop: "2%"
// };

const useStyles = makeStyles(styles);


export default function StaffProductTable() {
  
  const[locationKeys, setLocationKeys] = useState([]);
  const userId = localStorage.getItem("userId");
  const urlRequest = process.env.REACT_APP_SERVER_URL + `/api/products?assigned_user_id=${userId}`;
  const history = useHistory();
  var [isClicked, setIsClicked] = useState(false);
  var [productId, setProductId] = useState();
  var [url,setUrl] = useState("");
  const classes = useStyles();
  // const [compon, setCompon] = useState("");

  var [data, setData] = useState([]);
const token = localStorage.getItem("token");
   const fetchData = () => {
    axios.get(urlRequest, {
    headers: {
      'Conttent-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => {
    if(res.status==200){
      setData(res.data);
    data = res.data.products;
    console.log(res.data);
    console.log(data);
    }
  }).catch((error) => {
    console.log(error);
  });
}

useEffect(() => {
  fetchData();
  return history.listen(location => {
    if (history.action === 'PUSH') {
      setLocationKeys([ location.key ])
    }

    if (history.action === 'POP') {
      if (locationKeys[1] === location.key) {
        // eslint-disable-next-line no-unused-vars
        setLocationKeys(([ _, ...keys ]) => keys)

        // Handle forward event

      } else {
        setLocationKeys((keys) => [ location.key, ...keys ])

        window.location.reload();
        history.push("/staff/product");

      }
    }
  })
}, [locationKeys, ]);


  const [filterText, setFilterText] = React.useState("");
	const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
	const filteredItems = data.filter(
		item => item.product_name && item.product_name.toLowerCase().includes(filterText.toLowerCase()),
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

  const columns = [
    {
      name: 'Mã sản phẩm', 
      selector: row => row.product_code,
      sortable: true,
      cell: row => (<div>{row.product_code}</div>)
    },
    {
      name: 'Tên sản phẩm', 
      selector: row => row.product_name,
      sortable: true,
      cell: row => (<div>{row.product_name}</div>)
    },
    {
      name: 'Yêu cầu', 
      selector: row => row.product_inquiry,
      sortable: true,
      cell: row => (<div>{row.product_inquiry}</div>)
    },
    {
      name: 'Thời gian tạo', 
      selector: row => row.created_time,
      sortable: true,
      cell: row => (<div>{row.created_time}</div>)
    },
  ]

  // const buttonAddClick = () => {
  //   setCompon("addproduct");
  // }
  // const buttonBackClick = () => {
  //   setCompon("back");
  // }
  // if (compon === "addproduct") {
  //   return (
  //     <div style={divStyle} className={classes.cardTitleWhite}>
  //       <Button type="button" color="info" onClick={buttonBackClick}>Trở về</Button>
  //       <AddProduct></AddProduct>
  //     </div>
  //   );
  // }

  const onRowClicked = (row) => {
    setProductId(row.product_id);

    setUrl("/admin/product/detail/" + row.product_id);
    console.log("direct đi " + url);
    console.log(productId);
    setIsClicked(true);
    console.log(isClicked);
    // var productInfo = {
    //   product_id: row.product_id,
    //   product_name: row.product_name,
    //   product_inquiry: row.product_inquiry
    // }
    //  navigate("/admin/product/detail", { replace: true, state: {product : productInfo}});
    
    history.push('/product/detail', {product_info: row.product_id});
  }
  window.onhashchange =  function() {
    window.history.back();
  }
  return (
    <GridContainer>
      <ToastContainer />
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" className={classes.cardTitleWhite} >
            Sản Phẩm
          </CardHeader>
          {/* <Tabs className={classes.cardTitleWhite}
            headerColor="info"
            tabs={[
              {
                tabName: "Đang hoạt động"
              },
              {
                tabName: "Ngừng hoạt động"
              }
            ]}
          /> */}
          {/* </CardHeader> */}
          <CardBody className= {classes.cardTitleWhite}>
            <DataTable columns={columns}
                      data={filteredItems}
                      pagination
                      paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                      subHeader
                      subHeaderComponent={subHeaderComponentMemo}
                      persistTableHead
                      onRowClicked={onRowClicked} />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );

}
