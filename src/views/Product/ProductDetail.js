/* eslint-disable prettier/prettier */
import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
//import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
//import Tabs from "components/CustomTabs/CustomTabs.js";
//import Tasks from "components/Tasks/Tasks.js";
// eslint-disable-next-line no-unused-vars
import Button from "components/CustomButtons/Button.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Info from "components/Typography/Info";
import Muted from "components/Typography/Muted";
import DataTable from "react-data-table-component";
import createReport from "docx-templates";
import hscb from "assets/HSCB Generation.docx";
import { toast, ToastContainer } from "react-toastify";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
import ButtonBack from "components/ButtonBack";


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
export default function ProductDetail() {
    const rdToken = process.env.REACT_APP_RD_TOKEN;
    const location = useLocation();
    const token = localStorage.getItem("token");
    const productId = location.state.product_info;
    const formula = location.state.formula;
    const materialList = location.state.materialList;
    const [productData, setProductData] = useStateWithCallbackLazy("");
    const [clientName, setClientName] = useState("");
    const phaseList = formula.phaseGetResponse;
    // eslint-disable-next-line no-unused-vars
    const [supplier, setSupplier] = useState([]);


    // eslint-disable-next-line no-unused-vars
    const [buttonCreateFormulaStatus, setButtonCreateFormulaStatus] = useStateWithCallbackLazy(true);
    console.log(productId);
    console.log(materialList);
    const urlProduct = process.env.REACT_APP_SERVER_URL +`/api/products/${productId}`
    const urlSupplier = process.env.REACT_APP_WAREHOUSE + "/api/v1/supplier/all";    
    const fetchData = async () => {
      axios
      .get(urlSupplier, {
        headers: {
          "Conttent-Type": "application/json",
          "rd-token": `${rdToken}`,
        },
      })
      .then((res) => {
        setSupplier(res.data.suppliers);
      })
      .catch((error) => {
        console.log(error);
      });

      axios.get(urlProduct, {
        headers:{
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setProductData(res.data, (currentResponse) => {
          console.log(currentResponse);
          const rdToken = process.env.REACT_APP_RD_TOKEN;
            const urlSupplier = process.env.REACT_APP_WAREHOUSE + `/api/v1/customer/${currentResponse.client_id}`; 
            axios.get(urlSupplier,{
              headers:{
                "Conttent-Type": "application/json",
                "rd-token": `${rdToken}`,
              },
            })
            .then((res) => {
              if(res.status == 200)
              setClientName(res.data.customer.name);
            }).catch((error) => {
              console.log(error);
            })
          setProductData(currentResponse);
        });
        console.log(productData);
      })
      .catch((error) => {
        console.log(error);
      });

    }

    const exportFormula = () => {
      const jsonObject = converToBOMJson();
      console.log(formula);
      const bomUrl = process.env.REACT_APP_WAREHOUSE + "/api/v1/batchsheet";
      console.log(JSON.stringify(jsonObject));
      const noti = toast("Đang xử lí...");
      fetch(bomUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "rd-token": `${rdToken}`,
        },
        body: JSON.stringify(jsonObject),
      })
        .then((response) => {
          if (!response.ok) throw new Error(response.status);
          else {
            console.log(response);
            toast.update(noti, {
              render: "Xuất công thức thành công",
              type: "success",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          toast.update(noti, {
            render: error.toString(),
            type: "error",
            isLoading: false,
          });
        });
    }

    const converToBOMJson = () => {
      const materialData = [];
      phaseList.map((phase, index) => {
        var mixed;
        switch (index) {
          case 0:
            mixed = "A"
            break;
          case 1:
            mixed = "B"
            break;
          case 2:
            mixed = "C"
            break;
          case 3:
            mixed = "D"
            break;
          case 4:
            mixed = "E"
            break;
        }
        phase.materialOfPhaseGetResponse.forEach(element => {
          var supplier = converSuppIdToSupp(convertMaterIDToMater(element.material_id).supplier);
          console.log(supplier);
          if(supplier == undefined) {
            supplier = {
              name: null,
            }
          } else if (supplier.name == undefined){
            supplier.name = null;
          }
          var price =  
          convertMaterIDToMater(element.material_id).unitPrice;
          if (convertMaterIDToMater(element.material_id).unit != "Kg"){
            price *=1000;
          }
          const materialDetail = {
            mixed,
            "code": convertMaterIDToMater(element.material_id).code,
            "tradeName": convertMaterIDToMater(element.material_id).tradeName,
            "rate": element.material_percent,
            "name": convertMaterIDToMater(element.material_id).name,
            "inciName": convertMaterIDToMater(element.material_id).inciName,
            "supplierName": supplier.name,
            "function": element.material_description,
            "cost_kg": price,
            "cost_formula": element.material_cost,
          }
          materialData.push(materialDetail);
        });
      });
  
      const qualityTracking = {};
      formula.listTestResponse.map((test) => {
        console.log(test.test_content);
        const content = test.test_content;
        const expected = test.test_expect;
        qualityTracking[content.toString()] = expected;
      });
      console.log(qualityTracking);
      const productCode = productData.product_code;
      const brand = productData.brand_name;
      const volume = productData.product_weight;
      const capacity = productData.volume;
      const formulaVersion = formula.formula_version;
      const d = productData.density;
      const tolerance = parseFloat(productData.tolerance/100);
      const materialNormLoss = productData.material_norm_loss;
      const jsonOject = {
        productCode,
        brand,
        volume,
        capacity,
        formulaVersion,
        d,
        tolerance,
        materialNormLoss,
        qualityTracking,
        materialData,
      }
      return jsonOject;
    }

    const convertMaterialtoJsonData = () => {
      const materials = [];
      phaseList.forEach((phase) => {
        phase.materialOfPhaseGetResponse.forEach((mater) => {
          const material = {
            inciName: convertMaterIDToMater(mater.material_id).inciName,
            percent: mater.material_percent,
          }
          materials.push(material);
        }
        )
      });
      materials.sort((a,b) => (a.percent < b.percent ? 1 : -1));
      materials.forEach((material, index) => {
        material.Index = index;
      });
      return materials;
    }

    const downloadURL = (data, fileName) => {
      const a = document.createElement('a');
      a.href= data;
      a.download = fileName;
      document.body.appendChild(a);
      a.style = 'display: none';
      a.click();
      a.remove();
    }

    const downloadBlob = (data, fileName, mimeType) => {
      const blob = new Blob([data], {
        type: mimeType,
      });
      const url = window.URL.createObjectURL(blob);
      downloadURL(url, fileName, mimeType);
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    }

    const generateHSCB = async() => {
      const template = await fetch(hscb).then(res => res.arrayBuffer());
      const report = await createReport({
        template,
        data: {
          materials: convertMaterialtoJsonData(),
        },
      });
      downloadBlob(
        report,
        'HSCB Generation.docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
    }
    useEffect(() =>{
      fetchData();
      convertMaterialtoJsonData();
    }, []);
    // eslint-disable-next-line no-unused-vars
    const history = useHistory();
    // eslint-disable-next-line no-unused-vars
    const classes = useStyles();

    const convertMaterIDToMater = (materialId) => {
      return materialList.find((e) => e._id == materialId);
    }
    const converSuppIdToSupp = (supplierId) => {
      return supplier.find((e) => e._id == supplierId);
    }

    const columns = [
      {
        name: "Mã nguyên liệu",
        selector: (row) => convertMaterIDToMater(row.material_id).code,
        sortable: true,
        cell: (row) => (
          <div>{convertMaterIDToMater(row.material_id).code}</div>
        )
      },
      {
        name: "Tên nguyên liệu",
        selector: (row) => convertMaterIDToMater(row.material_id).name,
        sortable: true,
        cell: (row) => (
          <div>{convertMaterIDToMater(row.material_id).name}</div>
        )
      },
      {
        name: "Tên Inci",
        selector: (row) => convertMaterIDToMater(row.material_id).inciName,
        sortable: true,
        cell: (row) => (
          <div>{convertMaterIDToMater(row.material_id).inciName}</div>
        )
      },
      {
        name: "Phần trăm",
        selector: (row) => row.material_percent,
        sortable: true,
        cell: (row) => (
          <div>{row.material_percent}%</div>
        )
      },
      {
        name: "Khối lượng",
        selector: (row) => row.material_weight,
        sortable: true,
        cell: (row) => (
          <div>{row.material_weight} g</div>
        )
      },
      {
        name: "Chi phí ngày tạo",
        selector: (row) => row.material_cost,
        sortable: true,
        cell: (row) => (
          <div>{parseFloat(row.material_cost).toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</div>
        )
      },
      {
        name: "Công dụng",
        selector: (row) => row.material_description,
        sortable: true,
        cell: (row) => (
          <div>{row.material_description.toString()}</div>
        )
      },
  
    ]
    
    return (
      <><ToastContainer />
      <div className="navbar1">
        <AdminNavbarLinks />
      </div>
      <ButtonBack />
      <div className="product1DetailInfor1">
        <GridContainer>
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardHeader color="info" className={classes.cardTitleWhite}>
                Thông Tin Sản Phẩm
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info>Tên sản phẩm</Info>
                      <b>{productData.product_name}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <>
                      <Info>Mã sản phẩm</Info>
                      <b>{productData.product_code}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <>
                      <Info>Thương hiệu</Info>
                      <b>{productData.brand_name}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <>
                      <Info>Khối lượng</Info>
                      <b>{productData.volume} g</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <>
                      <Info>Thể tích</Info>
                      <b>{productData.volume}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <>
                      <Info>d</Info>
                      <b>{productData.density}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <>
                      <Info>Độ hao hụt</Info>
                      <b>{productData.tolerance}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <>
                      <Info>Hao hụt nguyên liệu</Info>
                      <b>{productData.material_norm_loss}</b>
                    </>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={2}>
                    <>
                      <Info>Yêu cầu sản phẩm</Info>
                      <b>{productData.product_inquiry}</b>
                    </>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <>
                      <Info>Ngày tạo</Info>
                      <b>{new Date(productData.created_time).toLocaleDateString("en-US")}</b>
                    </>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <>
                      <Info>Khách hàng</Info>
                      <b>{clientName}</b>
                    </>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={2}>

                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>

                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>

                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={10} sm={10} md={10}>
            <Button type="button" color="info" onClick={() => { const BOMJSON = converToBOMJson(); console.log(BOMJSON); history.push("/formula/BOM", { formula: formula, formulaBOMJSON: BOMJSON, project: productData }); } }>Hiện BOM</Button>
            <Button type="button" color="info" onClick={exportFormula}>Xuất BOM</Button>
            <Button type="button" color="info" onClick={generateHSCB}>Tạo HSCB</Button>
            <Card>
              <CardHeader color="info" className={classes.cardTitleWhite}>
                Chi tiết công thức
              </CardHeader>
              <GridItem>
                <GridContainer>
                  <GridItem xs={10} sm={10} md={2}>
                    <Info>Phiên bản</Info>
                    <b>{formula.formula_version}</b>
                  </GridItem>
                  <GridItem xs={10} sm={10} md={2}>
                    <Info>Khối lượng</Info>
                    <b>{formula.formula_weight} g</b>
                  </GridItem>
                  <GridItem xs={10} sm={10} md={2}>
                    <Info>d</Info>
                    <b>{formula.density} g/ml</b>
                  </GridItem>
                  <GridItem xs={10} sm={10} md={2}>
                    <Info>Thể tích</Info>
                    <b>{formula.volume} ml</b>
                  </GridItem>
                  <GridItem xs={10} sm={10} md={2}>
                    <Info>Hao hụt</Info>
                    <b>{formula.loss} %</b>
                  </GridItem>
                  <GridItem xs={10} sm={10} md={2}>
                    <Info>Chi phí dự tính</Info>
                    <b>{parseFloat(formula.formula_cost).toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</b>
                  </GridItem>
                  <GridItem xs={10} sm={10} md={2}>
                    <Info>Người tạo</Info>
                    <b>{formula.user_name}</b>
                  </GridItem>
                  {formula.description != null &&
                    <GridItem xs={10} sm={10} md={7}>
                      <Info>Ghi chú thay đổi</Info>
                      <b>{formula.description}</b>
                    </GridItem>}
                </GridContainer>
              </GridItem>
              <CardBody>
                {phaseList.map((p) => {
                  const data = p.materialOfPhaseGetResponse;
                  return (
                    <>
                      <GridItem>
                        <Card>
                          <CardHeader color="info" className={classes.cardTitleWhite}>
                            <b>Pha {p.phase_name}</b>
                          </CardHeader>
                        </Card>
                        <CardBody>
                          <Info><b>Mô tả</b></Info>
                          <Muted>{p.phase_description}</Muted>
                          <DataTable
                            columns={columns}
                            data={data}
                            // optionally, a hook to reset pagination to page 1
                            subHeader
                            persistTableHead />
                        </CardBody>
                      </GridItem>
                    </>
                  );
                })}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div></>
        
    );
}