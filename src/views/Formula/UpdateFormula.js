import React, { useEffect, useState } from "react";
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
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Select from "react-dropdown-select";
import { useStateWithCallbackLazy } from "use-state-with-callback";
// import { useHistory } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import CardFooter from "components/Card/CardFooter";
import { toast, ToastContainer } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom";
import Info from "components/Typography/Info";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";

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

export default function UpdateFormula() {
  const location = useLocation();
  const historyPush = useHistory();
  const [formulaSum, setFormulaSum] = useStateWithCallbackLazy([]);
  const rdToken = process.env.REACT_APP_RD_TOKEN;
  const token = localStorage.getItem("token");
  const urlMaterialRequest =
    process.env.REACT_APP_WAREHOUSE + "/api/v1/material";
  const formula = location.state.formula;
  const formula_id = location.state.formula_id;
  // eslint-disable-next-line no-unused-vars
  const [materialList, setMaterialList] = useStateWithCallbackLazy([]);
  const status = location.state.status;
  const [updateFormulaURL, setUpdateFormulaURL] = useStateWithCallbackLazy(
    process.env.REACT_APP_SERVER_URL + `/api/formulas/${formula_id}/upgrade`
  );
  const [description, setDescription] = useStateWithCallbackLazy("");
  const [maxPercentList, setMaxPercentList] = useStateWithCallbackLazy([]);
  const [materialConflict, setMaterialConflict] = useState([]);
  const [buttonText, setButtonText] = useStateWithCallbackLazy("Nâng cấp");
  const [buttonStatus, setButtonStatus] = useStateWithCallbackLazy(false);
  const [toolOptions, setToolOption] = useState([]);
  const [phaseA, setphaseA] = useStateWithCallbackLazy({
    description: "",
    listMaterial: [{ material: null, percent: 0, material_description: "" }],
    toolInPhaseRequest: [],
  });

  const [phaseB, setphaseB] = useStateWithCallbackLazy({
    description: "",
    listMaterial: [{ material: null, percent: 0, material_description: "" }],
    toolInPhaseRequest: [],
  });

  const [phaseC, setphaseC] = useStateWithCallbackLazy({
    description: "",
    listMaterial: [{ material: null, percent: 0, material_description: "" }],
    toolInPhaseRequest: [],
  });

  const [phaseD, setphaseD] = useStateWithCallbackLazy({
    description: "",
    listMaterial: [{ material: null, percent: 0, material_description: "" }],
    toolInPhaseRequest: [],
  });

  const [phaseE, setphaseE] = useStateWithCallbackLazy({
    description: "",
    listMaterial: [{ material: null, percent: 0, material_description: "" }],
    toolInPhaseRequest: [],
  });
  const [weight, setWeight] = useStateWithCallbackLazy(formula.formula_weight);
  const [d, setD] = useStateWithCallbackLazy(formula.density);
  const [volumn, setVolumn] = useStateWithCallbackLazy(formula.volume);
  const [material_norm_loss, setMaterial_norm_loss] = useStateWithCallbackLazy(
    formula.loss
  );

  const checkStatus = () => {
    if (status == "update") {
      setButtonText("Lưu phiên bản");
      setUpdateFormulaURL(
        process.env.REACT_APP_SERVER_URL + `/api/formulas/${formula_id}`
      );
    }
  };

  const handleWeightChange = (e) => {
    if (isNaN(e.target.value) || parseFloat(e.target.value) < 0) {
      toast.error("Khối lượng phải là giá trị số dương");
      document.getElementById("formula_weight").value = parseFloat(weight);
    } else {
      setWeight(parseFloat(e.target.value).toFixed(2), (currentWeight) => {
        if (d != 0) {
          setVolumn(parseFloat(currentWeight / d).toFixed(2));
          console.log(volumn);
          document.getElementById("formula_volumn").value = parseFloat(
            currentWeight / d
          ).toFixed(2);
        }
        setButtonStatus(true);
      });
    }
  };
  const handleVolumnChange = (e) => {
    if (isNaN(e.target.value) || parseFloat(e.target.value) < 0) {
      toast.error("Thể tích phải là giá trị số dương");
      document.getElementById("formula_volumn").value = parseFloat(volumn);
    } else {
      setVolumn(
        parseFloat(parseFloat(e.target.value).toFixed(2)),
        (currentVolumn) => {
          if (d != 0) {
            setWeight(parseFloat((d * currentVolumn).toFixed(2)));
            console.log(d);
            document.getElementById("formula_weight").value = parseFloat(
              d * currentVolumn
            ).toFixed(2);
          }
          setButtonStatus(true);
        }
      );
    }
  };

  const handleDChange = (e) => {
    if (isNaN(e.target.value) || parseFloat(e.target.value) < 0) {
      toast.error("d phải là giá trị số dương");
      document.getElementById("formula_d").value = 1;
    } else {
      setD(parseFloat(e.target.value), (currentD) => {
        if (weight != 0) {
          setVolumn((weight / currentD).toFixed(2));
          document.getElementById("formula_volumn").value = parseFloat(
            weight / currentD
          ).toFixed(2);
        } else if (volumn != 0) {
          setWeight((d * volumn).toFixed(2));
          document.getElementById("formula_weight").value = parseFloat(
            d * volumn
          ).toFixed(2);
        }
        setButtonStatus(true);
      });
    }
  };

  const convertJsontoPhaseObject = (materList) => {
    const subPhaseList = [];
    console.log(formula);
    formula.phaseGetResponse.map((phase, i) => {
      console.log(phase.listToolInPhaseResponse);
      switch (i) {
        case 0:
          var AlistMaterial = [];
          phase.materialOfPhaseGetResponse.map((material) => {
            console.log(material);
            console.log(materList);
            var materialObject = {
              mop_id: material.mop_id,
              material: materList.find((e) => e._id == material.material_id),
              percent: material.material_percent,
              material_description: material.material_description,
            };
            console.log(materialObject);
            AlistMaterial.push(materialObject);
          });
          var AlistTool = [];
          phase.listToolInPhaseResponse.map((tool) => {
            AlistTool.push(tool.toolResponse.tool_id);
          });
          var A = {
            phase_id: phase.phase_id,
            description: phase.phase_description,
            listMaterial: AlistMaterial,
            toolInPhaseRequest: AlistTool,
            isChange: false,
          };
          console.log(A);
          subPhaseList.push(A);
          //   handleSetphaseList(A, phaseB, phaseC, phaseD);
          console.log(phaseList);
          setphaseA(A, () => {});
          break;
        case 1:
          var BlistMaterial = [];
          phase.materialOfPhaseGetResponse.map((material) => {
            var materialObject = {
              mop_id: material.mop_id,
              material: materList.find((e) => e._id == material.material_id),
              percent: material.material_percent,
              material_description: material.material_description,
            };
            BlistMaterial.push(materialObject);
          });
          var B = {
            phase_id: phase.phase_id,
            description: phase.phase_description,
            listMaterial: BlistMaterial,
            toolInPhaseRequest: phase.listToolInPhaseResponse,
            isChange: false,
          };
          subPhaseList.push(B); //   handleSetphaseList(phaseA, B, phaseC, phaseD);
          setphaseB(B);
          break;
        case 2:
          var ClistMaterial = [];
          phase.materialOfPhaseGetResponse.map((material) => {
            console.log(materList);
            var materialObject = {
              mop_id: material.mop_id,
              material: materList.find((e) => e._id == material.material_id),
              percent: material.material_percent,
              material_description: material.material_description,
            };
            ClistMaterial.push(materialObject);
          });
          var C = {
            phase_id: phase.phase_id,
            description: phase.phase_description,
            listMaterial: ClistMaterial,
            toolInPhaseRequest: phase.listToolInPhaseResponse,
            isChange: false,
          };
          subPhaseList.push(C);
          //   handleSetphaseList(phaseA, phaseB, C, phaseD);
          setphaseC(C, (currentPhareC) => {
            console.log(currentPhareC);
          });
          break;
        case 3:
          var DlistMaterial = [];
          phase.materialOfPhaseGetResponse.map((material) => {
            console.log(materList);
            var materialObject = {
              mop_id: material.mop_id,
              material: materList.find((e) => e._id == material.material_id),
              percent: material.material_percent,
              material_description: material.material_description,
            };
            console.log(materialObject);
            DlistMaterial.push(materialObject);
          });
          var D = {
            phase_id: phase.phase_id,
            description: phase.phase_description,
            listMaterial: DlistMaterial,
            toolInPhaseRequest: phase.listToolInPhaseResponse,
            isChange: false,
          };
          console.log(D);
          subPhaseList.push(D);
          //handleSetphaseList(phaseA, phaseB, phaseC, D);
          setphaseD(D, (currentPhareD) => {
            console.log(currentPhareD);
          });
          break;
        case 4:
          var ElistMaterial = [];
          phase.materialOfPhaseGetResponse.map((material) => {
            console.log(materList);
            var materialObject = {
              mop_id: material.mop_id,
              material: materList.find((e) => e._id == material.material_id),
              percent: material.material_percent,
              material_description: material.material_description,
            };
            console.log(materialObject);
            ElistMaterial.push(materialObject);
          });
          var E = {
            phase_id: phase.phase_id,
            description: phase.phase_description,
            listMaterial: ElistMaterial,
            toolInPhaseRequest: phase.listToolInPhaseResponse,
            isChange: false,
          };
          console.log(E);
          subPhaseList.push(E);
          //handleSetphaseList(phaseA, phaseB, phaseC, D);
          setphaseE(E, (currentPhareE) => {
            console.log(currentPhareE);
          });
          break;
        default:
          break;
      }
    });
    return subPhaseList;
  };

  var [phaseList, setphaseList] = useState([]);
  //   const [locationKeys, setLocationKeys] = useState([]);
  //   const history = useHistory();
  const [materialOptions, setMaterialOptions] = useState([]);

  const filterRDformula = (materialList1) => {
    const rdMaterial = [];
    materialList1.forEach((material) => {
      if (material.warehouse === "600a8a1e3fb5d34046a6f4c4") {
        rdMaterial.push(material);
      }
    });
    setMaterialOptions(
      rdMaterial.map((material) => {
        var option = {
          value: material,
          label:
            material.name +
            "(" +
            material.code +
            ")" +
            "( " +
            material.inciName +
            ")",
        };
        return option;
      })
    );
  };

  const getMaxMaterialPercent = () => {
    const urlMaxPercent =
      process.env.REACT_APP_SERVER_URL + "/api/materialstandardpercents";
    axios
      .get(urlMaxPercent, {
        headers: {
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data[0]);
        setMaxPercentList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getMaterialConflict = () => {
    const urlMaterialConflict =
      process.env.REACT_APP_SERVER_URL + "/api/materialconflicts";
    axios
      .get(urlMaterialConflict, {
        headers: {
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setMaterialConflict(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTools = () => {
    const urlTool = process.env.REACT_APP_SERVER_URL + "/api/tools";
    axios
      .get(urlTool, {
        headers: {
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setToolOption(
          res.data.map((tool) => {
            var option = {
              value: tool.tool_id,
              label: tool.tool_name,
            };
            return option;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchData = () => {
    axios
      .get(urlMaterialRequest, {
        headers: {
          "Conttent-Type": "application/json",
          "rd-token": `${rdToken}`,
        },
      })
      .then((res) => {
        filterRDformula(res.data.materialList);
        setMaterialList(res.data.materialList, () => {
          const plist = convertJsontoPhaseObject(res.data.materialList);
          setphaseList(plist);
          renderFomular(plist);
        });
      })
      .catch((error) => {
        console.log(error);
      });
    getMaxMaterialPercent();
    getMaterialConflict();
    getTools();
  };

  const findMaxPercent = (_id) => {
    var max_percent = 100;
    const material = maxPercentList.find((material) => {
      return material.material_id == _id;
    });
    if (material != undefined) {
      max_percent = material.max_percent;
    }
    return max_percent;
  };

  const checkConflict = (_id, phase) => {
    const listConflict = [];
    const conflictResult = [];
    materialConflict.map((material) => {
      if (material.first_material_id == _id) {
        listConflict.push(material.second_material_id);
      }
    });
    phase.listMaterial.forEach((material) => {
      if (material.material != null) {
        const materialConflict = listConflict.find((materialC) => {
          return materialC == material.material._id;
        });
        if (materialConflict != undefined) {
          conflictResult.push(
            materialOptions.find((opt) => {
              return opt.value._id == materialConflict;
            })
          );
        }
      }
    });
    console.log(conflictResult);
    return conflictResult;
  };

  const validateMaterial = (e, p, x) => {
    const conflictResult = checkConflict(e[0].value._id, p);
    if (checkDuplicateMaterial(p.listMaterial, e[0].value) == true) {
      x.material = null;
      toast.error("Chất đã toàn tại trong pha");
    } else if (conflictResult.length > 0) {
      x.material = null;
      toast.error("Chất bị xung đột với chất tồn tại trong pha");
    } else {
      p.isChange = true;
      p.descriptChange = false;
      checkChange();
      x.material = e[0].value;
    }
  };

  useEffect(() => {
    fetchData();
    checkStatus();
  }, []);

  const createObjectJsonForUpdate = () => {
    const phaseCreate = [];
    phaseList.map((phaseMap, index) => {
      console.log(phaseMap);
      const materialList = [];
      phaseMap.listMaterial.map((material) => {
        const materialDetail = {
          mop_id: material.mop_id,
          material_id: material.material._id,
          material_cost: material.material.unitPrice,
          material_weight: parseFloat(
            ((material.percent * weight) / 100).toFixed(3)
          ),
          material_percent: material.percent,
          material_description: material.material_description,
        };
        materialList.push(materialDetail);
        console.log(materialList);
      });
      const currentphase = {
        phase_id: phaseMap.phase_id,
        phase_index: index + 1,
        phase_description: document.getElementById(
          `description${phaseList.indexOf(phaseMap)}`
        ).value,
        materialOfPhaseUpdateRequest: materialList,
        listTool_id: phaseMap.toolInPhaseRequest,
      };
      phaseCreate.push(currentphase);
    });
    const jsonObject = {
      formula_cost: countCost(),
      phaseUpdateRequest: phaseCreate,
      formula_weight: weight,
      product_weight: location.state.weight,
      density: d,
      volume: volumn,
      loss: material_norm_loss,
      description: description,
    };
    console.log(jsonObject);
    return jsonObject;
  };
  const createObjectJsonForUpgrade = () => {
    const phaseCreate = [];
    phaseList.map((phaseMap) => {
      console.log(phaseMap);
      const materialList = [];
      phaseMap.listMaterial.map((material) => {
        const materialDetail = {
          material_id: material.material._id,
          material_cost: material.material.unitPrice,
          material_weight: parseFloat(
            ((material.percent * weight) / 100).toFixed(3)
          ),
          material_percent: material.percent,
          material_description: material.material_description,
        };
        materialList.push(materialDetail);
        console.log(materialList);
      });
      const currentphase = {
        phase_description: document.getElementById(
          `description${phaseList.indexOf(phaseMap)}`
        ).value,
        materialOfPhaseCreateRequest: materialList,
        listTool_id: phaseMap.toolInPhaseRequest,
      };
      phaseCreate.push(currentphase);
    });
    const jsonObject = {
      formula_cost: countCost(),
      phaseCreateRequest: phaseCreate,
      formula_weight: weight,
      product_weight: location.state.weight,
      density: d,
      volume: volumn,
      description: description,
    };
    console.log(jsonObject);
    return jsonObject;
  };

  const checkPercent = () => {
    var percent = 0;
    phaseList.forEach((p) => {
      p.listMaterial.forEach((material) => {
        percent += material.percent;
        percent = parseFloat(percent.toFixed(6));
      });
    });
    return percent;
  };

  const update = () => {
    const noteStatus = checkNoteChange();
    console.log(noteStatus);
    if (checkNoteChange() == false) {
      toast.error("Làm ơn ghi chú lại thay đổi trong mục ghi chú");
    } else {
      if (checkPercent() == 100 && weight > 0) {
        var object;
        if (status == "update") {
          object = createObjectJsonForUpdate();
        } else {
          object = createObjectJsonForUpgrade();
        }
        const noti = toast("Please wait...");
        fetch(updateFormulaURL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(object),
        })
          .then((response) => {
            if (!response.ok) throw new Error(response.status);
            else {
              console.log(response);
              toast.update(noti, {
                render: "Cập nhật công thức thành công",
                type: "success",
              });
              return response;
            }
          })
          .then((res) => {
            if (status == "update") {
              setTimeout(() => {
                history.back();
              }, 2000);
            } else if (status == "upgrade") {
              setTimeout(() => {
                historyPush.push("/project/detail", {
                  project_info: formula.project_id,
                });
              }, 2000);
            } else {
              toast.update(noti, {
                render: res.message,
                type: "error",
                isLoading: false,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (checkPercent != 100) {
        toast.error("Tỉ lệ phần trăm không hợp lệ");
      } else if (weight <= 0) {
        toast.error("Khối lượng không hợp lệ");
      }
    }
  };

  const checkChange = () => {
    phaseList.forEach((phase) => {
      if (phase.isChange == true) {
        setButtonStatus(true);
      }
    });
  };

  const columns = [
    {
      name: "Tên nguyên liệu",
      selector: (row) => row.material.name,
      sortable: true,
      cell: (row) => {
        if (row.material != undefined)
          return (
            <div>{row.material.name + " (" + row.material.inciName + ")"}</div>
          );
      },
    },
    {
      name: "Tỉ lệ",
      selector: (row) => row.percent,
      sortable: true,
      cell: (row) => <div>{row.percent}%</div>,
    },
    {
      name: "Khối lượng/mẻ",
      selector: (row) => row.weight,
      sortable: true,
      cell: (row) => <div>{((row.percent * weight) / 100).toFixed(3)}g</div>,
    },
    {
      name: "Giá/kg",
      selector: (row) => row.price,
      sortable: true,
      cell: (row) => {
        if (row.material != undefined && row.material.unit == "Kg") {
          return (
            <div>
              {parseFloat(row.material.unitPrice).toLocaleString("en-US", {
                style: "currency",
                currency: "VND",
              })}{" "}
            </div>
          );
        } else if (row.material != undefined && row.material.unit == "Gram") {
          return (
            <div>
              {parseFloat(row.material.unitPrice * 1000).toLocaleString(
                "en-US",
                {
                  style: "currency",
                  currency: "VND",
                }
              )}{" "}
            </div>
          );
        }
      },
    },
    {
      name: "Giá/mẻ",
      selector: (row) => row.price,
      sortable: true,
      cell: (row) => {
        if (row.material != undefined && row.material.unit == "Kg") {
          return (
            <div>
              {parseFloat(
                (
                  (row.percent * weight * row.material.unitPrice) /
                  (100 * 1000)
                ).toFixed(3)
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "VND",
              })}{" "}
            </div>
          );
        } else if (row.material != undefined && row.material.unit == "Gram") {
          return (
            <div>
              {parseFloat(
                ((row.percent * weight * row.material.unitPrice) / 100).toFixed(
                  3
                )
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "VND",
              })}{" "}
            </div>
          );
        }
      },
    },
  ];

  // handle click event of the Remove button
  const renderFomular = (plist) => {
    var list = [];
    plist.forEach((p) => {
      list = [...list, ...p.listMaterial];
      console.log(list);
    });
    console.log(list);
    setFormulaSum(list, (currentList) => {
      console.log(currentList);
    });
  };

  const countCost = () => {
    var cost = 0;
    formulaSum.forEach((material) => {
      if (material.material != undefined) {
        if (material.material.unit == "Kg") {
          cost += parseFloat(
            (
              (material.material.unitPrice * material.percent * weight) /
              (100 * 1000)
            ).toFixed(3)
          );
        } else {
          cost += parseFloat(
            (
              (material.material.unitPrice * material.percent * weight) /
              100
            ).toFixed(3)
          );
        }
      }
    });
    if (material_norm_loss != 0) {
      cost = parseFloat((cost * (1 + material_norm_loss / 100)).toFixed(3));
    }
    return parseFloat(cost);
  };

  const countCostOnKg = () => {
    var cost = parseFloat(((1000 / weight) * countCost()).toFixed(3));
    return cost;
  };

  const handleSetphaseList = (A, B, C, D, E) => {
    if (phaseList.length == 1) {
      setphaseList([A]);
      renderFomular([A]);
    } else if (phaseList.length == 2) {
      setphaseList([A, B]);
      renderFomular([A, B]);
    } else if (phaseList.length == 3) {
      setphaseList([A, B, C]);
      renderFomular([A, B, C]);
    } else if (phaseList.length == 4) {
      setphaseList([A, B, C, D]);
      renderFomular([A, B, C, D]);
    } else if (phaseList.length == 5) {
      setphaseList([A, B, C, D, E]);
      renderFomular([A, B, C, D, E]);
    }
  };
  const handleRemoveClick = (phase, index) => {
    switch (phase) {
      case phaseA:
        // eslint-disable-next-line no-case-declarations
        const aList = [...phaseA.listMaterial];
        aList.splice(index, 1);
        setphaseA(
          {
            description: phaseA.description,
            listMaterial: aList,
            toolInPhaseRequest: phaseA.toolInPhaseRequest,
          },
          (currentPhareA) => {
            handleSetphaseList(currentPhareA, phaseB, phaseC, phaseD, phaseE);
          }
        );
        break;
      case phaseB:
        // eslint-disable-next-line no-case-declarations
        const bList = [...phaseB.listMaterial];
        bList.splice(index, 1);
        setphaseB(
          {
            description: phaseB.description,
            listMaterial: bList,
            toolInPhaseRequest: phaseB.toolInPhaseRequest,
          },
          (currentPhareB) => {
            handleSetphaseList(phaseA, currentPhareB, phaseC, phaseD, phaseE);
          }
        );
        break;
      case phaseC:
        // eslint-disable-next-line no-case-declarations
        const cList = [...phaseC.listMaterial];
        cList.splice(index, 1);
        setphaseC(
          {
            description: phaseC.description,
            listMaterial: cList,
            toolInPhaseRequest: phaseC.toolInPhaseRequest,
          },
          (currentPhareC) => {
            handleSetphaseList(phaseA, phaseB, currentPhareC, phaseD, phaseE);
          }
        );
        break;
      case phaseD:
        // eslint-disable-next-line no-case-declarations
        const dList = [...phaseD.listMaterial];
        dList.splice(index, 1);
        setphaseD(
          {
            description: phaseD.description,
            listMaterial: dList,
            toolInPhaseRequest: phaseD.toolInPhaseRequest,
          },
          (currentphaseD) => {
            handleSetphaseList(phaseA, phaseB, phaseC, currentphaseD, phaseE);
          }
        );
        break;
      case phaseE:
        // eslint-disable-next-line no-case-declarations
        const eList = [...phaseE.listMaterial];
        eList.splice(index, 1);
        setphaseE(
          {
            description: phaseE.description,
            listMaterial: eList,
            toolInPhaseRequest: phaseE.toolInPhaseRequest,
          },
          (currentphaseE) => {
            handleSetphaseList(phaseA, phaseB, phaseC, phaseD, currentphaseE);
          }
        );
        break;
      default:
        break;
    }
  };

  // handle click event of the Add button
  const handleAddClick = (phase) => {
    switch (phase) {
      case phaseA:
        setphaseA(
          {
            description: phaseA.description,
            listMaterial: [
              ...phaseA.listMaterial,
              { material: null, percent: 0, material_description: "" },
            ],
            toolInPhaseRequest: phaseA.toolInPhaseRequest,
          },
          (currentPhareA) => {
            console.log(currentPhareA);
            handleSetphaseList(currentPhareA, phaseB, phaseC, phaseD, phaseE);
          }
        );
        break;
      case phaseB:
        setphaseB(
          {
            description: phaseB.description,
            listMaterial: [
              ...phaseB.listMaterial,
              { material: null, percent: 0, material_description: "" },
            ],
            toolInPhaseRequest: phaseB.toolInPhaseRequest,
          },
          (currentPhareB) => {
            handleSetphaseList(phaseA, currentPhareB, phaseC, phaseD, phaseE);
          }
        );
        break;
      case phaseC:
        setphaseC(
          {
            description: phaseC.description,
            listMaterial: [
              ...phaseC.listMaterial,
              { material: null, percent: 0, material_description: "" },
            ],
            toolInPhaseRequest: phaseC.toolInPhaseRequest,
          },
          (currentPhareC) => {
            handleSetphaseList(phaseA, phaseB, currentPhareC, phaseD, phaseE);
          }
        );
        break;
      case phaseD:
        setphaseD(
          {
            description: phaseD.description,
            listMaterial: [
              ...phaseD.listMaterial,
              { material: null, percent: 0, material_description: "" },
            ],
            toolInPhaseRequest: phaseD.toolInPhaseRequest,
          },
          (currentphaseD) => {
            handleSetphaseList(phaseA, phaseB, phaseC, currentphaseD, phaseE);
          }
        );
        break;
      case phaseE:
        setphaseE(
          {
            description: phaseE.description,
            listMaterial: [
              ...phaseE.listMaterial,
              { material: null, percent: 0, material_description: "" },
            ],
            toolInPhaseRequest: phaseE.toolInPhaseRequest,
          },
          (currentphaseE) => {
            handleSetphaseList(phaseA, phaseB, phaseC, phaseD, currentphaseE);
          }
        );
        break;
      default:
        break;
    }
  };

  // handle click event of the Remove button
  const handleRemovephase = () => {
    if (phaseList.length > 1) {
      const list = [...phaseList];
      list.splice(list.length - 1, 1);
      setphaseList(list);
      renderFomular(list);
    }
  };

  // handle click event of the Add button
  const handleAddphase = () => {
    if (phaseList.length == 1) {
      phaseB.phase_id = 0;
      setphaseList([...phaseList, phaseB]);
      renderFomular([...phaseList, phaseB]);
    } else if (phaseList.length == 2) {
      phaseC.phase_id = 0;
      setphaseList([...phaseList, phaseC]);
      renderFomular([...phaseList, phaseC]);
    } else if (phaseList.length == 3) {
      phaseD.phase_id = 0;
      setphaseList([...phaseList, phaseD]);
      renderFomular([...phaseList, phaseD]);
    } else if (phaseList.length == 4) {
      phaseE.phase_id = 0;
      setphaseList([...phaseList, phaseE]);
      renderFomular([...phaseList, phaseE]);
    }
  };

  const checkDuplicateMaterial = (listMaterial, material) => {
    var result = false;
    listMaterial.forEach((materialInList) => {
      if (materialInList.material == material) {
        result = true;
      }
    });
    return result;
  };

  const checkNoteChange = () => {
    var result = true;
    if (description.length < 1) {
      result = false;
    }
    return result;
  };

  window.onhashchange = function () {
    window.history.back();
  };
  const classes = useStyles();
  return (
    <>
      <div className="navbar1">
        <AdminNavbarLinks />
      </div>
      <div className="create-formula">
        <ToastContainer />
        <GridItem xs={12} sm={12} md={12}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <Card>
                <CardHeader color="info" className={classes.cardTitleWhite}>
                  Thông tin công thức
                </CardHeader>
                <GridItem xs={10} sm={10} md={12}>
                  <GridContainer>
                    <GridItem
                      xs={10}
                      sm={10}
                      md={2}
                      onChange={handleWeightChange}
                    >
                      <CustomInput
                        color="primary"
                        labelText="Khối lượng (g)"
                        id="formula_weight"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          multiline: false,
                          rows: 1,
                          defaultValue: weight,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={10} sm={10} md={2} onChange={handleDChange}>
                      <CustomInput
                        color="primary"
                        labelText="d (g/ml)"
                        id="formula_d"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          multiline: false,
                          rows: 1,
                          defaultValue: d,
                        }}
                      />
                    </GridItem>
                    <GridItem
                      xs={10}
                      sm={10}
                      md={2}
                      onChange={handleVolumnChange}
                    >
                      <CustomInput
                        color="primary"
                        labelText="Thể tích (ml)"
                        id="formula_volumn"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          multiline: false,
                          rows: 1,
                          defaultValue: volumn,
                        }}
                      />
                    </GridItem>
                    <GridItem
                      xs={10}
                      sm={10}
                      md={2}
                      onChange={(e) => {
                        if (isNaN(e.target.value)) {
                          toast.error("Hao hụt phải là giá trị số");
                          document.getElementById(
                            "material_norm_loss"
                          ).value = 0;
                        } else {
                          const loss = parseFloat(e.target.value);
                          if (loss < 0 || loss >= 100) {
                            toast.error("Hao hụt phải từ 0 đến dưới 100");
                            document.getElementById(
                              "material_norm_loss"
                            ).value = 0;
                          } else {
                            setMaterial_norm_loss(e.target.value);
                            setButtonStatus(true);
                          }
                        }
                      }}
                    >
                      <CustomInput
                        color="primary"
                        labelText="Hao hụt (%)"
                        id="material_norm_loss"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          multiline: false,
                          rows: 1,
                          defaultValue: material_norm_loss,
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridContainer>
                  <GridItem xs={10} sm={10} md={2}>
                    <Button type="button" color="info" onClick={handleAddphase}>
                      Thêm pha
                    </Button>
                  </GridItem>
                  <GridItem xs={10} sm={10} md={2}>
                    <Button
                      type="button"
                      color="danger"
                      onClick={handleRemovephase}
                    >
                      Xóa pha
                    </Button>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={10} sm={10} md={12}>
                    <h4 style={{ textAlign: "center" }}>
                      <Info>
                        <b>Danh sách thành phần:</b>
                      </Info>
                    </h4>
                  </GridItem>
                </GridContainer>

                {phaseList.map((p, i) => {
                  const listTool = [];
                  if (p.toolInPhaseRequest.length > 0) {
                    p.toolInPhaseRequest.forEach((tool) => {
                      const toolValue = toolOptions.find((opt) => {
                        if (tool.toolResponse != undefined) {
                          return opt.value === tool.toolResponse.tool_id;
                        } else {
                          return opt.value === tool;
                        }
                      });
                      if (toolValue != undefined) {
                        listTool.push(toolValue);
                      }
                    });
                  }
                  return (
                    <>
                      <h3 style={{ margin: "20px" }}>
                        Pha <span>{i + 1}</span>
                      </h3>
                      <GridItem style={{ margin: "0px", width: "50%" }}>
                        <Select
                          multi
                          options={toolOptions}
                          dropdownPosition="auto"
                          placeholder="Dụng cụ"
                          onChange={(value) => {
                            const listId = [];
                            value.forEach((val) => {
                              listId.push(val.value);
                            });
                            console.log(listId);
                            p.toolInPhaseRequest = listId;
                          }}
                          values={listTool}
                        />
                      </GridItem>
                      <GridItem style={{ margin: "0px", width: "50%" }}>
                        <CustomInput
                          labelText="Mô tả thực hiện"
                          color="primary"
                          id={`description${i}`}
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            multiline: true,
                            rows: 3,
                            defaultValue: p.description.toString(),
                            onChange: () => {
                              p.descriptChange = true;
                            },
                          }}
                        />
                      </GridItem>
                      {p.listMaterial.map((x, i) => {
                        return (
                          <>
                            <GridItem xs={12} sm={12} md={12}>
                              <div className="box" style={{ margin: "20px 0" }}>
                                <GridContainer
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <GridItem xs={12} sm={12} md={6}>
                                    {x.material != undefined ? (
                                      <Select
                                        className="dropdownSelect"
                                        options={materialOptions}
                                        dropdownPosition="auto"
                                        placeholder="Nguyên liệu"
                                        values={[
                                          materialOptions.find(
                                            (opt) => opt.value === x.material
                                          ),
                                        ]}
                                        onChange={(e) => {
                                          p.listMaterial[i].material = null;
                                          if (e[0] != undefined) {
                                            validateMaterial(e, p, x);
                                          } else {
                                            x.material = null;
                                          }
                                          renderFomular(phaseList);
                                        }}
                                        style={{ font: "1rem", width: "100%" }}
                                      />
                                    ) : (
                                      <Select
                                        className="dropdownSelect"
                                        options={materialOptions}
                                        dropdownPosition="auto"
                                        placeholder="Nguyên liệu"
                                        onChange={(e) => {
                                          p.listMaterial[i].material = null;
                                          if (e[0] != undefined) {
                                            validateMaterial(e, p, x);
                                          } else {
                                            x.material = null;
                                          }
                                          renderFomular(phaseList);
                                        }}
                                        style={{ font: "1rem", width: "100%" }}
                                      />
                                    )}
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={2}>
                                    <input
                                      placeholder="Tỉ lệ"
                                      name="percent"
                                      type="text"
                                      defaultValue={x.percent.toString()}
                                      onChange={(e) => {
                                        if (
                                          isNaN(e.target.value) ||
                                          parseFloat(e.target.value) < 0
                                        ) {
                                          toast.error(
                                            "Tỉ lệ phải là giá trị số dương"
                                          );
                                          document.getElementById(i).value = 0;
                                        } else {
                                          if (x.material != null) {
                                            const maxPercent = findMaxPercent(
                                              x.material._id
                                            );
                                            if (maxPercent != null) {
                                              if (
                                                parseFloat(e.target.value) >
                                                maxPercent
                                              ) {
                                                toast.error(
                                                  "Quá lưu lượng quy định"
                                                );
                                              } else {
                                                x.percent = parseFloat(
                                                  e.target.value
                                                );
                                                p.isChange = true;
                                                p.descriptChange = false;
                                                checkChange();
                                              }
                                            } else {
                                              x.percent = parseFloat(
                                                e.target.value
                                              );
                                              p.isChange = true;
                                              p.descriptChange = false;
                                              checkChange();
                                            }
                                          }
                                        }
                                        renderFomular(phaseList);
                                      }}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        borderBottom: "1px black solid",
                                        outline: "none",
                                        textAlign: "center",
                                      }}
                                    />
                                  </GridItem>
                                  <b>%</b>
                                  <GridItem xs={12} sm={12} md={2}>
                                    <input
                                      placeholder="Công dụng"
                                      name="function"
                                      type="text"
                                      defaultValue={x.material_description}
                                      onChange={(e) => {
                                        x.material_description = e.target.value;
                                        p.isChange = true;
                                        p.descriptChange = false;
                                        checkChange();
                                        renderFomular(phaseList);
                                      }}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        borderBottom: "1px black solid",
                                        outline: "none",
                                        padding: "0",
                                      }}
                                    />
                                  </GridItem>

                                  {p.listMaterial.length !== 1 && (
                                    <GridItem xs={12} sm={12} md={1}>
                                      <div className="btn-box">
                                        <Button
                                          className="mr10"
                                          style={{
                                            marginRight: "3%",
                                            backgroundColor: "#ff3300",
                                            color: "white",
                                            width: "100%",
                                          }}
                                          onClick={() =>
                                            handleRemoveClick(p, i)
                                          }
                                        >
                                          x
                                        </Button>
                                      </div>
                                    </GridItem>
                                  )}
                                </GridContainer>
                              </div>
                            </GridItem>
                            {p.listMaterial.length - 1 === i && (
                              <div>
                                <Button
                                  color="info"
                                  onClick={() => {
                                    handleAddClick(p);
                                  }}
                                  style={{
                                    margin: "2% 45%",
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                            )}
                          </>
                        );
                      })}
                    </>
                  );
                })}
              </Card>
            </GridItem>
            <GridItem xs={6} sm={6} md={6}>
              <Card>
                <CardHeader>
                  <b>Chi Tiết Công Thức</b>
                </CardHeader>
                <CardBody>
                  <DataTable columns={columns} data={formulaSum} />
                </CardBody>
                <CardFooter
                  style={{
                    border: "1px black solid",
                    borderRadius: "10px",
                    width: "50%",
                  }}
                >
                  <GridItem style={{ margin: "0px", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h4 style={{ width: "70%", fontWeight: "bold" }}>
                        Tổng phần trăm:
                      </h4>
                      <span style={{ fontSize: "18px" }}>
                        {checkPercent()} %
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h4 style={{ width: "70%", fontWeight: "bold" }}>
                        Tổng tiền/mẻ:
                      </h4>
                      <span style={{ fontSize: "18px" }}>
                        {" "}
                        {countCost().toLocaleString("en-US", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h4 style={{ width: "70%", fontWeight: "bold" }}>
                        Tổng tiền/kg:
                      </h4>
                      <span style={{ fontSize: "18px" }}>
                        {" "}
                        {countCostOnKg().toLocaleString("en-US", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                  </GridItem>
                </CardFooter>
              </Card>
              <GridItem xs={6} sm={6} md={12}>
                <div
                  style={{
                    backgroundColor: "white",
                    margin: "2% 0",
                    width: "100%",
                  }}
                >
                  <CustomInput
                    labelText="Ghi chú"
                    color="primary"
                    id="formula_description"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 3,
                      defaultValue: description.toString(),
                      onChange: (e) => {
                        setDescription(e.target.value);
                        console.log(description);
                      },
                    }}
                  />
                </div>
              </GridItem>
              <Button
                type="button"
                color="info"
                onClick={() => {
                  update();
                }}
                disabled={!buttonStatus}
              >
                {buttonText}
              </Button>
            </GridItem>
          </GridContainer>
        </GridItem>
      </div>
    </>
  );
}
