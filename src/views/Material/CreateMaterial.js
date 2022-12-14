/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
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
// import { useHistory } from "react-router-dom";
import CardFooter from "components/Card/CardFooter";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Select from "react-dropdown-select";

const styles = {
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
  errorMessage: {
    color: "red",
  },
};

const useStyles = makeStyles(styles);

export default function CreateMaterial() {
  const classes = useStyles();
  const [formError, setFormErrors] = useState({});
  const urlUnit = process.env.REACT_APP_WAREHOUSE + "/api/v1/material/units";
  const urlGroupCode =
    process.env.REACT_APP_WAREHOUSE + "/api/v1/material/groups";
  const rdToken = process.env.REACT_APP_RD_TOKEN;
  const [unitOption, setUnitOption] = useState([]);
  const [groupOption, setGroupOption] = useState([]);
  const [groupCode, setGroupCode] = useState();
  const [unit, setUnit] = useState();

  const handleMatName = (e) => {
    if (e.target.value === "") {
      setFormErrors({
        ...formError,
        name: "T??n Nguy??n li???u kh??ng ???????c ????? tr???ng",
      });
    } else if (e.target.value.length > 1000) {
      setFormErrors({
        ...formError,
        name: "T??n Nguy??n li???u ph???i ??t h??n 1000 k?? t???",
      });
    } else {
      setFormErrors({
        ...formError,
        name: "",
      });
    }
  };

  const handleUnit = (e) => {
    setUnit(e[0].value);
    if (unit === "") {
      setFormErrors({
        ...formError,
        unit: "????n v??? kh??ng ???????c ????? tr???ng",
      });
    } else {
      setFormErrors({
        ...formError,
        unit: "",
      });
    }
  };

  const handleInciName = (e) => {
    if (e.target.value === "") {
      setFormErrors({
        ...formError,
        inciName: "InciName kh??ng ???????c ????? tr???ng",
      });
    } else if (e.target.value.length > 1000) {
      setFormErrors({
        ...formError,
        inciName: "InciName ph???i ??t h??n 1000 k?? t???",
      });
    } else {
      setFormErrors({
        ...formError,
        inciName: "",
      });
    }
  };

  const handleGroupCode = (e) => {
    setGroupCode(e[0].value);
    if (groupCode === "") {
      setFormErrors({
        ...formError,
        groupCode: "Kh??ch h??ng kh??ng ???????c ????? tr???ng",
      });
    } else {
      setFormErrors({
        ...formError,
        groupCode: "",
      });
    }
  };
  const handleUnitPrice = (e) => {
    if (!e.target.value.match(/^[+]?((\.\d+)|(\d+(\.\d+)?)|(\d+\.))$/)) {
      setFormErrors({
        ...formError,
        unitPrice: "????n gi?? s???n ph???m d??? ki???n ph???i s??? l???n h??n ho???c b???ng 0",
      });
    } else {
      setFormErrors({
        ...formError,
        unitPrice: "",
      });
    }
  };

  const fetchData = () => {
    axios
      .get(urlUnit, {
        headers: {
          "Content-Type": "application/json",
          "rd-token": rdToken,
        },
      })
      .then((res) => {
        console.log(res.data.materialUnits);
        setUnitOption(
          res.data.materialUnits.map((item) => {
            var option = {
              value: item,
              label: item,
            };
            return option;
          })
        );
        console.log(unitOption);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(urlGroupCode, {
        headers: {
          "Content-Type": "application/json",
          "rd-token": rdToken,
        },
      })
      .then((res) => {
        console.log(res);
        setGroupOption(
          res.data.materialGroup.map((group) => {
            var option = {
              value: group.code,
              label: "(" + group.group + ") " + group.name,
            };
            return option;
          })
        );
        console.log(groupOption);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const create = (event) => {
    event.preventDefault();
    const urlCreateMaterial =
      process.env.REACT_APP_WAREHOUSE + "/api/v1/material/create";
    const materialName = event.target.name.value;
    const inciName = event.target.inciName.value;
    const kho = "600a8a1e3fb5d34046a6f4c4";
    const unitPrice = event.target.unitPrice.value;
    const dateMaterial = {
      unit,
      materialName,
      inciName,
      kho,
      unitPrice,
      groupCode,
    };
    console.log(dateMaterial);
    const noti = toast("Please wait...");
    fetch(urlCreateMaterial, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "rd-token": `${rdToken}`,
      },
      body: JSON.stringify(dateMaterial),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else {
          toast.update(noti, {
            render: "T???o nguy??n li???u th??nh c??ng",
            type: "success",
            isLoading: false,
          });
          history.back();
          return response.status;
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
  };

  return (
    <form id="create-material-form" onSubmit={create}>
      <div className="create-material">
        <ToastContainer />
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info" className={classes.cardTitleWhite}>
                Th??ng tin Nguy??n li???u
              </CardHeader>
              <CardBody>
                <GridItem xs={12} sm={12} md={12} onChange={handleMatName}>
                  <CustomInput
                    color="primary"
                    labelText="T??n nguy??n li???u"
                    id="name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                    }}
                  />
                  <p className={classes.errorMessage}>{formError.name}</p>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <Select
                    options={unitOption}
                    placeholder="Ch???n ????n v???"
                    onChange={handleUnit}
                  />
                  <p className={classes.errorMessage}>{formError.unit}</p>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} onChange={handleInciName}>
                  <CustomInput
                    color="primary"
                    labelText="inciName"
                    id="inciName"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                    }}
                  />
                  <p className={classes.errorMessage}>{formError.inciName}</p>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} onChange={handleUnitPrice}>
                  <CustomInput
                    color="primary"
                    labelText="????n gi??"
                    id="unitPrice"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                    }}
                  />
                  <p className={classes.errorMessage}>{formError.unitPrice}</p>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <Select
                    options={groupOption}
                    placeholder="Ch???n nh??m nguy??n li???u"
                    onChange={handleGroupCode}
                  />
                  <p className={classes.errorMessage}>{formError.groupCode}</p>
                </GridItem>
              </CardBody>
              <CardFooter>
                <Button
                  className="form-control btn btn-primary"
                  type="submit"
                  color="info"
                  disabled={
                    !(formError.name === "") &&
                    !(formError.unitPrice === "") &&
                    !(formError.unit === "") &&
                    !(formError.groupCode === "") &&
                    !(formError.inciName === "")
                  }
                >
                  T???o
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </form>
  );
}
