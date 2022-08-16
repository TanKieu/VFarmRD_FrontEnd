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
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";

const styles = {
  errorMessage: {
    color: "red",
  },
};

const useStyles = makeStyles(styles);
const rdToken = process.env.REACT_APP_RD_TOKEN;
export default function SupplierDetail() {
  const classes = useStyles();
  const location = useLocation();
  const supData = location.state.supData;

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
    const sup_id = supData._id;
    console.log(sup_id);
    const name = event.target.SupplierName.value;
    const contactPerson = event.target.SupContactPerson.value;
    const contactPhone = event.target.SupContactPhone.value;
    const contactEmail = event.target.Email.value;
    const dataSup = {
      name,
      contactPerson,
      contactPhone,
      contactEmail,
    }
    console.log(dataSup);
    const urlUpdateSupplier = process.env.REACT_APP_WAREHOUSE + "/api/v1/supplier/" + sup_id;
    console.log(urlUpdateSupplier);
    const notiUpdate = toast("Please wait...");
    fetch(urlUpdateSupplier, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "rd-token": `${rdToken}`,
      },
      body: JSON.stringify(dataSup),
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
          setTimeout(() => {
            history.back();
          }, 1000);
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
    <>
      <div className="navbar">
        <AdminNavbarLinks />
      </div>
      <GridContainer>
        <ToastContainer />
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="info">
              <GridItem>
                Thông Tin Nhà Cung Cấp
              </GridItem>
            </CardHeader>
            <form id="update-supplier-form" onSubmit={onSubmit}>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={3}>
                    <CustomInput
                      color="primary"
                      labelText="Id"
                      id="Id"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: supData._id,
                        readOnly: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Tên Nhà Cung Cấp"
                      id="SupplierName"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        defaultValue: supData.name,
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
                        defaultValue: supData.contactPerson,
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
                        defaultValue: supData.contactPhone,
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
                        defaultValue: supData.contactEmail,
                      }}
                    />
                    <p className={classes.errorMessage}>{formError.email}</p>
                  </GridItem>
                </GridContainer>
                <Button
                  color="info"
                  type="submit"
                  disabled={!(formError.email == "") && !(formError.phone == "")}
                >
                  Cập nhật
                </Button>
              </CardBody>
            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
}
