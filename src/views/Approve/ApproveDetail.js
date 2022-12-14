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
import { useLocation } from "react-router-dom";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import axios from "axios";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import Muted from "components/Typography/Muted";
import Info from "components/Typography/Info";
import { useState } from "react";
import Button from "components/CustomButtons/Button.js";
import { toast, ToastContainer } from "react-toastify";
// import CustomInput from "components/CustomInput/CustomInput";
// import { client } from "websocket";
import ReactLoading from "react-loading";
import { useSelector } from "react-redux";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
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

export default function ApproveDetail() {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const rdToken = process.env.REACT_APP_RD_TOKEN;

  const [show, setShow] = useState(false);
  var [matData, setMatData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const client = useSelector((state) => state.sendNoti);

  const formula_id = location.state.formula_id;
  const project_name = location.state.project_name;
  const formula_version = location.state.formula_version;
  //const formula_status = location.state.formula_status;
  const [formula, setFormula] = useStateWithCallbackLazy({});
  const [phaseList, setPhaseList] = useStateWithCallbackLazy([]);
  const [materialList, setMaterialList] = useStateWithCallbackLazy([]);
  const [testTask, setTestTask] = useStateWithCallbackLazy([]);
  const [noteDeny, setNoteDeny] = useStateWithCallbackLazy("");

  //const history = useHistory();

  const urlFormulaRequest = process.env.REACT_APP_SERVER_URL + `/api/formulas/${formula_id}`;
  const urlMaterialRequest = process.env.REACT_APP_WAREHOUSE + "/api/v1/material";



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
      console.log(res.data);
      setFormula(res.data);
      console.log(formula);
      setPhaseList(res.data.phaseGetResponse);
      setTestTask(res.data.listTestResponse, () => {
        console.log(res.data);
      })
      setNoteDeny(res.data.deny_reason);
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const checkDenyReason = () => {
    var result = true;
    if (noteDeny === "") {
      result = false;
    } else if (noteDeny === undefined) {
      result = false;
    } else if (noteDeny === null) {
      result = false;
    }

    return result;
  }
  const convertMaterIDToMater = (materialId) => {
    return materialList.find((e) => e._id == materialId);
  }

  const handleNoteDeny = (event) => {
    setNoteDeny(event.target.value);
  }

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

  const columnsTest = [
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
      selector: (row) => {
        if (row.fileResponse != null) {
          return row.fileResponse.url
        }
      },
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

  const onApprove = () => {
    const urlFormulaApprove = process.env.REACT_APP_SERVER_URL + `/api/formulas/${formula_id}/status?status=approved`;
    const noti = toast("Vui l??ng ?????i ...");
    fetch(urlFormulaApprove, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) throw new Error(response.status);
        else {
          toast.update(noti, {
            render: "???? ch???p thu???n",
            type: "success",
            isLoading: false,
          });
          client.send(
            JSON.stringify({
              type: "noti",
              message: `C??ng th???c version : ${formula_version} c???a d??? ??n  + ${project_name} + ???? ???????c ch???p thu???n`,
              assignedId: formula.user_id,
            })
          );
          setTimeout(() => {
            history.back()
          }, 500);
          return response.status;
        }
      })
      .catch((error) => {
        console.log(error);
        toast.update(noti, {
          render: error.toString(),
          type: "error",
          isLoading: true,
        });
      });
  };
  const onDeny = () => {
    console.log(noteDeny);
    const noteStatus = checkDenyReason();
    console.log(noteStatus);
    var deny_reason = encodeURIComponent(noteDeny);
    const urlFormulaApprove = process.env.REACT_APP_SERVER_URL + `/api/formulas/${formula_id}/deny-with-reason?deny_reason=${deny_reason}`;
    const noti = toast("Vui l??ng ?????i ...");
    if (checkDenyReason() == false) {
      toast.error("L??m ??n ghi ch?? l???i l?? do t??? ch???i");
    } else {
      fetch(urlFormulaApprove, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log(response);
          if (!response.ok) throw new Error(response.status);
          else {
            toast.update(noti, {
              render: "???? t??? ch???i",
              type: "success",
            });
            client.send(
              JSON.stringify({
                type: "noti",
                message: `C??ng th???c version : ${formula_version} c???a d??? ??n : ${project_name} ???? b??? t??? ch???i`,
                assignedId: formula.user_id,
              })
            );
            setTimeout(() => {
              history.back()
            }, 500);
            return response.status;
          }
        })
        .catch((error) => {
          console.log(error);
          toast.update(noti, {
            render: error.toString(),
            type: "error",
            isLoading: true,
          });
        });
    }
  };
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
      <div className="navbar1">
        <AdminNavbarLinks />
      </div>
      <ButtonBack />
      <GridContainer>
        <ToastContainer />
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
                      </Card>
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
            <CardBody>
              <DataTable
                columns={columnsTest}
                data={testTask}
                // optionally, a hook to reset pagination to page 1
                subHeader
                persistTableHead
              />
            </CardBody>
          </Card>
          <GridItem >
            <Info>L?? do t??? ch???i</Info>
            <textarea id="noteDeny" name="w3review" rows="4" cols="70" value={noteDeny} onChange={handleNoteDeny} />
          </GridItem>
          <Button type="button" color="info" onClick={onApprove} >Th??ng qua</Button>
          <Button type="button" color="info" onClick={onDeny}>T??? ch???i</Button>
        </GridItem>
      </GridContainer>
    </>
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