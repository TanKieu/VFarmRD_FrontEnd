/* eslint-disable react/prop-types */
//import TriggerButton from "components/CustomButtons/TriggerButton";
import CustomInput from "components/CustomInput/CustomInput";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React, { useState } from "react";
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

const styles = {
  errorMessage: {
    color: "red",
  },
};

const useStyles = makeStyles(styles);

const rdToken = process.env.REACT_APP_RD_TOKEN;
export const CreateSupplierForm = () => {
  const classes = useStyles();
  const [formError, setFormErrors] = useState({});
  const handleEmail = (e) => {
    console.log(e.target.value);
    if (e.target.value.length > 0) {
      if (!/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(e.target.value)) {
        setFormErrors({
          ...formError,
          email: "Email không hợp lệ",
        });
      } else {
        setFormErrors({
          ...formError,
          email: "",
        });
      }
    } else {
      setFormErrors({
        ...formError,
        email: "",
      });
    }
  };
  const handlePhone = (e) => {
    console.log(e.target.value);
    if (e.target.value.length < 9) {
      setFormErrors({
        ...formError,
        phone: "Số điện thoại phải có ít nhất 10 ký tự",
      });
    } else if (e.target.value.length > 20) {
      setFormErrors({
        ...formError,
        phone: "Số điện thoại phải ít hơn 20 ký tự",
      });
    } else if (!/^[0-9]+$/.test(e.target.value)) {
      setFormErrors({
        ...formError,
        phone: "Số điện thoại chỉ chứa ký tự 0-9",
      });
    } else {
      setFormErrors({
        ...formError,
        phone: "",
      });
    }
  };
  const onSubmit = (event) => {
    event.preventDefault(event);
    const name = event.target.SupplierName.value;
    const contactPerson = event.target.SupContactPerson.value;
    const contactPhone = event.target.SupContactPhone.value;
    const contactEmail = event.target.Email.value;
    const dataSup = {
      name,
      contactPerson,
      contactPhone,
      contactEmail,
    };
    console.log(dataSup);
    const urlCreateSuppilerRequest =
      process.env.REACT_APP_WAREHOUSE + "/api/v1/supplier";
    const noti = toast("Please wait...");
    fetch(urlCreateSuppilerRequest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "rd-token": `${rdToken}`,
      },
      body: JSON.stringify(dataSup),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else {
          toast.update(noti, {
            render: "Tạo nhà cung cấp thành công",
            type: "success",
            isLoading: false,
          });
          return response.status;
        }
      })
      .catch((error) => {
        console.log(error);
        document.getElementById("create-supplier-form").reset();
        toast.update(noti, {
          render: error.toString(),
          type: "error",
          isLoading: false,
        });
      });
  };
  return (
    <form id="create-supplier-form" onSubmit={onSubmit}>
      <div className="form-group">
        <Card>
          <CardHeader color="info">Thông tin nhà cung cấp</CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="Tên Nhà Cung Cấp"
                  id="SupplierName"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: false,
                    rows: 1,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="Người liên lạc"
                  id="SupContactPerson"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: false,
                    rows: 1,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4} onChange={handlePhone}>
                <CustomInput
                  labelText="Số điện thoại"
                  id="SupContactPhone"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: false,
                    rows: 1,
                  }}
                />
                <p className={classes.errorMessage}>{formError.phone}</p>
              </GridItem>
              <GridItem xs={12} sm={12} md={4} onChange={handleEmail}>
                <CustomInput
                  labelText="Email"
                  id="Email"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: false,
                    rows: 1,
                  }}
                />
                <p className={classes.errorMessage}>{formError.email}</p>
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter>
            <div className="form-group">
              <Button
                className="form-control btn btn-primary"
                type="submit"
                color="info"
                disabled={!(formError.email == "") && !(formError.phone == "")}
              >
                Tạo
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};
export default CreateSupplierForm;
