/* eslint-disable react/prop-types */
//import TriggerButton from "components/CustomButtons/TriggerButton";
//import CustomInput from "components/CustomInput/CustomInput";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";
import CardHeader from "components/Card/CardHeader";
//import DropDown from "react-dropdown";
//import Select from "@material-ui/core/Select/SelectInput";
//import { InputLabel } from "@material-ui/core";
//import { MenuItem } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomInput from "components/CustomInput/CustomInput";
import Select from "react-dropdown-select";
import axios from "axios";
import ReactDatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import TextInput from "react-autocomplete-input";
import "react-autocomplete-input/dist/bundle.css";

const styles = {
  errorMessage: {
    color: "red",
  },
};

const useStyles = makeStyles(styles);

export const CreateProjectForm = () => {
  var [clientOptions, setClientOptions] = useState([]);
  const token = localStorage.getItem("token");
  const [assigned_user_id, setAssignedId] = useState([]);
  const [client_id, setClientId] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [completeDate, setCompleteDate] = useState(new Date());
  const [btnStatus, setBtnStatus] = useState(false);
  const [project_name, setProjectName] = useState();
  const [project_code, setProjectCode] = useState();
  const [requirement, setRequirement] = useState();
  const [estimated_weight, setEstWeight] = useState();

  const [formError, setFormErrors] = useState({});

  const client = useSelector((state) => state.sendNoti);

  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const defaultRequirement =
    `S???n ph???m thu???c lo???i: ,\n` +
    `?????i t?????ng: ,\n` +
    `M???c ????ch: ,\n` +
    `Dung t??ch th??nh ph???m: ,\n` +
    `Y??u c???u ????ng g??i: ,\n`;

  // const handleProID = (e) => {
  //   if (e.target.value === "") {
  //     setFormErrors({
  //       ...formError,
  //       product_code: "Product ID kh??ng ???????c ????? tr???ng",
  //     });
  //   } else if (e.target.value.length > 50) {
  //     setFormErrors({
  //       ...formError,
  //       product_code: "Product ID ph???i ??t h??n 30 k?? t???",
  //     });
  //   } else if (!/^[a-zA-Z0-9]+$/.test(e.target.value)) {
  //     setFormErrors({
  //       ...formError,
  //       product_code: "Product ID ph???i l?? ch??? ho???c s???",
  //     });
  //   } else {
  //     setFormErrors({
  //       ...formError,
  //       product_code: "",
  //     });
  //   }
  // };
  const subDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  const checkValid = () => {
    if (
      assigned_user_id == undefined ||
      client_id == undefined ||
      project_name == undefined ||
      project_code == undefined ||
      requirement == undefined ||
      estimated_weight == undefined
    ) {
      setBtnStatus(false);
    } else if (
      (formError.project_name != undefined || formError.project_name != "") &&
      (formError.project_code != undefined || formError.project_code != "") &&
      (formError.esti_weight != undefined || formError.esti_weight != "") &&
      (formError.assigned_user_id != undefined ||
        formError.assigned_user_id != "") &&
      (formError.client_id != undefined || formError.client_id != "") &&
      (formError.startDate != undefined || formError.startDate != "") &&
      (formError.endDate != undefined || formError.endDate != "") &&
      (formError.project_inquiry != undefined ||
        formError.project_inquiry != "")
    ) {
      setBtnStatus(true);
    } else {
      setBtnStatus(true);
    }
  };
  const handleProName = (e) => {
    if (e.target.value === "") {
      setFormErrors({
        ...formError,
        project_name: "T??n d??? ??n kh??ng ???????c ????? tr???ng",
      });
      setBtnStatus(false);
    } else if (e.target.value.length > 255) {
      setFormErrors({
        ...formError,
        project_name: "T??n d??? ??n ph???i ??t h??n 255 k?? t???",
      });
      setBtnStatus(false);
    } else {
      setFormErrors({
        ...formError,
        project_name: "",
      });
      setProjectName(e.target.value);
      checkValid();
    }
  };
  const handleProCode = (e) => {
    if (e.target.value === "") {
      setFormErrors({
        ...formError,
        project_code: "M?? d??? ??n kh??ng ???????c ????? tr???ng",
      });
      setBtnStatus(false);
    } else if (e.target.value.length > 20) {
      setFormErrors({
        ...formError,
        project_code: "M?? d??? ??n ph???i ??t h??n 20 k?? t???",
      });
      setBtnStatus(false);
    } else {
      setFormErrors({
        ...formError,
        project_code: "",
      });
      setProjectCode(e.target.value);
      checkValid();
    }
  };
  const handleEstiWeight = (e) => {
    if (!e.target.value.match(/^[+]?((\.\d+)|(\d+(\.\d+)?)|(\d+\.))$/)) {
      setFormErrors({
        ...formError,
        esti_weight: "kh???i l?????ng s???n ph???m d??? ki???n ph???i s??? l???n h??n ho???c b???ng 0",
      });
      setBtnStatus(false);
    } else {
      setFormErrors({
        ...formError,
        esti_weight: "",
      });
      setEstWeight(e.target.value);
      checkValid();
    }
  };

  //   const handleVolume = (e) => {
  //     if (!/^[0-9]+$/.test(e.target.value)) {
  //       setFormErrors({
  //         ...formError,
  //         volume: "Kh???i l?????ng ph???i l?? s??? t??? nhi??n l???n h??n ho???c b???ng 0",
  //       });
  //     } else {
  //       setFormErrors({
  //         ...formError,
  //         volume: "",
  //       });
  //     }
  //   };
  //   const handleCapacity = (e) => {
  //     if (!/^[0-9]+$/.test(e.target.value)) {
  //       setFormErrors({
  //         ...formError,
  //         capacity: "Dung t??ch ph???i l?? s??? t??? nhi??n l???n h??n ho???c b???ng 0",
  //       });
  //     } else {
  //       setFormErrors({
  //         ...formError,
  //         capacity: "",
  //       });
  //     }
  //   };
  //   const handleD = (e) => {
  //     if (!e.target.value.match(/^[+]?((\.\d+)|(\d+(\.\d+)?)|(\d+\.))$/)) {
  //       setFormErrors({
  //         ...formError,
  //         d: "d ph???i l?? s??? l???n h??n ho???c b???ng 0",
  //       });
  //     } else {
  //       setFormErrors({
  //         ...formError,
  //         d: "",
  //       });
  //     }
  //   };
  //   const handleTolerance = (e) => {
  //     if (!e.target.value.match(/^[+]?((\.\d+)|(\d+(\.\d+)?)|(\d+\.))$/)) {
  //       setFormErrors({
  //         ...formError,
  //         tolerance: "Dung t??ch ph???i l?? s??? l???n h??n ho???c b???ng 0",
  //       });
  //     } else {
  //       setFormErrors({
  //         ...formError,
  //         tolerance: "",
  //       });
  //     }
  //   };
  //   const handleNormLoss = (e) => {
  //     if (!/^[0-9]+$/.test(e.target.value)) {
  //       setFormErrors({
  //         ...formError,
  //         norm_loss:
  //           "Hao h???t nguy??n li???u ph???i l?? s??? t??? nhi??n l???n h??n ho???c b???ng 0",
  //       });
  //     } else {
  //       setFormErrors({
  //         ...formError,
  //         norm_loss: "",
  //       });
  //     }
  //   };
  //   const handleRetailPrice = (e) => {
  //     if (!e.target.value.match(/^[+]?((\.\d+)|(\d+(\.\d+)?)|(\d+\.))$/)) {
  //       setFormErrors({
  //         ...formError,
  //         retail_price: "Gi?? b??n ph???i l?? s??? l???n h??n ho???c b???ng 0",
  //       });
  //     } else {
  //       setFormErrors({
  //         ...formError,
  //         retail_price: "",
  //       });
  //     }
  //   };
  const handleAssigned = (e) => {
    const listAssign = [];
    if (e.length == 0) {
      setFormErrors({
        ...formError,
        assigned_user_id: "Ng?????i ph??? tr??ch kh??ng ???????c ????? tr???ng",
      });
      setBtnStatus(false);
    } else {
      setFormErrors({
        ...formError,
        assigned_user_id: "",
      });
      e.forEach((emp) => {
        listAssign.push(emp.value);
      });
      setAssignedId(listAssign);
      checkValid();
    }
  };
  const handleClient = (e) => {
    if (e[0].value === "") {
      setFormErrors({
        ...formError,
        client_id: "Kh??ch h??ng kh??ng ???????c ????? tr???ng",
      });
      setBtnStatus(false);
    } else {
      setFormErrors({
        ...formError,
        client_id: "",
      });
      setClientId(e[0].value);
      checkValid();
    }
  };
  const handleStartDate = (date) => {
    const start = new Date();
    if (date.getFullYear() < start.getFullYear()) {
      setFormErrors({
        ...formError,
        startDate: "Ng??y b???t ?????u kh??ng h???p l???",
      });
      setBtnStatus(false);
    } else if (date.getMonth() < start.getMonth()) {
      setFormErrors({
        ...formError,
        startDate: "Ng??y b???t ?????u kh??ng h???p l???",
      });
      setBtnStatus(false);
    } else if (date.getDay() < start.getDay()) {
      setFormErrors({
        ...formError,
        startDate: "Ng??y b???t ?????u kh??ng h???p l???",
      });
      setBtnStatus(false);
    } else if (date > completeDate) {
      setFormErrors({
        ...formError,
        startDate: "Ng??y b???t ?????u kh??ng h???p l???",
      });
      setBtnStatus(false);
    } else {
      setFormErrors({
        ...formError,
        startDate: "",
        endDate: "",
      });
      setStartDate(date);
      checkValid();
    }
  };

  const handleEndDate = (date) => {
    if (date < startDate) {
      setFormErrors({
        ...formError,
        endDate: "Ng??y ho??n th??nh kh??ng h???p l???",
      });
      setBtnStatus(false);
    } else {
      setFormErrors({
        ...formError,
        endDate: "",
        startDate: "",
      });
      setCompleteDate(date);
      checkValid();
    }
  };
  const handleProInquiry = (e) => {
    if (e.target.value === "") {
      setFormErrors({
        ...formError,
        project_inquiry: "Ghi ch?? kh??ng ???????c ????? tr???ng",
      });
      setBtnStatus(false);
    } else if (e.target.value.length > 1000) {
      setFormErrors({
        ...formError,
        project_inquiry: "Ghi ch?? ph???i ??t h??n 1000 k?? t???",
      });
      setBtnStatus(false);
    } else {
      setFormErrors({
        ...formError,
        project_inquiry: "",
      });
      setRequirement(e.target.value);
      checkValid();
    }
  };
  const rdToken = process.env.REACT_APP_RD_TOKEN;
  const urlUserRequest =
    process.env.REACT_APP_SERVER_URL +
    "/api/users?role_name=staff&user_status=true&page=0&size=1000";
  const urlCustomer = process.env.REACT_APP_WAREHOUSE + "/api/v1/customer";
  var [EmpOptions, setEmpOptions] = useState([]);
  const fetchData = () => {
    axios
      .get(urlUserRequest, {
        headers: {
          "Conttent-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEmpOptions(
          res.data.map((emp) => {
            var option = {
              value: emp.user_id,
              label: emp.fullname + " (" + emp.email + " )",
            };
            return option;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(urlCustomer, {
        headers: {
          "Conttent-Type": "application/json",
          "rd-token": `${rdToken}`,
        },
      })
      .then((res) => {
        setClientOptions(
          res.data.customers.map((client) => {
            var option = {
              value: client._id,
              label: client.name,
            };
            return option;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  const onSubmit = (event) => {
    event.preventDefault(event);
    const datajson = {
      project_name: project_name,
      project_code: project_code,
      requirement: requirement,
      estimated_weight: estimated_weight,
      client_id: client_id,
      listUser_id: assigned_user_id,
      start_date: startDate.toISOString(),
      complete_date: completeDate.toISOString(),
    };
    console.log(token);
    console.log(datajson);
    const urlCreateProjectRequest =
      process.env.REACT_APP_SERVER_URL + "/api/projects/";
    const noti = toast("Please wait...");
    fetch(urlCreateProjectRequest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datajson),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response);
        else {
          toast.update(noti, {
            render: "T???o d??? ??n th??nh c??ng",
            type: "success",
            isLoading: false,
          });
          assigned_user_id.forEach((user_id) => {
            client.send(
              JSON.stringify({
                type: "noti",
                message: `B???n ???? ???????c th??m v??o v??o d??? ??n ${project_code}-${project_name}`,
                assignedId: user_id,
              })
            );
          });
          setTimeout(() => {
            location.reload();
          }, 3000);
          return response.json();
        }
      })
      //   .then((resule) => {
      // const urlWarehousrCreateProduct =
      //   process.env.REACT_APP_WAREHOUSE + "/api/v1/product";
      // toast.update(noti, {
      //   render: "??ang t???o s???n ph???m b??n h??? th???ng kho",
      //   type: "default",
      //   isLoading: true,
      // });
      // console.log(resule);
      // console.log(resule.product_code);
      // var dataForm = new FormData();
      // const productGroup = "601be9fbdcfc6210f9e94936";
      // dataForm.append("image", undefined);
      // dataForm.append("name", product_name);
      // dataForm.append("code", resule.product_code);
      // dataForm.append("volumn", volume);
      // dataForm.append("expriedDate", expired_date);
      // dataForm.append("retailPrice", retail_price);
      // dataForm.append("moq", null);
      // dataForm.append("productGroup", productGroup);
      // fetch(urlWarehousrCreateProduct, {
      //   method: "POST",
      //   headers: {
      //     "Conttent-Type": "application/json",
      //     "rd-token": `${rdToken}`,
      //   },
      //   body: dataForm,
      // })
      //   .then((res2) => {
      //     if (res2.ok) {
      //       toast.update(noti, {
      //         render: "T???o s???n ph???m b??n kho th??nh c??ng",
      //         type: "success",
      //         isLoading: false,
      //       });
      //     } else {
      //       throw new Error(res2.data);
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //     toast.update(noti, {
      //       render: error.status.toString(),
      //       type: "error",
      //       isLoading: false,
      //     });
      //   });
      //   })
      .catch((error) => {
        console.log(error);
        toast.update(noti, {
          render: error.toString(),
          type: "error",
          isLoading: false,
        });
        document.getElementById("create-product-form").reset();
      });
  };
  return (
    <form id="create-project-form" onSubmit={onSubmit}>
      <div className="form-group">
        <Card>
          <CardHeader color="info">T???o M???i D??? ??n M???i</CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12} onChange={handleProName}>
                <CustomInput
                  color="primary"
                  labelText="T??n d??? ??n"
                  id="project_name"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: false,
                    rows: 1,
                  }}
                />
                <p className={classes.errorMessage}>{formError.project_name}</p>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} onChange={handleProCode}>
                <CustomInput
                  labelText="M?? d??? ??n"
                  id="project_code"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: false,
                    rows: 1,
                  }}
                />
                <p className={classes.errorMessage}>{formError.project_code}</p>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} onChange={handleEstiWeight}>
                <CustomInput
                  labelText="kh???i l?????ng s???n ph???m d??? ki???n (g)"
                  id="estimated_weight"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: false,
                    rows: 1,
                  }}
                />
                <p className={classes.errorMessage}>{formError.esti_weight}</p>
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <Select
                  multi
                  options={EmpOptions}
                  placeholder="Nh??n vi??n"
                  onChange={handleAssigned}
                  style={{
                    border: "none",
                    fontSize: "16px",
                    borderBottom: "1px solid #0000004a",
                    color: "#191919",
                    outline: "none !important",
                  }}
                />
                <p className={classes.errorMessage}>
                  {formError.assigned_user_id}
                </p>
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <Select
                  options={clientOptions}
                  placeholder="Kh??ch h??ng"
                  onChange={handleClient}
                  style={{
                    border: "none",
                    fontSize: "16px",
                    borderBottom: "1px solid #0000004a",
                    color: "#191919",
                    outline: "none !important",
                  }}
                />
                <p className={classes.errorMessage}>{formError.client_id}</p>
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                Ng??y b???t ?????u
                <ReactDatePicker
                  selected={startDate}
                  dateFormat="dd/MM/yyyy"
                  excludeDateIntervals={[
                    {
                      start: subDays(new Date(), 10000),
                      end: addDays(new Date(), 0),
                    },
                  ]}
                  onChange={(date) => {
                    handleStartDate(date);
                  }}
                />
                <p className={classes.errorMessage}>{formError.startDate}</p>
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                Ng??y ho??n th??nh
                <ReactDatePicker
                  selected={completeDate}
                  dateFormat="dd/MM/yyyy"
                  excludeDateIntervals={[
                    {
                      start: subDays(new Date(), 10000),
                      end: addDays(new Date(), 0),
                    },
                  ]}
                  onChange={(date) => {
                    handleEndDate(date);
                  }}
                />
                <p className={classes.errorMessage}>{formError.endDate}</p>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} onChange={handleProInquiry}>
                <div data-tip="React-tooltip">
                  {/* <CustomInput
                    labelText="Y??u c???u"
                    id="requirement"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5,
                      defaultValue: requirement,
                    }}
                  /> */}
                  Y??u c???u
                  <TextInput
                    // eslint-disable-next-line prettier/prettier
                    trigger={["", " ", '\n']}
                    matchAny={true}
                    style={{ width: "100%", height: "120px" }}
                    spacer=" ,"
                    options={[
                      "S???n ph???m thu???c lo???i:",
                      "?????i t?????ng:",
                      "M???c ????ch:",
                      "Dung t??ch th??nh ph???m:",
                      "Y??u c???u ????ng g??i:",
                    ]}
                  />
                  <ReactTooltip
                    place="bottom"
                    type="info"
                    effect="solid"
                    overridePosition={({ left, top }) => {
                      // Gets the element's width to be used to adjust the positioning of
                      // the tooltip dependent on the Popover position prop
                      top = 750;
                      return { top, left };
                    }}
                  >
                    <span>Y??u c???u c???a kh??ch h??ng v??? s???n ph???m</span>
                    <ul>
                      <li>S???n ph???m thu???c lo???i</li>
                      <li>?????i t?????ng</li>
                      <li>M???c ????ch</li>
                      <li>Dung t??ch th??nh ph???m</li>
                      <li>Y??u c???u ????ng g??i</li>
                    </ul>
                  </ReactTooltip>
                </div>
                <p className={classes.errorMessage}>
                  {formError.project_inquiry}
                </p>
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter>
            <div className="form-group">
              <Button
                className="form-control btn btn-primary"
                type="submit"
                color="info"
                disabled={!btnStatus}
              >
                T???o
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};
export default CreateProjectForm;
