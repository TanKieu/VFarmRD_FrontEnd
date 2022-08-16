/* eslint-disable no-unused-vars */
import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";

import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import { DoneAll, AddBox, AvTimer, AddToQueue } from "@material-ui/icons";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
} from "chart.js";

const useStyles = makeStyles(styles);

Chart.register(
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend
);

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const [numberFormulas, setNumberFormulas] = useState(0);
  const [numberFormulasPending, setNumberFormulasPending] = useState(0);
  const [numberFormulasOnProcess, setNumberFormulasOnProcess] = useState(0);
  const [numberFormulasApproval, setNumberFormulasApproval] = useState(0);

  const [numFormulaPOnW, setNumFormulaPOnW] = useState();
  const [numFormulaOPOnW, setNumFormulaOPOnW] = useState();
  const [numFormulaAOnW, setNumFormulaAOnW] = useState();

  const [materialList, setMaterialList] = useState([]);
  const [materialStatic, setMaterialStatic] = useState();

  const rdToken = process.env.REACT_APP_RD_TOKEN;

  const defaultRequest =
    process.env.REACT_APP_SERVER_URL + `/api/formulas/statistics`;

  var Chartist = require("chartist");

  var delays = 80,
    durations = 500;

  const convertMaterIDToMater = (materialId) => {
    return materialList.find((e) => e._id == materialId);
  };
  const filterRDformula = (materialList1) => {
    const rdMaterial = [];
    materialList1.forEach((material) => {
      if (material.warehouse === "600a8a1e3fb5d34046a6f4c4") {
        rdMaterial.push(material);
      }
    });
    setMaterialList(rdMaterial);
  };
  const fetchData = () => {
    const urlMaterialRequest =
      process.env.REACT_APP_WAREHOUSE + "/api/v1/material";
    axios
      .get(urlMaterialRequest, {
        headers: {
          "Conttent-Type": "application/json",
          "rd-token": `${rdToken}`,
        },
      })
      .then((res) => {
        filterRDformula(res.data.materialList);
      })
      .catch((error) => {
        console.log(error);
      });

    const urlMaterialStatic =
      process.env.REACT_APP_SERVER_URL + "/api/materials/statistics";
    axios
      .get(urlMaterialStatic, {
        headers: {
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          setMaterialStatic(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(defaultRequest, {
        headers: {
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setNumberFormulas(res.data.total_formula);
        setNumberFormulasPending(res.data.total_formula_pending);
        setNumberFormulasOnProcess(res.data.total_formula_on_progress);
        setNumberFormulasApproval(res.data.total_formula_approved);
      })
      .catch((error) => {
        console.log(error);
      });

    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 7);
    const formulaRequest =
      process.env.REACT_APP_SERVER_URL +
      `/api/formulas/statistics?from_date=${fromDate
        .toISOString()
        .slice(0, 10)}&to_date=${toDate.toISOString().slice(0, 10)}`;
    axios
      .get(formulaRequest, {
        headers: {
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const label = [];
        const formula_P = [];
        const formula_OP = [];
        const formula_A = [];
        res.data.forEach((r) => {
          label.push(r.date);
          formula_P.push(r.total_formula_pending);
          formula_OP.push(r.total_formula_on_progress);
          formula_A.push(r.total_formula_approved);
        });
        setNumFormulaPOnW({
          data: {
            labels: label,
            series: [formula_P],
          },
          options: {
            lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 12, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
          // for animation
          animation: {
            draw: function (data) {
              if (data.type === "line" || data.type === "area") {
                data.element.animate({
                  d: {
                    begin: 600,
                    dur: 700,
                    from: data.path
                      .clone()
                      .scale(1, 0)
                      .translate(0, data.chartRect.height())
                      .stringify(),
                    to: data.path.clone().stringify(),
                    easing: Chartist.Svg.Easing.easeOutQuint,
                  },
                });
              } else if (data.type === "point") {
                data.element.animate({
                  opacity: {
                    begin: (data.index + 1) * delays,
                    dur: durations,
                    from: 0,
                    to: 1,
                    easing: "ease",
                  },
                });
              }
            },
          },
        });
        setNumFormulaOPOnW({
          data: {
            labels: label,
            series: [formula_OP],
          },
          options: {
            lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 12, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
          // for animation
          animation: {
            draw: function (data) {
              if (data.type === "line" || data.type === "area") {
                data.element.animate({
                  d: {
                    begin: 600,
                    dur: 700,
                    from: data.path
                      .clone()
                      .scale(1, 0)
                      .translate(0, data.chartRect.height())
                      .stringify(),
                    to: data.path.clone().stringify(),
                    easing: Chartist.Svg.Easing.easeOutQuint,
                  },
                });
              } else if (data.type === "point") {
                data.element.animate({
                  opacity: {
                    begin: (data.index + 1) * delays,
                    dur: durations,
                    from: 0,
                    to: 1,
                    easing: "ease",
                  },
                });
              }
            },
          },
        });
        setNumFormulaAOnW({
          data: {
            labels: label,
            series: [formula_A],
          },
          options: {
            lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 12, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
          // for animation
          animation: {
            draw: function (data) {
              if (data.type === "line" || data.type === "area") {
                data.element.animate({
                  d: {
                    begin: 600,
                    dur: 700,
                    from: data.path
                      .clone()
                      .scale(1, 0)
                      .translate(0, data.chartRect.height())
                      .stringify(),
                    to: data.path.clone().stringify(),
                    easing: Chartist.Svg.Easing.easeOutQuint,
                  },
                });
              } else if (data.type === "point") {
                data.element.animate({
                  opacity: {
                    begin: (data.index + 1) * delays,
                    dur: durations,
                    from: 0,
                    to: 1,
                    easing: "ease",
                  },
                });
              }
            },
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  const classes = useStyles();
  const doughnutState = {
    labels: ["Đang thực hiện ", "Thông qua", "Trì hoãn"],
    datasets: [
      {
        backgroundColor: ["#ff9800", "#4caf50", "#f44336"],
        hoverBackgroundColor: ["#ffa726", "#16a34a", "#dc2626"],
        data: [
          numberFormulasOnProcess,
          numberFormulasApproval,
          numberFormulasPending,
        ],
      },
    ],
  };
  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Những chất được sử dụng nhiều nhất (theo khối lượng)",
      },
    },
  };

  const createMaterData = () => {
    const data = [];
    if (materialStatic != undefined && materialList.length > 0) {
      materialStatic.top_10_materials_most_used_by_weight.map(
        (material_id, index) => {
          const material = convertMaterIDToMater(material_id);
          material.weight_used =
            materialStatic.top_10_materials_most_used_by_weight_time[index];
          data.push(material);
        }
      );
    }
    return data;
  };
  const labels = createMaterData().map((data) => {
    return data.name;
  });
  const dataMaterial = createMaterData();
  const data = {
    labels,
    datasets: [
      {
        label: "Khối lượng sử dụng (g)",
        data: dataMaterial.map((data) => data.weight_used),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <>
      <div>
        <h2>
          <b>Công thức</b>
        </h2>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <AvTimer />
                </CardIcon>
                <p className={classes.cardCategory}>Đang thực hiện</p>
                <h3 className={classes.cardTitle}>{numberFormulasOnProcess}</h3>
              </CardHeader>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <DoneAll />
                </CardIcon>
                <p className={classes.cardCategory}>Đã chấp thuận</p>
                <h3 className={classes.cardTitle}>{numberFormulasApproval}</h3>
              </CardHeader>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <Icon>info_outline</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Đang trì hoãn</p>
                <h3 className={classes.cardTitle}>{numberFormulasPending}</h3>
              </CardHeader>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <AddBox />
                </CardIcon>
                <p className={classes.cardCategory}>Tổng số công thức</p>
                <h3 className={classes.cardTitle}>{numberFormulas}</h3>
              </CardHeader>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <div style={{ maxHeight: "18%", maxWidth: "18%", marginLeft: "40%" }}>
            <Doughnut data={doughnutState} />
          </div>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart>
              <CardHeader color="warning">
                {numFormulaOPOnW != undefined && (
                  <ChartistGraph
                    className="ct-chart"
                    data={numFormulaOPOnW.data}
                    type="Line"
                    options={numFormulaOPOnW.options}
                    listener={numFormulaOPOnW.animation}
                  />
                )}
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>
                  Đang thực hiện trong 7 ngày
                </h4>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart>
              <CardHeader color="success">
                {numFormulaAOnW != undefined && (
                  <ChartistGraph
                    className="ct-chart"
                    data={numFormulaAOnW.data}
                    type="Line"
                    options={numFormulaAOnW.options}
                    listener={numFormulaAOnW.animation}
                  />
                )}
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Được duyệt trong 7 ngày</h4>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart>
              <CardHeader color="danger">
                {numFormulaPOnW != undefined && (
                  <ChartistGraph
                    className="ct-chart"
                    data={numFormulaPOnW.data}
                    type="Line"
                    options={numFormulaPOnW.options}
                    listener={numFormulaPOnW.animation}
                  />
                )}
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Trì hoãn trong 7 ngày</h4>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
      <div>
        <h2>
          <b>Nguyên liệu</b>
        </h2>
        {materialStatic != undefined && materialList.length > 0 && (
          <>
            <GridItem xs={12} sm={6} md={6}>
              <Card>
                <CardHeader color="info" stats icon>
                  <p className={classes.cardCategory}>
                    Tổng số nguyên liệu đã sử dụng
                  </p>
                  <h3 className={classes.cardTitle}>
                    {materialStatic.total_material_used}
                  </h3>
                </CardHeader>
              </Card>
            </GridItem>
            <GridContainer>
              <GridItem xs={12} sm={6} md={6}>
                <Card>
                  <CardHeader color="info" stats icon>
                    <p className={classes.cardCategory}>
                      <b>Nguyên liệu sử dụng nhiều lần nhất: </b>{" "}
                      {materialStatic.most_material_id_used_time}
                    </p>
                    <h4 className={classes.cardTitle}>
                      <b>Tên: </b>
                      {
                        convertMaterIDToMater(
                          materialStatic.most_material_id_used
                        ).name
                      }
                    </h4>
                    <h4 className={classes.cardTitle}>
                      <b>Tên inci: </b>
                      {
                        convertMaterIDToMater(
                          materialStatic.most_material_id_used
                        ).inciName
                      }
                    </h4>
                    <h4 className={classes.cardTitle}>
                      <b>Trade name: </b>
                      {
                        convertMaterIDToMater(
                          materialStatic.most_material_id_used
                        ).tradeName
                      }
                    </h4>
                  </CardHeader>
                </Card>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <Bar options={options} data={data} />
            </GridContainer>
          </>
        )}
      </div>
    </>
  );
}
