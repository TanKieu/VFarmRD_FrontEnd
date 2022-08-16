/* eslint-disable react/prop-types */
import React from "react";
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CustomInput from "components/CustomInput/CustomInput";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types, no-unused-vars
export const NotificationForm = (props) => {
  const [btnStt, setBtnStt] = useState(true);
  const client = useSelector((state) => state.sendNoti);
  const onSubmit = (event) => {
    event.preventDefault(event);
    const title = event.target.title.value;
    const content = event.target.message.value;
    const dataJson = {
      listUser_id: props.selectedEmp,
      message: title + " " + content,
    };
    const token = localStorage.getItem("token");
    const urlNotiRequest =
      process.env.REACT_APP_SERVER_URL + "/api/notifications";
    const noti = toast("Please wait...");
    fetch(urlNotiRequest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataJson),
    })
      .then((res) => {
        if (res.status != 200) return false;
        else {
          props.selectedEmp.forEach((id) => {
            client.send(
              JSON.stringify({
                type: "noti",
                message: title + " " + content,
                assignedId: id,
              })
            );
          });

          //   setTimeout(() => {
          //     location.reload();
          //   }, 2000);
          return true;
        }
      })
      .then((res) => {
        if (res) {
          toast.update(noti, {
            render: "Gửi thông báo thành công",
            type: "success",
            isLoading: false,
          });
        } else {
          toast.update(noti, {
            render: "Có lỗi xảy ra",
            type: "error",
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        document.getElementById("push-noti").reset();
        toast.update(noti, {
          render: error.toString(),
          type: "error",
          isLoading: false,
        });
      });
  };
  useEffect(() => {
    if (props.selectedEmp.length == 0) {
      setBtnStt(false);
    }
  }, []);
  // eslint-disable-next-line no-unused-vars
  return (
    <form id="push-noti" onSubmit={onSubmit}>
      <Card>
        <CardHeader color="info">Gửi thông báo</CardHeader>
        <CardBody>
          <p>Đang chọn {props.selectedEmp.length} người dùng</p>
          <CustomInput
            color="primary"
            labelText="Tiêu đề"
            id="title"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              multiline: false,
              rows: 1,
            }}
          />
          <CustomInput
            color="primary"
            labelText="Nội dung"
            id="message"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              multiline: true,
              rows: 3,
            }}
          />
          <Button
            className="form-control btn btn-primary"
            type="submit"
            color="info"
            disabled={!btnStt}
          >
            Gửi
          </Button>
        </CardBody>
      </Card>
    </form>
  );
};
export default NotificationForm;
