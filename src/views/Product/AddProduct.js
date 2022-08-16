/* eslint-disable prettier/prettier */
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
//import Tabs from "components/CustomTabs/CustomTabs.js";
//import Tasks from "components/Tasks/Tasks.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";

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
export default function AddProduct() {
    const classes = useStyles();
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Button type="button" color="info">Thêm Nhà Cung Cấp</Button>
                <Card>
                    <CardHeader color="info" className={classes.cardTitleWhite}>
                        Nhà Cung Cấp
                    </CardHeader>
                    <GridItem xs={10} sm={10} md={2}>
                        <CustomInput
                            labelText="Tìm"
                            id=""
                            formControlProps={{
                                fullWidth: true
                            }}
                        />
                    </GridItem>
                    <CardBody>
                        <Table
                            tableHeaderColor="primary"
                            tableHead={["STT", "Nhà Cung Cấp", "Người liên lạc", "Số Điện Thoại", "Email", "Ngày cập nhật"]}
                            tableData={[
                                // eslint-disable-next-line prettier/prettier
                                ["1", "CÔNG TY TNHH THƯƠNG MẠI SẢN XUẤT 3K", "HOA TRAN", "0933689211", "", "08/04/2022 09:14;04"],
                                ["2", "Công ty TNHH TM DV Lai Nhi", "Thao shop Hoa Cò", "0909856576", "", "18/03/2022 14:57:09"],
                                ["3", "Công Ty TNHH Thuy Anh Tamanu", "Thuy Ngo", "0383342204", "", "11/02/2022 08;41:28"],
                                ["4", "Cty TNHH ORO", "Mr Đạt", "0909095011", "", "21/01/2022 16:16:59"],
                                ["5", "Bao bì Minh Cường", "Mr Hiền", "097265651", "", "30/11/2021 10:06:53"]
                            ]}
                        />
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
    );
}