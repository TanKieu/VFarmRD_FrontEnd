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
export const CreateClientForm = () => {
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
    const name = event.target.ClientName.value;
    const address = event.target.ClientAddress.value;
    const ward = event.target.ClientWard.value;
    const district = event.target.ClientDistrict.value;
    const city = event.target.ClientCity.value;
    const email = event.target.ClientEmail.value;
    const phone = event.target.ClientPhone.value;
    const dataClient = {
      name,
      phone,
      email,
      ward,
      district,
      city,
      address,
    };
    console.log(dataClient);
    const urlCreateClientRequest =
      process.env.REACT_APP_WAREHOUSE + "/api/v1/customer";
    const noti = toast("Please wait...");
    fetch(urlCreateClientRequest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "rd-token": `${rdToken}`,
      },
      body: JSON.stringify(dataClient),
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
        document.getElementById("create-client-form").reset();
        toast.update(noti, {
          render: error.toString(),
          type: "error",
          isLoading: false,
        });
      });
  };
  return (
    <form id="create-client-form" onSubmit={onSubmit}>
      <div className="form-group">
        <Card>
          <CardHeader color="info">Thông tin khách hàng</CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  color="primary"
                  labelText="Tên Khách hàng"
                  id="ClientName"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: false,
                    rows: 1,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  color="primary"
                  labelText="Địa chỉ"
                  id="ClientAddress"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: true,
                    rows: 2,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  color="primary"
                  labelText="Phường/Xã"
                  id="ClientWard"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: false,
                    rows: 1,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  color="primary"
                  labelText="Quận/Huyện"
                  id="ClientDistrict"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: false,
                    rows: 1,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  color="primary"
                  labelText="Tỉnh/Thành phố"
                  id="ClientCity"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: false,
                    rows: 1,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6} onChange={handlePhone}>
                <CustomInput
                  color="primary"
                  labelText="Số điện thoại"
                  id="ClientPhone"
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
              <GridItem xs={12} sm={12} md={6} onChange={handleEmail}>
                <CustomInput
                  color="primary"
                  labelText="Email"
                  id="ClientEmail"
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
export default CreateClientForm;
