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

import Select from "react-dropdown-select";
const options = [
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
];

const styles = {
  errorMessage: {
    color: "red",
  },
};

const useStyles = makeStyles(styles);

export const CreateUserForm = () => {
  var [role_name, setRole] = useState("staff");
  const classes = useStyles();
  //const [disabled, setDisabled] = useState(true);
  // function timeout(milliseconds, promise) {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       reject(new Error("timeout exceeded"));
  //     }, milliseconds);
  //     promise.then(resolve, reject);
  //   });
  // }
  const [formError, setFormErrors] = useState({});
  const handleUsername = (e) => {
    console.log(e.target.value);
    if (e.target.value.length < 3) {
      setFormErrors({
        ...formError,
        user_name: "Tên đăng nhập phải có ít nhất 3 ký tự",
      });
    } else if (e.target.value.length > 20) {
      setFormErrors({
        ...formError,
        user_name: "Tên đăng nhập phải ít hơn 20 ký tự",
      });
    } else if (!/^[a-zA-Z0-9]+$/.test(e.target.value)) {
      setFormErrors({
        ...formError,
        user_name: "Tên đăng nhập chỉ chứa ký tự a-z, A-Z, 0-9",
      });
    } else {
      setFormErrors({
        ...formError,
        user_name: "",
      });
    }
  };
  const handleFullname = (e) => {
    console.log(e.target.value);
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
        email: "Email phải có ít nhất 10 ký tự",
      });
    } else if (e.target.value.length > 80) {
      setFormErrors({
        ...formError,
        email: "Email phải ít hơn 80 ký tự",
      });
    } else if (!/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(e.target.value)) {
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
  const handleRole = (e) => {
    setRole(e);
    if (role_name.length === 0) {
      setFormErrors({
        ...formError,
        role_name: "Vui lòng chọn chức vụ",
      });
    } else {
      setFormErrors({
        ...formError,
        role_name: "",
      });
    }
  };
  const onSubmit = (event) => {
    event.preventDefault(event);
    const user_name = event.target.user_name.value;
    const fullname = event.target.fullname.value;
    const phone = event.target.phone.value;
    const email = event.target.email.value;
    const password =
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const datajson = {
      user_name,
      password,
      email,
      fullname,
      phone,
      role_name,
    };
    const token = localStorage.getItem("token");
    const urlCreateUserRequest =
      process.env.REACT_APP_SERVER_URL + "/api/auth/create";
    const noti = toast("Please wait...");
    fetch(urlCreateUserRequest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datajson),
    })
      .then((response) => {
        if (!response.ok) return response.json();
        else {
          toast.update(noti, {
            render: "Tạo nhân viên thành công",
            type: "success",
            isLoading: false,
          });
          setTimeout(() => {
            location.reload();
          }, 2000);
          return response.status;
        }
      })
      .then((res) => {
        if (res.status != 200) {
          toast.update(noti, {
            render: res.message,
            type: "error",
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        document.getElementById("create-user-form").reset();
        toast.update(noti, {
          render: error.toString(),
          type: "error",
          isLoading: false,
        });
      });
  };
  return (
    <form id="create-user-form" onSubmit={onSubmit}>
      <div className="form-group">
        <Card>
          <CardHeader color="info">Thông tin nhân viên</CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12} onChange={handleUsername}>
                <CustomInput
                  color="primary"
                  labelText="Tên đăng nhập"
                  id="user_name"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: false,
                    rows: 1,
                  }}
                />
                <p className={classes.errorMessage}> {formError.user_name}</p>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} onChange={handleEmail}>
                <CustomInput
                  labelText="Email"
                  id="email"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: false,
                    rows: 1,
                  }}
                />
                <p className={classes.errorMessage}> {formError.email}</p>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} onChange={handleFullname}>
                <CustomInput
                  labelText="Họ tên"
                  id="fullname"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    multiline: false,
                    rows: 1,
                  }}
                />
                <p className={classes.errorMessage}> {formError.fullname}</p>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} onChange={handlePhone}>
                <CustomInput
                  labelText="Số điện thoại"
                  id="phone"
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
              <GridItem xs={12} sm={12} md={12} onChange={handleRole}>
                <Select
                  options={options}
                  placeholder="Chức vụ"
                  onChange={(e) => {
                    role_name = e[0].value;
                    setRole(e[0].value);
                    console.log(e.value);
                    console.log(e);
                    console.log(role_name);
                  }}
                />
                <p className={classes.errorMessage}> {formError.role}</p>
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter>
            <div className="form-group">
              <Button
                className="form-control btn btn-primary"
                type="submit"
                color="info"
                disabled={
                  !(formError.user_name == "") &&
                  !(formError.fullname == "") &&
                  !(formError.email == "") &&
                  !(formError.phone == "") &&
                  !(formError.role === "")
                }
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
export default CreateUserForm;
