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

const styles = {
  errorMessage: {
    color: "red",
  },
};

const useStyles = makeStyles(styles);

export const CreateProductForm = ({ data }) => {
  var [clientOptions, setClientOptions] = useState([]);
  const token = localStorage.getItem("token");
  // const [assigned_user_id, setAssignedId] = useState();
  const [client_id, setClientId] = useState();
  const [formError, setFormErrors] = useState({});
  const classes = useStyles();

  console.log(data);
  // const handleProID = (e) => {
  //   if (e.target.value === "") {
  //     setFormErrors({
  //       ...formError,
  //       product_code: "Product ID không được để trống",
  //     });
  //   } else if (e.target.value.length > 50) {
  //     setFormErrors({
  //       ...formError,
  //       product_code: "Product ID phải ít hơn 30 ký tự",
  //     });
  //   } else if (!/^[a-zA-Z0-9]+$/.test(e.target.value)) {
  //     setFormErrors({
  //       ...formError,
  //       product_code: "Product ID phải là chữ hoặc số",
  //     });
  //   } else {
  //     setFormErrors({
  //       ...formError,
  //       product_code: "",
  //     });
  //   }
  // };
  const handleProName = (e) => {
    if (e.target.value === "") {
      setFormErrors({
        ...formError,
        product_name: "Tên sản phẩm không được để trống",
      });
    } else if (e.target.value.length > 255) {
      setFormErrors({
        ...formError,
        product_name: "Tên sản phẩm phải ít hơn 255 ký tự",
      });
    } else {
      setFormErrors({
        ...formError,
        product_name: "",
      });
    }
  };
  const handleVolume = (e) => {
    if (!/^[0-9]+$/.test(e.target.value)) {
      setFormErrors({
        ...formError,
        volume: "Khối lượng phải là số tự nhiên lớn hơn hoặc bằng 0",
      });
    } else {
      setFormErrors({
        ...formError,
        volume: "",
      });
    }
  };
  const handleCapacity = (e) => {
    if (!/^[0-9]+$/.test(e.target.value)) {
      setFormErrors({
        ...formError,
        capacity: "Dung tích phải là số tự nhiên lớn hơn hoặc bằng 0",
      });
    } else {
      setFormErrors({
        ...formError,
        capacity: "",
      });
    }
  };
  const handleD = (e) => {
    if (!e.target.value.match(/^[+]?((\.\d+)|(\d+(\.\d+)?)|(\d+\.))$/)) {
      setFormErrors({
        ...formError,
        d: "d phải là số lớn hơn hoặc bằng 0",
      });
    } else {
      setFormErrors({
        ...formError,
        d: "",
      });
    }
  };
  const handleTolerance = (e) => {
    if (!e.target.value.match(/^[+]?((\.\d+)|(\d+(\.\d+)?)|(\d+\.))$/)) {
      setFormErrors({
        ...formError,
        tolerance: "Dung tích phải là số lớn hơn hoặc bằng 0",
      });
    } else {
      setFormErrors({
        ...formError,
        tolerance: "",
      });
    }
  };
  const handleNormLoss = (e) => {
    if (!/^[0-9]+$/.test(e.target.value)) {
      setFormErrors({
        ...formError,
        norm_loss:
          "Hao hụt nguyên liệu phải là số tự nhiên lớn hơn hoặc bằng 0",
      });
    } else {
      setFormErrors({
        ...formError,
        norm_loss: "",
      });
    }
  };
  const handleRetailPrice = (e) => {
    if (!e.target.value.match(/^[+]?((\.\d+)|(\d+(\.\d+)?)|(\d+\.))$/)) {
      setFormErrors({
        ...formError,
        retail_price: "Giá bán phải là số lớn hơn hoặc bằng 0",
      });
    } else {
      setFormErrors({
        ...formError,
        retail_price: "",
      });
    }
  };
  // const handleAssigned = (e) => {
  //   console.log(e[0].value);
  //   setAssignedId(e[0].value);
  //   if (assigned_user_id === "") {
  //     setFormErrors({
  //       ...formError,
  //       assigned_user_id: "Người phụ trách không được để trống",
  //     });
  //   } else {
  //     setFormErrors({
  //       ...formError,
  //       assigned_user_id: "",
  //     });
  //   }
  // };
  const handleClient = (e) => {
    console.log(e[0]);
    setClientId(e[0].value);
    if (client_id === "") {
      setFormErrors({
        ...formError,
        client_id: "Khách hàng không được để trống",
      });
    } else {
      setFormErrors({
        ...formError,
        client_id: "",
      });
    }
  };
  const handleProInquiry = (e) => {
    if (e.target.value === "") {
      setFormErrors({
        ...formError,
        product_inquiry: "Ghi chú không được để trống",
      });
    } else if (e.target.value.length > 1000) {
      setFormErrors({
        ...formError,
        product_inquiry: "Ghi chú phải ít hơn 1000 ký tự",
      });
    } else {
      setFormErrors({
        ...formError,
        product_inquiry: "",
      });
    }
  };
  const rdToken = process.env.REACT_APP_RD_TOKEN;
  const urlUserRequest =
    process.env.REACT_APP_SERVER_URL +
    "/api/users?role_name=staff&user_status=true&page=0&size=1000";
  const urlCustomer = process.env.REACT_APP_WAREHOUSE + "/api/v1/customer";
  // eslint-disable-next-line no-unused-vars
  var [EmpOptions, setEmpOptions] = useState([{ value: "", label: "" }]);
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
  const deletErrorProduct = (productCode) => {
    const urlDeleteProduct =
      process.env.REACT_APP_SERVER_URL +
      `/api/products/${productCode}/remove-from-system`;
    fetch(urlDeleteProduct, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      console.log(res);
    });
  };
  const onSubmit = (event) => {
    event.preventDefault(event);
    const product_name = event.target.product_name.value;
    const product_inquiry = event.target.product_inquiry.value;
    const brand_name = event.target.brand_name.value;
    const volume = event.target.capacity.value;
    const product_weight = event.target.capacity.value;
    const density = event.target.d.value;
    const tolerance = event.target.tolerance.value;
    const material_norm_loss = event.target.material_norm_loss.value;
    const expired_date = event.target.expired.value;
    const retail_price = event.target.retailPrice.value;
    const user_id = data.user_id;
    const formula_id = data.formula_id;
    const datajson = {
      product_name,
      client_id,
      product_inquiry,
      brand_name,
      volume,
      product_weight,
      user_id,
      density,
      tolerance,
      material_norm_loss,
      expired_date,
      retail_price,
      formula_id,
    };
    console.log(token);
    console.log(datajson);
    const urlCreateUserRequest =
      process.env.REACT_APP_SERVER_URL + "/api/products/create";
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
        if (!response.ok) throw new Error(response);
        else {
          console.log(response);
          toast.update(noti, {
            render: "Tạo sản phẩm thành công",
            type: "success",
            isLoading: false,
          });
          return response.json();
        }
      })
      .then((resule) => {
        const urlWarehousrCreateProduct =
          process.env.REACT_APP_WAREHOUSE + "/api/v1/product";
        toast.update(noti, {
          render: "Đang tạo sản phẩm bên hệ thống kho",
          type: "default",
          isLoading: true,
        });
        console.log(resule);
        console.log(resule.product_code);
        var dataForm = new FormData();
        const productGroup = "601be9fbdcfc6210f9e94936";
        dataForm.append("image", undefined);
        dataForm.append("name", product_name);
        dataForm.append("code", resule.product_code);
        dataForm.append("volumn", product_weight);
        dataForm.append("expriedDate", expired_date);
        dataForm.append("retailPrice", retail_price);
        dataForm.append("moq", null);
        dataForm.append("productGroup", productGroup);
        fetch(urlWarehousrCreateProduct, {
          method: "POST",
          headers: {
            "Conttent-Type": "application/json",
            "rd-token": `${rdToken}`,
          },
          body: dataForm,
        })
          .then((res2) => {
            if (res2.ok) {
              toast.update(noti, {
                render: "Tạo sản phẩm bên kho thành công",
                type: "success",
                isLoading: true,
              });
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }
            return res2.json();
          })
          .then((result) => {
            console.log(result);
            if (result.status != 200) {
              console.log(resule.product_code);
              deletErrorProduct(resule.product_code);
              toast.update(noti, {
                render: result.errorMessage,
                type: "error",
                isLoading: true,
              });
            }
            return;
          })
          .catch((error) => {
            console.log(error);
            toast.update(noti, {
              render: error,
              type: "error",
              isLoading: true,
            });
          });
      })
      .catch((error) => {
        console.log(error);
        document.getElementById("create-product-form").reset();
        toast.update(noti, {
          render: error.toString(),
          type: "error",
          isLoading: true,
        });
      });
  };
  return (
    <>
      <form id="create-product-form" onSubmit={onSubmit}>
        <div className="form-group">
          <Card>
            <CardHeader color="info">Tạo Mới Sản Phẩm</CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} onChange={handleProName}>
                  <CustomInput
                    color="primary"
                    labelText="Tên sản phẩm"
                    id="product_name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                    }}
                  />
                  <p className={classes.errorMessage}>
                    {formError.product_name}
                  </p>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Tên nhãn hiệu"
                    id="brand_name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                    }}
                  />
                  <p className={classes.errorMessage}>
                    {formError.product_code}
                  </p>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} onChange={handleVolume}>
                  <CustomInput
                    labelText="Khối lượng (g)"
                    id="volume"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                      defaultValue: data.formula_weight,
                    }}
                  />
                  <p className={classes.errorMessage}>{formError.volume}</p>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} onChange={handleCapacity}>
                  <CustomInput
                    labelText="Dung tích"
                    id="capacity"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                      defaultValue: data.volume,
                    }}
                  />
                  <p className={classes.errorMessage}>{formError.capacity}</p>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} onChange={handleD}>
                  <CustomInput
                    labelText="d (g/ml)"
                    id="d"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                      defaultValue: data.density,
                    }}
                  />
                  <p className={classes.errorMessage}>{formError.d}</p>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} onChange={handleTolerance}>
                  <CustomInput
                    labelText="Dung sai (%)"
                    id="tolerance"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                      defaultValue: data.loss,
                    }}
                  />
                  <p className={classes.errorMessage}>{formError.tolerance}</p>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} onChange={handleNormLoss}>
                  <CustomInput
                    labelText="Hao hụt nguyên liệu"
                    id="material_norm_loss"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                    }}
                  />
                  <p className={classes.errorMessage}>{formError.norm_loss}</p>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Hạn sử dụng"
                    id="expired"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                    }}
                  />
                  <p className={classes.errorMessage}>
                    {formError.product_code}
                  </p>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} onChange={handleRetailPrice}>
                  <CustomInput
                    labelText="Giá bán"
                    id="retailPrice"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: false,
                      rows: 1,
                    }}
                  />
                  <p className={classes.errorMessage}>
                    {formError.retail_price}
                  </p>
                </GridItem>
                {/* <GridItem xs={12} sm={12} md={12}>
      {data.user_id != undefined ? (
        <Select
          options={EmpOptions}
          placeholder="Nhân viên"
          onChange={handleAssigned}
          values={[
            EmpOptions.find((opt) => opt.value == data.user_id),
          ]}
        />
      ) : (
        <Select
          options={EmpOptions}
          placeholder="Nhân viên"
          onChange={handleAssigned}
        />
      )}

      <p className={classes.errorMessage}>
        {formError.assigned_user_id}
      </p>
    </GridItem> */}
                <GridItem xs={12} sm={12} md={12}>
                  <Select
                    options={clientOptions}
                    placeholder="Khách hàng"
                    onChange={handleClient}
                  />
                  <p className={classes.errorMessage}>{formError.client_id}</p>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} onChange={handleProInquiry}>
                  <CustomInput
                    labelText="Ghi chú"
                    id="product_inquiry"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 3,
                    }}
                  />
                  <p className={classes.errorMessage}>
                    {formError.product_inquiry}
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
                  disabled={
                    !(formError.product_code == "") &&
                    !(formError.product_name == "") &&
                    !(formError.product_inquiry == "") &&
                    !(formError.retailPrice == "") &&
                    !(formError.volume == "") &&
                    !(formError.capacity == "") &&
                    !(formError.d == "") &&
                    !(formError.tolerance == "") &&
                    !(formError.norm_loss == "")
                  }
                >
                  Tạo
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </form>
    </>
  );
};
export default CreateProductForm;
