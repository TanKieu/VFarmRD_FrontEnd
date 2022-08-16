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
//import Select from "react-dropdown-select";
import { toast, ToastContainer } from "react-toastify";

/*const options = [
  {
    value: "admin",
    label: "admin",
  },
  {
    value: "manager",
    label: "manager",
  },
  {
    value: "staff",
    label: "staff",
  },
];*/

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
  errorMessage: {
    color: "red",
  },
};

const useStyles = makeStyles(styles);
export default function UserProfileUpdate(props) {
  const token = localStorage.getItem("token");
  var showText = "Hiện";
  const [formError, setFormErrors] = useState({});
  const handlePassword = (e) => {
    if (e.target.value.length < 3) {
      setFormErrors({
        ...formError,
        password: "Password phải có ít nhất 3 ký tự",
      });
    } else if (e.target.value.length > 60) {
      setFormErrors({
        ...formError,
        password: "Password không được quá 40 ký tự",
      });
    } else {
      setFormErrors({
        ...formError,
        password: "",
      });
    }
  };
  const handleFullname = (e) => {
    if (e.target.value.length < 3) {
      setFormErrors({
        ...formError,
        fullname: "Họ tên phải có ít nhất 3 ký tự",
      });
    } else if (e.target.value.length > 50) {
      setFormErrors({
        ...formError,
        fullname: "Họ tên phải ít hơn 50 ký tự",
      });
    } else {
      setFormErrors({
        ...formError,
        fullname: "",
      });
    }
  };
  const handleEmail = (e) => {
    if (e.target.value.length < 10) {
      setFormErrors({
        ...formError,
        emailva: "Email phải có ít nhất 10 ký tự",
      });
    } else if (e.target.value.length > 80) {
      setFormErrors({
        ...formError,
        emailva: "Email phải ít hơn 80 ký tự",
      });
    } else if (!/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(e.target.value)) {
      setFormErrors({
        ...formError,
        emailva: "Email không hợp lệ",
      });
    } else {
      setFormErrors({
        ...formError,
        email: "",
      });
    }
  };
  const handlePhone = (e) => {
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

  var email = props.user.email;
  var [passType, setPassType] = useState("password");
  const classes = useStyles();

  function showOnclick() {
    if (passType === "password") {
      setPassType("text");
      showText = "Ẩn";
    } else {
      setPassType("password");
      showText = "Hiện";
    }

  }

  const onSubmit = (event) => {
    event.preventDefault(event);
    const user_id = parseInt(props.user.user_id);
    const fullname = event.target.fullname.value;
    const phone = event.target.phone.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const role_name = props.user.role_name;
    const dataJson = {
      user_id,
      email,
      fullname,
      phone,
      password,
      role_name
    }
    console.log(JSON.stringify(dataJson));
    const urlUpdateUserRequest = process.env.REACT_APP_SERVER_URL + `/api/users/update`;
    const notiUpdate = toast("Please wait ...");
    fetch(urlUpdateUserRequest, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataJson),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else {
          toast.update(notiUpdate, {
            render: "Cập nhật thành công",
            type: "success",
            isLoading: false,
          });
          return response.status;
        }
      })
      .catch((error) => {
        console.log(error);
        toast.update(notiUpdate, {
          render: error.toString(),
          type: "error",
          isLoading: false,
        });
      });
  };

  return (
    <GridContainer>
      <ToastContainer />
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" className={classes.cardTitleWhite}>
            <GridItem>
              Thông Tin Nhân Viên
            </GridItem>

          </CardHeader>
          <GridItem xs={10} sm={10} md={2}>
          </GridItem>
          <form id="user-profile-update-form" onSubmit={onSubmit}>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    color="primary"
                    labelText="Tên đăng nhập"
                    id="user_name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 1,
                      value: props.user.user_name,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4} onChange={handlePassword}>
                  <CustomInput
                    labelText="Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                      defaultValue: props.user.password,
                      type: passType
                    }}
                  />
                  <p className={classes.errorMessage}> {formError.password} </p>
                  <Button onClick={showOnclick}>{showText}</Button>
                </GridItem>
                <GridItem xs={12} sm={12} md={4} onChange={handleEmail}>
                  <CustomInput
                    labelText="Email"
                    id="email"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                      defaultValue: email,
                    }}
                  />
                  <p className={classes.errorMessage}> {formError.emailva} </p>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4} onChange={handleFullname}>
                  <CustomInput
                    labelText="Họ tên"
                    id="fullname"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                      defaultValue: props.user.fullname
                    }}
                  />
                  <p className={classes.errorMessage}> {formError.fullname} </p>
                </GridItem>
                <GridItem xs={12} sm={12} md={4} onChange={handlePhone} >
                  <CustomInput
                    labelText="Số điện thoại"
                    id="phone"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                      defaultValue: props.user.phone
                    }}
                  />
                  <p className={classes.errorMessage}> {formError.phone} </p>
                </GridItem>
              </GridContainer>
              <Button
                color="info"
                type="submit"
                disabled={
                  !(formError.fullname == "") &&
                  !(formError.emailva == "") &&
                  !(formError.phone == "") &&
                  !(formError.password == "")
                }
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
