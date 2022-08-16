/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
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
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const styles = {
  errorMessage: {
    color: "red",
  },
};

const useStyles = makeStyles(styles);
const rdToken = process.env.REACT_APP_RD_TOKEN;
export default function ClientUpdate() {
  const classes = useStyles();
  const location = useLocation();
  const clientData = location.state.clientData;

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
    const client_id = clientData._id;
    console.log(client_id);
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
    }
    console.log(dataClient);
    const urlUpdateClient = process.env.REACT_APP_WAREHOUSE + "/api/v1/customer/" + client_id;
    console.log(urlUpdateClient);
    const notiUpdate = toast("Please wait...");
    fetch(urlUpdateClient, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "rd-token": `${rdToken}`,
      },
      body: JSON.stringify(dataClient),
    })
      .then((res) => {
        console.log(res);
        if (!res.ok) throw new Error(res.status);
        else {
          toast.update(notiUpdate, {
            render: "Cập nhật thành công",
            type: "success",
            isLoading: false,
          });
          return res.status;
        }
      })
      .catch((error) => {
        console.log(error);
        toast.update(notiUpdate, {
          render: error.toSring(),
          type: "error",
          isLoading: false,
        });
      });
  };

  return (
    <GridContainer>
      <ToastContainer />
      <GridItem xs={12} sm={12} md={12}>
        <Button type="button" color="info">Thêm Khách Hàng</Button>
        <Card>
          <CardHeader color="info">
            <GridItem>
              Thông Tin Khách hàng
            </GridItem>
          </CardHeader>
          <form id="update-client-form" onSubmit={onSubmit}>
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
                      defaultValue: clientData.name,
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
                      defaultValue: clientData.address,
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
                      defaultValue: clientData.ward,
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
                      defaultValue: clientData.district,
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
                      defaultValue: clientData.city,
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
                      defaultValue: clientData.phone,
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
                      defaultValue: clientData.email,
                    }}
                  />
                  <p className={classes.errorMessage}>{formError.email}</p>
                </GridItem>
              </GridContainer>
              <Button
                color="info"
                type="submit"
              >
                Cập nhật
              </Button>
            </CardBody>
          </form>
        </Card>
      </GridItem>
    </GridContainer>
  );
}