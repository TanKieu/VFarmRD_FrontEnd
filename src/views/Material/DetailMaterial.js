/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
//import Tasks from "components/Tasks/Tasks.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Button from "components/CustomButtons/Button.js";
import Info from "components/Typography/Info";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import ReactLoading from "react-loading";


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
};

const useStyles = makeStyles(styles);

export default function DetailMaterial() {
    const classes = useStyles();
    const location = useLocation();
    const material_id = location.state.material_Info;
    const urlMaterialRequest = process.env.REACT_APP_WAREHOUSE + "/api/v1/material/";
    const rdToken = process.env.REACT_APP_RD_TOKEN;
    const token = localStorage.getItem("token");
    const [modifiedTime, setmodifiedTime] = useState();
    const [createdTime, setcreatedTime] = useState();
    const [max_percent, setMax_percent] = useState(100);
    const [percentStatus, setPercentStatus] = useState(false);
    const [mspId, setMspId] = useState("");
    const [supName, setSupName] = useState();
    const [supId, setSupId] = useState();
    var [matData, setMatData] = useState([]);

    const [show, setShow] = useState(false);
    var [matData2, setMatData2] = useState([]);

    const [materialList, setMaterialList] = useState([]);
    const [conflictList, setConflictList] = useState([]);

    const [projectList, setProjectList] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const history = useHistory();
    const [locationKeys, setLocationKeys] = useState([]);

    const [percentBtnStatus, setPercentBtnStatus] = useState(false);
    const [conflicttBtnStatus, setConflictBtnStatus] = useState(false);
    const fetchData = () => {
        axios
            .get(urlMaterialRequest + material_id, {
                headers: {
                    "Content-Type": "application/json",
                    "rd-token": `${rdToken}`,
                },
            })
            .then((res) => {
                console.log(res.data);
                setMatData(res.data.material);
                const supplier = res.data.material.supplier;
                setcreatedTime(res.data.material.createdTime);
                setmodifiedTime(res.data.material.modifiedTime);
                setSupName(supplier.name);
                setSupId(supplier._id);
            })
            .catch((error) => {
                console.log(error);
            }
            );

        const maxpercentURL = process.env.REACT_APP_SERVER_URL + `/api/materialstandardpercents/?material_id=${material_id}`;
        axios
            .get(maxpercentURL, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (res.status == 200) {
                    console.log(res.data);
                    setMax_percent(res.data.max_percent);
                    setMspId(res.data.msp_id);
                    setPercentStatus(true);
                }

            })
            .catch((error) => {
                console.log(error);
            }
            );

        const urlgetListMaterial = process.env.REACT_APP_WAREHOUSE + "/api/v1/material";
        axios
            .get(urlgetListMaterial, {
                headers: {
                    "Content-Type": "application/json",
                    "rd-token": `${rdToken}`,
                },
            })
            .then((res) => {
                console.log(res.data);
                const isMaterial = [];
                res.data.materialList.map((material) => {
                    if (material.warehouse === "600a8a1e3fb5d34046a6f4c4") {
                        isMaterial.push(material);
                    }
                })
                setMaterialList(isMaterial);

            })
            .catch((error) => {
                console.log(error);
            }
            );

        const conflictURl = process.env.REACT_APP_SERVER_URL + `/api/materialconflicts/?material_id=${material_id}`;
        axios
            .get(conflictURl, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log(res.data);
                setConflictList(res.data);
                setConflictBtnStatus(true);
            })
            .catch((error) => {
                console.log(error);
            }
            );

        const projectListURL = process.env.REACT_APP_SERVER_URL + `/api/projects/materials/${material_id}`;
        axios
            .get(projectListURL, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log(res.data);
                setProjectList(res.data);
            })
            .catch((error) => {
                console.log(error);
            }
            );

        setTimeout(() => {
            setIsLoading(false);
        }, 800);


    }

    const updateMaxpercent = () => {
        const urlUpdatePercent = process.env.REACT_APP_SERVER_URL + `/api/materialstandardpercents/${mspId}`;
        const obj = {
            material_id,
            max_percent,
        }
        const noti = toast("Đang thực hiện ...")
        axios.put(urlUpdatePercent, JSON.stringify(obj), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

        }).then((res) => {
            if (res.status != 200) throw new Error(res.data);
            else {
                toast.update(noti, {
                    render: "Cập nhật thành công",
                    type: "success",
                });
            }
        }).catch((error) => {
            console.log(error);
            toast.update(noti, {
                render: error.toString(),
                type: "error",
                isLoading: false,
            });
        })
    }

    const createMaxpercent = () => {
        const urlUpdatePercent = process.env.REACT_APP_SERVER_URL + `/api/materialstandardpercents`;
        const obj = {
            material_id,
            max_percent,
        }
        const noti = toast("Đang thực hiện ...")
        axios.post(urlUpdatePercent, JSON.stringify(obj), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

        }).then((res) => {
            if (res.status != 200) throw new Error(res.data);
            else {
                toast.update(noti, {
                    render: "Cập nhật thành công",
                    type: "success",
                });
            }
        }).catch((error) => {
            console.log(error.response.data.message);
            toast.update(noti, {
                render: error.response.data.message.toString(),
                type: "error",
                isLoading: false,
            });
        })
    }

    const convertMaterialIdToMater = (materialId) => {
        return materialList.find((e) => e._id == materialId);
    }

    const conflictColumn = [
        {
            name: "STT",
            selector: (row, index) => index + 1,
            sortable: true,
            cell: (row, index) => (
                <div>{index + 1}</div>
            )
        },
        {
            name: "Mã nguyên liệu",
            selector: (row) => convertMaterialIdToMater(row.second_material_id).code,
            sortable: true,
            cell: (row) => (
                <div>{convertMaterialIdToMater(row.second_material_id).code}</div>
            )
        },
        {
            name: "Tên nguyên liệu",
            selector: (row) => convertMaterialIdToMater(row.second_material_id).name,
            sortable: true,
            cell: (row) => (
                <div>{convertMaterialIdToMater(row.second_material_id).name}</div>
            )
        },
        {
            name: "Tên Inci",
            selector: (row) => convertMaterialIdToMater(row.second_material_id).inciName,
            sortable: true,
            cell: (row) => (
                <div>{convertMaterialIdToMater(row.second_material_id).inciName}</div>
            )
        },
        {
            name: "Mô tả xung đột",
            selector: (row) => row.description,
            sortable: true,
            cell: (row) => (
                <div>{row.description}</div>
            )
        },
    ];

    const projectColumn = [
        {
            name: "STT",
            selector: (row, index) => index + 1,
            sortable: true,
            cell: (row, index) => (
                <div>{index + 1}</div>
            )
        },
        {
            name: "Mã dự án",
            selector: (row) => row.project_code,
            sortable: true,
            cell: (row) => (
                <div>{row.project_code}</div>
            )
        },
        {
            name: "Tên dự án",
            selector: (row) => row.project_name,
            sortable: true,
            cell: (row) => (
                <div>{row.project_name}</div>
            )
        },
        {
            name: "Yêu cầu",
            selector: (row) => row.requirement,
            sortable: true,
            cell: (row) => (
                <div>{row.requirement}</div>
            )
        },
        {
            name: "Trạng thái",
            selector: (row) => row.project_status,
            sortable: true,
            cell: (row) => (
                <div>{row.project_status}</div>
            )
        },
    ];

    const onRowProjectClick = (row) => {
        history.push("/material/project/listMaterial", { project: row });
    }

    useEffect(() => {
        fetchData();
        //setsupplier(matData.supplier);
        //console.log(supplier);
        return history.listen(location => {
            console.log(location);
            if (history.action === 'PUSH') {
                setLocationKeys([location.key])
            }

            if (history.action === 'POP') {
                if (locationKeys[1] === location.key) {
                    // eslint-disable-next-line no-unused-vars
                    setLocationKeys(([_, ...keys]) => keys)

                    // Handle forward event

                } else {
                    setLocationKeys((keys) => [location.key, ...keys])

                    window.location.reload();
                    history.push("/admin/material");

                }
            }
        })
    }, [locationKeys,]);

    const hideModal = () => {
        setShow(false);
    };

    const onMatRowClicked = (row) => {
        setShow(true);
        var id = row.second_material_id;
        const urlMaterialRequest = process.env.REACT_APP_WAREHOUSE + "/api/v1/material/";
        axios
            .get(urlMaterialRequest + id, {
                headers: {
                    "Content-Type": "application/json",
                    "rd-token": `${rdToken}`,
                },
            })
            .then((res) => {
                setMatData2(res.data.material);
            })
            .catch((error) => {
                console.log(error);
            }
            );
    }

    return isLoading ? (
        <div
            style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                right: "50%",
                bottom: "40%",
                marginLeft: "auto",
                marginRight: "auto",
            }}
        >
            <ReactLoading
                type="spinningBubbles"
                color="#8B0000"
                height={300}
                width={150}
            />
        </div>
    ) : (
        <><GridContainer>
            <ToastContainer />
            <GridItem xs={12} sm={12} md={10}>
                <Card>
                    {/* <CardHeader color="primary"> */}
                    <CardHeader color="info" className={classes.cardTitleWhite}>
                        Thông Tin Nguyên Liệu
                    </CardHeader>
                    {/* </CardHeader> */}
                    <CardBody>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>Code</Info>
                                <b>{matData.code}</b>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>Ngày tạo</Info>
                                <DatePicker
                                    selected={createdTime}
                                    onChange={(date) => setcreatedTime(date)}
                                    dateFormat="dd/MM/yyyy hh:mm"
                                    disabled={true} />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>Ngày chỉnh sửa</Info>
                                <DatePicker
                                    selected={modifiedTime}
                                    dateFormat="dd/MM/yyyy hh:mm"
                                    onChange={(date) => setmodifiedTime(date)}
                                    disabled={true} />
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>Tên nguyên liệu</Info>
                                <b>{matData.name}</b>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>inciName</Info>
                                <b>{matData.inciName}</b>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>tradeName</Info>
                                <b>{matData.tradeName}</b>
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>Nhóm</Info>
                                <b>{matData.group}</b>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>Đơn giá</Info>
                                <div>
                                    {parseFloat(matData.unitPrice).toLocaleString(
                                        "en-US",
                                        {
                                            style: "currency",
                                            currency: "VND"
                                        }
                                    )}{" "}
                                </div>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>Đơn vị tính</Info>
                                <b>{matData.unit}</b>
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>Số lượng</Info>
                                <b>{matData.amount}</b>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>Giá trị</Info>
                                <b>{matData.value}</b>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>MOQ</Info>
                                <b>{matData.moq}</b>
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>Tồn kho</Info>
                                <b>{matData.remainAmount}</b>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>Đã dùng</Info>
                                <b>{matData.pending}</b>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                                <Info>Nhà sản xuất</Info>
                                <b>{supName}</b>
                            </GridItem>
                        </GridContainer>

                        <Button type="button" color="info" onClick={() => { history.push("/material/update", { material_Info: matData, material_ID: material_id, supplier: supName, supplierId: supId, unit: matData.unit, warehouse: matData.warehouse }) }} >Chỉnh sửa nguyên liệu</Button>
                    </CardBody>
                </Card>
            </GridItem>
                <GridItem xs={12} sm={12} md={10}>
                    <Card>
                        <CardHeader color="info" className={classes.cardTitleWhite}>
                            Tính chất của nguyên liệu
                        </CardHeader>
                        <CardBody>
                            <GridItem xs={10} sm={10} md={12}>
                                <GridContainer>
                                    <GridItem xs={10} sm={10} md={2} onChange={(e) => { setMax_percent(e.target.value); setPercentBtnStatus(true); }}>
                                        <CustomInput
                                            color="primary"
                                            labelText="Phần trăm tối đa(%)"
                                            id="max-percent"
                                            formControlProps={{
                                                fullWidth: false,
                                            }}
                                            value={max_percent}
                                            inputProps={{
                                                multiline: false,
                                                rows: 1,
                                                value: max_percent,
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={10} sm={10} md={2}>
                                        {percentStatus ?
                                            <Button type="button"
                                                color="info"
                                                disabled={!percentBtnStatus}
                                                onClick={updateMaxpercent}
                                            >
                                                Cập nhật
                                            </Button>
                                            :
                                            <Button type="button"
                                                color="info"
                                                disabled={!percentBtnStatus}
                                                onClick={createMaxpercent}
                                            >
                                                Cập nhật
                                            </Button>
                                        }

                                    </GridItem>
                                </GridContainer>

                                <h4><Info><b>Danh sách chất xung đột</b></Info></h4>
                                <Button type="button"
                                    color="info"
                                    disabled={!conflicttBtnStatus}
                                    onClick={() => {
                                        history.push("/material/conflict", { material_id: material_id, materialList: materialList, conflictList: conflictList });
                                    }}>
                                    Chỉnh sửa
                                </Button>
                                <DataTable
                                    columns={conflictColumn}
                                    data={conflictList}
                                    subHeader
                                    persistTableHead
                                    onRowClicked={onMatRowClicked}
                                />
                                {show && <Modal matData2={matData2} handleClose={hideModal} />}
                            </GridItem>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem>
                    <Card>
                        <CardHeader color="info" className={classes.cardTitleWhite}>
                            Danh sách dự án sử dụng
                        </CardHeader>
                        <CardBody>
                            <DataTable
                                columns={projectColumn}
                                data={projectList}
                                subHeader
                                persistTableHead
                                onRowClicked={onRowProjectClick}
                            />
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        </>
    );
}
const Modal = ({ handleClose, matData2 }) => {
    const mat = matData2;
    const checkSup = (mat) => {
        if (mat.supplier !== undefined) {
            return mat.supplier.name;
        }
    }
    return (
        <div className="modal display-block">
            <section className="modal-main">
                <div className="App">
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={10}>
                            <Card>
                                {/* <CardHeader color="primary"> */}
                                <CardHeader color="info">
                                    Thông Tin Nguyên Liệu
                                </CardHeader>
                                {/* </CardHeader> */}
                                <CardBody>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Info>Code</Info>
                                            <b>{mat.code}</b>
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Info>Tên nguyên liệu</Info>
                                            <b>{mat.name}</b>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Info>inciName</Info>
                                            <b>{mat.inciName}

                                            </b>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Info>tradeName</Info>
                                            <b>{mat.tradeName}</b>
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Info>Nhóm</Info>
                                            <b>{mat.group}</b>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Info>Đơn giá</Info>
                                            <div>
                                                {parseFloat(mat.unitPrice).toLocaleString(
                                                    "en-US",
                                                    {
                                                        style: "currency",
                                                        currency: "VND"
                                                    }
                                                )}{" "}
                                            </div>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Info>Đơn vị tính</Info>
                                            <b>{mat.unit}</b>
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Info>Số lượng</Info>
                                            <b>{mat.amount}</b>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Info>Giá trị</Info>
                                            <b>{mat.value}</b>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Info>MOQ</Info>
                                            <b>{mat.moq}</b>
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Info>Tồn kho</Info>
                                            <b>{mat.remainAmount}</b>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Info>Đã dùng</Info>
                                            <b>{mat.pending}</b>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Info>Nhà sản xuất</Info>
                                            <b>{checkSup(mat)}</b>
                                        </GridItem>
                                    </GridContainer>

                                    <Button type="button" color="info" onClick={handleClose} >Đóng</Button>
                                </CardBody>
                            </Card>
                        </GridItem>
                    </GridContainer>
                </div>
            </section>
        </div>
    );
};