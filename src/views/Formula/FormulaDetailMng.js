/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
// import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { useHistory, useLocation } from "react-router-dom";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import axios from "axios";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import Muted from "components/Typography/Muted";
import Info from "components/Typography/Info";
import Button from "components/CustomButtons/Button.js";
import ProductContainer from "components/Container/ProductModalContainer";
import { useState } from "react";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
import ReactLoading from "react-loading";
import "components/Modal/matModal.css";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import ButtonBack from "components/ButtonBack";



//import Tabs from "components/CustomTabs/CustomTabs.js";
//import Tasks from "components/Tasks/Tasks.js";
// import CustomInput from "components/CustomInput/CustomInput.js";

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

export default function FormulaDetailMng() {
  const location = useLocation();
  var [matData, setMatData] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const formula_id = location.state.formula_id;
  const formula_status = location.state.formula_status;
  const rdToken = process.env.REACT_APP_RD_TOKEN;
  const [formula, setFormula] = useStateWithCallbackLazy({});
  const history = useHistory();
  const [phaseList, setPhaseList] = useStateWithCallbackLazy([]);
  const [materialList, setMaterialList] = useStateWithCallbackLazy([]);
  const urlMaterialRequest = process.env.REACT_APP_WAREHOUSE + "/api/v1/material";
  const urlFormulaRequest = process.env.REACT_APP_SERVER_URL + `/api/formulas/${formula_id}`;
  const [testTask, setTestTask] = useStateWithCallbackLazy([]);
  const projectData = location.state.project;
  const [validateStatusButton, setValidateStatusButton] = useStateWithCallbackLazy(false);
  const [updateStatus, setUpdateStatus] = useStateWithCallbackLazy(true);
  // eslint-disable-next-line no-unused-vars
  const [updateButtonText, setUpdateButtonText] = useStateWithCallbackLazy("T???o phi??n b???n m???i");
  const [productList, setProductList] = useState([]);
  const [createProductStatus, setCreateProductStatus] = useState(false);
  const client = useSelector((state) => state.sendNoti);
  const [testStatus, setTestStatus] = useStateWithCallbackLazy();
  const checkStatus = () => {
    if (formula_status == "approved") {
      setValidateStatusButton(true);
      setCreateProductStatus(true);
      setUpdateStatus(false);

    }
    if (formula_status == "on process" || formula_status == "pending" || formula_status == "on progress") {
      setUpdateButtonText("Ch???nh s???a");
      setValidateStatusButton(false);
    }
  }
  const onRowClicked = (row) => {
    history.push('/product/detail', { product_info: row.product_id, formula: formula, materialList: materialList });
  }

  // const convertListTool = (phase) => {
  //   const listTools = [];
  //   phase.listToolInPhaseResponse.forEach(tool => {
  //     listTools.push(tool.toolResponse.tool_id);
  //   });
  //   return listTools;
  // }
  // const createObjectJsonForUpdate = () => {
  //   const phaseCreate = [];
  //   phaseList.map((phaseMap, index) => {
  //     const materialList = [];
  //     phaseMap.materialOfPhaseGetResponse.map((material) => {
  //       const materialDetail = {
  //         mop_id: material.mop_id,
  //         material_id: material.material_id,
  //         material_cost: material.material_cost,
  //         material_weight: material.material_weight,
  //         material_percent: material.material_percent,
  //         material_description: material.material_description,
  //       };
  //       materialList.push(materialDetail);
  //     });
  //     const currentphase = {
  //       phase_id: phaseMap.phase_id,
  //       phase_index: index + 1,
  //       phase_description: phaseMap.phase_description,
  //       materialOfPhaseUpdateRequest: materialList,
  //       listTool_id: convertListTool(phaseMap),
  //     };
  //     phaseCreate.push(currentphase);
  //   });
  //   const jsonObject = {
  //     formula_cost: formula.formula_cost,
  //     phaseUpdateRequest: phaseCreate,
  //     formula_weight: formula.formula_weight,
  //     product_weight: formula.product_weight,
  //     density: formula.density,
  //     volume: formula.volume,
  //     loss: formula.loss,
  //     description: formula.description,
  //   };
  //   return jsonObject;
  // };

  // const updateFormula = () => {
  //   const updateUrl = process.env.REACT_APP_SERVER_URL + `/api/formulas/${formula_id}`;
  //   const noti = toast("Please wait...");
  //   fetch(updateUrl, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify(createObjectJsonForUpdate()),
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         toast.update(noti, {
  //           render: "C???p nh???t c??ng th???c th??nh c??ng",
  //           type: "success",
  //         });
  //       }
  //       else {
  //           return response;
  //       } 
  //     }).then(res => {
  //       if(res != undefined){
  //       toast.update(noti, {
  //         render: "???? c?? l???i x???y ra",
  //         type: "error",
  //       });
  //       }
  //     })
  // }

  const columns = [
    {
      name: "M?? nguy??n li???u",
      selector: (row) => convertMaterIDToMater(row.material_id).code,
      sortable: true,
      cell: (row) => (
        <div>{convertMaterIDToMater(row.material_id).code}</div>
      )
    },
    {
      name: "T??n nguy??n li???u",
      selector: (row) => convertMaterIDToMater(row.material_id).name,
      sortable: true,
      cell: (row) => (
        <div>{convertMaterIDToMater(row.material_id).name}</div>
      )
    },
    {
      name: "T??n Inci",
      selector: (row) => convertMaterIDToMater(row.material_id).inciName,
      sortable: true,
      cell: (row) => (
        <div>{convertMaterIDToMater(row.material_id).inciName}</div>
      )
    },
    {
      name: "Ph???n tr??m",
      selector: (row) => row.material_percent,
      sortable: true,
      cell: (row) => (
        <div>{row.material_percent}%</div>
      )
    },
    {
      name: "Kh???i l?????ng",
      selector: (row) => row.material_weight,
      sortable: true,
      cell: (row) => (
        <div>{row.material_weight} g</div>
      )
    },
    {
      name: "Chi ph?? ng??y t???o",
      selector: (row) => row.material_cost,
      sortable: true,
      cell: (row) => (
        <div>{parseFloat(row.material_cost).toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</div>
      )
    },
    {
      name: "C??ng d???ng",
      selector: (row) => row.material_description,
      sortable: true,
      cell: (row) => (
        <div>{row.material_description}</div>
      )
    },

  ]

  const testColumns = [
    {
      name: "STT",
      selector: (row) => row.test_id,
      sortable: true,
      cell: (row, index) => (
        <div>{index + 1}</div>
      )
    },
    {
      name: "N???i dung",
      selector: (row) => row.test_content,
      sortable: true,
      cell: (row) => (
        <div>{row.test_content}</div>
      )
    },
    {
      name: "K?? v???ng",
      selector: (row) => row.test_expect,
      sortable: true,
      cell: (row) => (
        <div>{row.test_expect}</div>
      )
    },
    {
      name: "K???t qu???",
      selector: (row) => row.test_result,
      sortable: true,
      cell: (row) => {
        if (row.test_result == false)
          return (
            <div>Ch??a ?????t</div>
          ); else {
          return (
            <div>?????t</div>
          )
        }
      }
    },
    {
      name: "Ch???ng nh???n",
      selector: (row) => row.file_id,
      sortable: true,
      cell: (row) => {
        if (row.fileResponse != null) {
          return <div>
            <a href={row.fileResponse.url} target="_blank" rel="noreferrer">{row.fileResponse.name}</a>
          </div>
        } else {
          return <div>Ch??a c?? file ch???ng nh???n</div>
        }
      }

    },
  ]

  const productColumns = [
    {
      name: 'M?? s???n ph???m',
      selector: row => row.product_code,
      sortable: true,
      cell: row => (<div>{row.product_code}</div>)
    },
    {
      name: 'T??n s???n ph???m',
      selector: row => row.product_name,
      sortable: true,
      cell: row => (<div>{row.product_name}</div>)
    },
    {
      name: 'Y??u c???u',
      selector: row => row.product_inquiry,
      sortable: true,
      cell: row => (<div>{row.product_inquiry}</div>)
    },
    {
      name: 'Th???i gian t???o',
      selector: row => row.created_time,
      sortable: true,
      cell: row => (<div>{new Date(row.created_time).toLocaleDateString("en-US")}</div>)
    },
  ]

  const fetchData = async () => {
    await axios
      .get(urlMaterialRequest, {
        headers: {
          "Conttent-Type": "application/json",
          "rd-token": `${rdToken}`,
        },
      }).then((res) => {
        setMaterialList(
          res.data.materialList, () => {
            console.log(res.data.materialList);
            console.log(materialList);
          }
        )
      });
    await axios.get(urlFormulaRequest, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    }).then((res) => {
      var obj = res.data;
      obj.formula_id = formula_id;
      setFormula(obj);
      setPhaseList(res.data.phaseGetResponse);
      setTestStatus(res.data.test_status);
      setTestTask(res.data.listTestResponse, () => {
        console.log(res.data);
      })
    });

    const productURL = process.env.REACT_APP_SERVER_URL + `/api/products/formulas/${formula_id}`;
    await axios.get(productURL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    }).then((res) => {
      if (res.status == 200) {
        setProductList(res.data);
      }
    }).catch((error) => {
      console.log(error);
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }

  useEffect(() => {
    checkStatus();
    fetchData();
    // converToBOMJson();
  }, []);

  // const onSubmitFormula = () => {
  //   var formulaVersion = formula.formula_version;
  //   var project_name = projectData.project_name;
  //   const urlFormulaSubmit = process.env.REACT_APP_SERVER_URL + `/api/formulas/${formula_id}/status?status=pending`;
  //   const noti = toast("Vui l??ng ?????i ...");
  //   fetch(urlFormulaSubmit, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((response) => {
  //       console.log(response);
  //       if (!response.ok) throw new Error(response.status);
  //       else {
  //         toast.update(noti, {
  //           render: "N???p C??ng Th???c Th??nh C??ng",
  //           type: "success",
  //         });
  //         client.send(
  //           JSON.stringify({
  //             type: "noti",
  //             message: `C??ng th???c version : ${formulaVersion} c???a d??? ??n  + ${project_name} + ??ang ch??? duy???t`,
  //             assignedId: formula.user_id,
  //           })
  //         );
  //         setTimeout(() => {
  //           history.back();
  //         }, 500);
  //         return response.status;
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       toast.update(noti, {
  //         render: error.toString(),
  //         type: "error",
  //         isLoading: true,
  //       });
  //     });
  // };

  const convertMaterIDToMater = (materialId) => {
    return materialList.find((e) => e._id == materialId);
  }

  const hideModal = () => {
    setShow(false);
  };

  const onMatRowClicked = (row) => {
    setShow(true);
    var id = row.material_id;
    const urlMaterialRequest = process.env.REACT_APP_WAREHOUSE + "/api/v1/material/";
    axios
      .get(urlMaterialRequest + id, {
        headers: {
          "Content-Type": "application/json",
          "rd-token": `${rdToken}`,
        },
      })
      .then((res) => {
        setMatData(res.data.material);
      })
      .catch((error) => {
        console.log(error);
      }
      );
  }

  const classes = useStyles();
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
      <ToastContainer />
      <div className="navbar1">
        <AdminNavbarLinks />
      </div>
      <ButtonBack />
      <div className="formula">
        <GridContainer>
          <div style={{ paddingLeft: "15%" }}>
            <GridContainer>
              <GridItem>
                <Card>
                  <CardHeader color="info" className={classes.cardTitleWhite}>
                    Th??ng Tin D??? ??n
                  </CardHeader>
                  <CardBody>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3}>
                        <>
                          <Info>T??n d??? ??n</Info>
                          <b>{projectData.project_name}</b>
                        </>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={2}>
                        <>
                          <Info>M?? d??? ??n</Info>
                          <b>{projectData.project_code}</b>
                        </>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={2}>
                        <>
                          <Info>Kh???i l?????ng d??? t??nh</Info>
                          <b>{projectData.estimated_weight} g</b>
                        </>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={2}>
                        <>
                          <Info>Y??u c???u s???n ph???m</Info>
                          <b>{projectData.requirement}</b>
                        </>
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3} >
                        <>
                          <Info>Ng??y t???o</Info>
                          <b>{new Date(projectData.created_time).toLocaleDateString("en-US")}</b>
                        </>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3} >
                        <>
                          <Info>Ng??y ph???i ho??n th??nh</Info>
                          <b>{new Date(projectData.complete_date).toLocaleDateString("en-US")}</b>
                        </>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={2}>
                        <>
                          <Info>Kh??ch h??ng</Info>
                          <b>{location.state.clientName}</b>
                        </>
                      </GridItem>

                      <GridItem xs={12} sm={12} md={2}>

                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3} >
                        <>
                          <Info>Ng?????i t???o</Info>
                          <b>{projectData.created_user_name}</b>
                        </>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        <>
                          <Info>Nh??n vi??n ph??? tr??ch</Info>
                          <b>{projectData.assigned_user_name}</b>
                        </>
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          <GridItem xs={12} sm={12} md={12}>
            <Button type="button" color="info" onClick={() => { history.push("/formula/compare", { project_id: formula.project_id }); }}>So s??nh</Button>
            {/* <Button type="button" disabled={!updateStatus} color="info" onClick={() => { history.push("/formula/update", { formula: formula, status: "update", formula_id: formula_id }) }}>Ch???nh s???a</Button>
            <Button type="button" color="info" onClick={() => { history.push("/formula/update", { formula: formula, status: "upgrade", formula_id: formula_id }) }}>T???o phi??n b???n m???i</Button>
            <Button type="button" color="info" onClick={onSubmitFormula} disabled={!(formula_status == "on process" && testStatus == "Passed!")} >N???p c??ng th???c</Button> */}
            <div className="rightButton">
              {(formula.listTestResponse != undefined && formula.listTestResponse.length > 0) ?
                <Button type="button" color="info" onClick={() => { history.push("/testTask/update", { formula_id: formula_id, testTask: testTask }); }}>Ch???nh s???a ti??u chu???n</Button>
                :
                <Button type="button" color="info" onClick={() => { history.push("/testTask/create", { formula_id: formula_id }); }}>T???o ki???m tra ti??u chu???n</Button>
              }
            </div>
          </GridItem>
          <GridItem xs={10} sm={10} md={8}>
            <Card>
              <CardHeader color="info" className={classes.cardTitleWhite}>
                Chi ti???t c??ng th???c
              </CardHeader>
              <GridItem>
                <GridContainer>
                  <GridItem xs={10} sm={10} md={2}>
                    <Info>Phi??n b???n</Info>
                    <b>{formula.formula_version}</b>
                  </GridItem>
                  <GridItem xs={10} sm={10} md={2}>
                    <Info>Kh???i l?????ng</Info>
                    <b>{formula.formula_weight} g</b>
                  </GridItem>
                  <GridItem xs={10} sm={10} md={2}>
                    <Info>d</Info>
                    <b>{formula.density} g/ml</b>
                  </GridItem>
                  <GridItem xs={10} sm={10} md={2}>
                    <Info>Th??? t??ch</Info>
                    <b>{formula.volume} ml</b>
                  </GridItem>
                  <GridItem xs={10} sm={10} md={2}>
                    <Info>Hao h???t</Info>
                    <b>{formula.loss} %</b>
                  </GridItem>
                  <GridItem xs={10} sm={10} md={2}>
                    <Info>Chi ph?? d??? t??nh</Info>
                    <b>{parseFloat(formula.formula_cost).toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</b>
                  </GridItem>
                  <GridItem xs={10} sm={10} md={2}>
                    <Info>Ng?????i t???o</Info>
                    <b>{formula.user_name}</b>
                  </GridItem>
                  {formula.description != null &&
                    <GridItem xs={10} sm={10} md={5}>
                      <Info>Ghi ch?? thay ?????i</Info>
                      <b>{formula.description}</b>
                    </GridItem>
                  }
                </GridContainer>
              </GridItem>
              <CardBody>
                {phaseList.map((p) => {
                  const data = p.materialOfPhaseGetResponse;
                  const listTool = p.listToolInPhaseResponse;
                  var toolString = " ";
                  listTool.forEach((tool) => {
                    toolString += tool.toolResponse.tool_name;
                    toolString += ", ";
                  })
                  return (
                    <>
                      <GridItem>
                        <Card>
                          <CardHeader color="info" className={classes.cardTitleWhite}>
                            <b>Pha {p.phase_name}</b>
                          </CardHeader>
                          <CardBody>
                            <Info><b>D???ng c???</b></Info>
                            <Muted>{toolString}</Muted>
                            <Info><b>M?? t???</b></Info>
                            <Muted>{p.phase_description}</Muted>
                            <DataTable
                              columns={columns}
                              data={data}
                              // optionally, a hook to reset pagination to page 1
                              subHeader
                              persistTableHead
                              onRowClicked={onMatRowClicked}
                            />
                            {show && <Modal matData={matData} handleClose={hideModal} />}
                          </CardBody>
                        </Card>
                      </GridItem>
                    </>
                  );
                })}
              </CardBody>
            </Card>
            {/* <Button type="submit" color="info" onClick={updateFormula}>L??u</Button> */}
          </GridItem>
          <GridItem xs={6} sm={6} md={4}>
            <Card>
              <CardHeader><b>Ti??u chu???n</b></CardHeader>
              <GridItem xs={6} sm={6} md={5}>
                <Button disabled={validateStatusButton} type="button" color="info" onClick={() => { history.push("/testTask/validate", { formula_id: formula_id, testTask: testTask }) }}>????nh gi??</Button>
              </GridItem>

              <CardBody>
                <DataTable
                  columns={testColumns}
                  data={testTask}
                  // optionally, a hook to reset pagination to page 1
                  subHeader
                  persistTableHead />
              </CardBody>
            </Card>
            <div>
              <ProductContainer triggertext="T???o s???n ph???m" status={!createProductStatus} data={formula} />
            </div>
            {productList.length != 0 && (
              <GridItem xs={6} sm={6} md={12}>
                <Card>
                  <CardHeader><b>Danh s??ch s???n ph???m</b></CardHeader>
                  <CardBody>
                    <DataTable
                      columns={productColumns}
                      data={productList}
                      subHeader
                      persistTableHead
                      onRowClicked={onRowClicked}
                    />
                  </CardBody>
                </Card>
              </GridItem>
            )}
          </GridItem>

        </GridContainer>
      </div></>
  );
}
const Modal = ({ handleClose, matData }) => {
  const mat = matData;
  const checkSup = (mat) => {
    if (mat.supplier !== undefined) {
      return mat.supplier.name;
    }
  }
  return (
    <div className="modal display-block">
      <section className="modal-main">
        <div className="App">
          <GridContainer>
            <GridItem xs={12} sm={12} md={10}>
              <Card>
                {/* <CardHeader color="primary"> */}
                <CardHeader color="info">
                  Th??ng Tin Nguy??n Li???u
                </CardHeader>
                {/* </CardHeader> */}
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <Info>Code</Info>
                      <b>{mat.code}</b>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <Info>T??n nguy??n li???u</Info>
                      <b>{mat.name}</b>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <Info>inciName</Info>
                      <b>{mat.inciName}

                      </b>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <Info>tradeName</Info>
                      <b>{mat.tradeName}</b>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <Info>Nh??m</Info>
                      <b>{mat.group}</b>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <Info>????n gi??</Info>
                      <div>
                        {parseFloat(mat.unitPrice).toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: "VND"
                          }
                        )}{" "}
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <Info>????n v??? t??nh</Info>
                      <b>{mat.unit}</b>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <Info>S??? l?????ng</Info>
                      <b>{mat.amount}</b>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <Info>Gi?? tr???</Info>
                      <b>{mat.value}</b>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <Info>MOQ</Info>
                      <b>{mat.moq}</b>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <Info>T???n kho</Info>
                      <b>{mat.remainAmount}</b>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <Info>???? d??ng</Info>
                      <b>{mat.pending}</b>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <Info>Nh?? s???n xu???t</Info>
                      <b>{checkSup(mat)}</b>
                    </GridItem>
                  </GridContainer>

                  <Button type="button" color="info" onClick={handleClose} >????ng</Button>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </section>
    </div>
  );
};