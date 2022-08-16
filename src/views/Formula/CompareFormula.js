/* eslint-disable prettier/prettier */
import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import { useLocation } from "react-router-dom";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Select from "react-dropdown-select";
import axios from "axios";
import Muted from "components/Typography/Muted";
import Info from "components/Typography/Info";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import DataTable from "react-data-table-component";
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

export default function CompareFormula() {
  const classes = useStyles();
  const location = useLocation();
  const token = localStorage.getItem("token");
  console.log(location.state);
  const project_id = location.state.project_id;
  const [formulaOption, setFormulaOption] = useStateWithCallbackLazy([]);
  const urlGetFormula =
    process.env.REACT_APP_SERVER_URL + `/api/formulas?project_id=${project_id}`;

  const [formula1, setFormula1] = useStateWithCallbackLazy({});
  const [phaseList1, setPhaseList1] = useStateWithCallbackLazy([]);
  const rdToken = process.env.REACT_APP_RD_TOKEN;

  const [formula2, setFormula2] = useStateWithCallbackLazy({});
  const [phaseList2, setPhaseList2] = useStateWithCallbackLazy([]);
  const [materialList, setMaterialList] = useStateWithCallbackLazy([]);
  const urlMaterialRequest =
    process.env.REACT_APP_WAREHOUSE + "/api/v1/material";
  const convertMaterIDToMater = (materialId) => {
    return materialList.find((e) => e._id == materialId);
  };
  const columns = [
    {
      name: "Mã nguyên liệu",
      selector: (row) => convertMaterIDToMater(row.material_id).code,
      sortable: true,
      cell: (row) => <div>{convertMaterIDToMater(row.material_id).code}</div>,
      conditionalCellStyles: [
        {
          when: (row) => row.checkMaterial == true,
          style: {
            backgroundColor: "rgba(63, 195, 128, 0.9)",
            color: "white",
          },
        },
      ],
    },
    {
      name: "Tên nguyên liệu",
      selector: (row) => convertMaterIDToMater(row.material_id).name,
      sortable: true,
      cell: (row) => <div>{convertMaterIDToMater(row.material_id).name}</div>,
      conditionalCellStyles: [
        {
          when: (row) => row.checkMaterial == true,
          style: {
            backgroundColor: "rgba(63, 195, 128, 0.9)",
            color: "white",
          },
        },
      ],
    },
    {
      name: "Tên Inci",
      selector: (row) => convertMaterIDToMater(row.material_id).inciName,
      sortable: true,
      cell: (row) => (
        <div>{convertMaterIDToMater(row.material_id).inciName}</div>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.checkMaterial == true,
          style: {
            backgroundColor: "rgba(63, 195, 128, 0.9)",
            color: "white",
          },
        },
      ],
    },
    {
      name: "Phần trăm",
      selector: (row) => row.material_percent,
      sortable: true,
      cell: (row) => <div>{row.material_percent}%</div>,
      conditionalCellStyles: [
        {
          when: (row) => row.checkPercent == true,
          style: {
            backgroundColor: "rgba(63, 195, 128, 0.9)",
            color: "white",
          },
        },
      ],
    },
    {
      name: "Khối lượng",
      selector: (row) => row.material_weight,
      sortable: true,
      cell: (row) => <div>{row.material_weight} g</div>,
      conditionalCellStyles: [
        {
          when: (row) => row.checkWeight == true,
          style: {
            backgroundColor: "rgba(63, 195, 128, 0.9)",
            color: "white",
          },
        },
      ],
    },
    {
      name: "Giá ngày tạo",
      selector: (row) => row.material_cost,
      sortable: true,
      cell: (row) => (
        <div>
          {parseFloat(row.material_cost).toLocaleString("en-US", {
            style: "currency",
            currency: "VND",
          })}{" "}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.checkCost == true,
          style: {
            backgroundColor: "rgba(63, 195, 128, 0.9)",
            color: "white",
          },
        },
      ],
    },
  ];
  const fetchData = () => {
    axios
      .get(urlMaterialRequest, {
        headers: {
          "Conttent-Type": "application/json",
          "rd-token": `${rdToken}`,
        },
      })
      .then((res) => {
        setMaterialList(res.data.materialList, () => {
          console.log(res.data.materialList);
          console.log(materialList);
        });
      });
    axios
      .get(urlGetFormula, {
        headers: {
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setFormulaOption(
          res.data.map((formula) => {
            var option = {
              value: formula.formula_id,
              label: formula.formula_version,
            };
            return option;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchFormula1 = async (formulaId) => {
    const urlFormulaRequest =
      process.env.REACT_APP_SERVER_URL + `/api/formulas/${formulaId}`;
    await axios
      .get(urlFormulaRequest, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setFormula1(res.data);
        console.log(formula1);
        setPhaseList1(res.data.phaseGetResponse);
      });
  };

  const fetchFormula2 = async (formulaId) => {
    const urlFormulaRequest =
      process.env.REACT_APP_SERVER_URL + `/api/formulas/${formulaId}`;
    await axios
      .get(urlFormulaRequest, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setFormula2(res.data);
        console.log(formula2);
        setPhaseList2(res.data.phaseGetResponse);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <><div className="navbar1">
      <AdminNavbarLinks />
    </div>
    <ButtonBack />
    <div style={{position:"absolute",
    width:"100%",
    marginTop: "5%",
    marginLeft: "2px",
    marginRight: "2px",
    zIndex: "-1"}}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <h4><b>Phiên bản: </b></h4>
                <Select
                  style={{ backgroundColor: "white", textAlign:"center" }}
                  options={formulaOption}
                  placeholder="Chọn phiên bản"
                  onChange={(e) => {
                    if (e[0] != undefined) {
                      fetchFormula1(e[0].value);
                    }
                  }} />
              </GridItem>

              <GridItem xs={12} sm={12} md={6}>
                <h4><b>Phiên bản: </b></h4>
                <Select
                  style={{ backgroundColor: "white", textAlign: "center" }}
                  options={formulaOption}
                  placeholder="Chọn phiên bản"
                  onChange={(e) => {
                    if (e[0] != undefined) {
                      fetchFormula2(e[0].value);
                    }
                  } } />
              </GridItem>
            </GridContainer>
            <GridContainer>

              <Card>
                <CardHeader></CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <Card>
                        <CardHeader
                          color="info"
                          className={classes.cardTitleWhite}
                        >
                          Chi tiết công thức
                        </CardHeader>
                        <GridItem>
                          <GridContainer>
                            <GridItem xs={10} sm={10} md={4}>
                              <Info>Khối lượng</Info>
                              <b>{formula1.formula_weight} g</b>
                            </GridItem>
                            <GridItem xs={10} sm={10} md={4}>
                              <Info>Chi phí ngày tạo</Info>
                              <b>
                                {parseFloat(formula1.formula_cost).toLocaleString(
                                  "en-US",
                                  {
                                    style: "currency",
                                    currency: "VND"
                                  }
                                )}{" "}
                              </b>
                            </GridItem>
                            <GridItem xs={10} sm={10} md={4}>
                              <Info>Người tạo</Info>
                              <b>{formula1.user_name}</b>
                            </GridItem>
                          </GridContainer>
                        </GridItem>
                        <CardBody>
                          {phaseList1.map((p) => {
                            const data = p.materialOfPhaseGetResponse;
                            return (
                              <>
                                <GridItem>
                                  <Card>
                                    <CardHeader
                                      color="info"
                                      className={classes.cardTitleWhite}
                                    >
                                      <b>Pha {p.phase_name}</b>
                                    </CardHeader>
                                  
                                  <CardBody>
                                    <Info>
                                      <b>Mô tả</b>
                                    </Info>
                                    <Muted>{p.phase_description}</Muted>
                                    <DataTable
                                      columns={columns}
                                      data={data}
                                      // optionally, a hook to reset pagination to page 1
                                      subHeader
                                      persistTableHead />
                                  </CardBody>
                                  </Card>
                                </GridItem>
                              </>
                            );
                          })}
                        </CardBody>
                      </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <Card>
                        <CardHeader
                          color="info"
                          className={classes.cardTitleWhite}
                        >
                          Chi tiết công thức
                        </CardHeader>
                        <GridItem>
                          <GridContainer>
                            <GridItem xs={10} sm={10} md={4}>
                              <Info>Khối lượng</Info>
                              <b>{formula2.formula_weight} g</b>
                            </GridItem>
                            <GridItem xs={10} sm={10} md={4}>
                              <Info>Chi phí ngày tạo</Info>
                              <b>
                                {parseFloat(formula2.formula_cost).toLocaleString(
                                  "en-US",
                                  {
                                    style: "currency",
                                    currency: "VND"
                                  }
                                )}{" "}
                              </b>
                            </GridItem>
                            <GridItem xs={10} sm={10} md={4}>
                              <Info>Người tạo</Info>
                              <b>{formula2.user_name}</b>
                            </GridItem>
                          </GridContainer>
                        </GridItem>
                        <CardBody>
                          {phaseList2.map((p, index) => {
                            console.log(phaseList2);
                            const data = p.materialOfPhaseGetResponse.map(
                              (material) => {
                                var tmp = {};
                                
                                if (phaseList1[index] == undefined) {
                                  tmp = {
                                    material_cost: material.material_cost,
                                    material_id: material.material_id,
                                    material_percent: material.material_percent,
                                    material_weight: material.material_weight,
                                    checkMaterial: true,
                                    checkWeight: true,
                                    checkPercent: true,
                                    checkCost: true
                                  };
                                } else{
                                  const materIndex = phaseList1[index].materialOfPhaseGetResponse.findIndex((mater) => mater.material_id == material.material_id);
                                 if (materIndex >= 0){
                                  tmp = {
                                    material_cost: material.material_cost,
                                    material_id: material.material_id,
                                    material_percent: material.material_percent,
                                    material_weight: material.material_weight,
                                    checkMaterial: false,
                                    checkWeight: material.material_weight != phaseList1[index].materialOfPhaseGetResponse[materIndex].material_weight,
                                    checkPercent: material.material_percent != phaseList1[index].materialOfPhaseGetResponse[materIndex].material_percent,
                                    checkCost: material.material_cost != phaseList1[index].materialOfPhaseGetResponse[materIndex].material_cost
                                  };
                                } else{
                                  tmp = {
                                    material_cost: material.material_cost,
                                    material_id: material.material_id,
                                    material_percent: material.material_percent,
                                    material_weight: material.material_weight,
                                    checkMaterial: true,
                                    checkWeight: true,
                                    checkPercent: true,
                                    checkCost: true
                                  };
                                }
                              }
                                return tmp;
                              }
                            );
                            const conditionalRowStyles = [
                              {
                                when: (row) => row.checkDiff == true,
                                style: {
                                  backgroundColor: "green",
                                  color: "white"
                                }
                              },
                            ];
                            return (
                              <>
                                <GridItem>
                                  <Card>
                                    <CardHeader
                                      color="info"
                                      className={classes.cardTitleWhite}
                                    >
                                      <b>Pha {p.phase_name}</b>
                                    </CardHeader>
                                  
                                  <CardBody>
                                    <Info>
                                      <b>Mô tả</b>
                                    </Info>
                                    <Muted>{p.phase_description}</Muted>
                                    <DataTable
                                      columns={columns}
                                      data={data}
                                      // optionally, a hook to reset pagination to page 1
                                      subHeader
                                      persistTableHead
                                      conditionalRowStyles={conditionalRowStyles} />
                                  </CardBody>
                                  </Card>
                                </GridItem>
                              </>
                            );
                          })}
                        </CardBody>
                      </Card>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div></>
  );
}
