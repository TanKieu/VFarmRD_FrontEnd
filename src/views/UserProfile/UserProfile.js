/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import UserProfileUpdate from "./UserProfileUpdate";
import { useHistory } from "react-router-dom";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";


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


const urlRequest = process.env.REACT_APP_SERVER_URL + "/api/users";
const useStyles = makeStyles(styles);
export default function UserProfile() {


    const [locationKeys, setLocationKeys] = useState([]);
    const history = useHistory();
    var [isClicked, setIsClicked] = useState(false);
    //var [userid, setUserId] = useState();
    var [url, setUrl] = useState("");

    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("userId");
    const [userInfo, setUserInfo] = useState();

    var [data, setData] = useState([]);
    const fetchData = () => {
        console.log(localStorage);
        console.log(localStorage.getItem("token"));
        console.log(localStorage.getItem("userId"));
        console.log(data);
        axios.get(urlRequest + "/" + user_id, {
            headers: {
                'Conttent-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            setData(res.data);
            data = res.data;
            console.log(res.data);
            console.log(data);
        }).catch((error) => {
            console.log(error);
        });
    }
    useEffect(() => {
        fetchData();
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
                    history.push("/admin/profile");

                }
            }
        })
    }, [locationKeys,]);

    const classes = useStyles();

    const user_name = data.user_name;
    const email = data.email;
    const phone = data.phone;
    const fullname = data.fullname;
    const role_name = data.role_name;

    const onClick = () => {

        setUrl("/admin/profile/detail/" + user_id);
        console.log("direct đi " + url);
        setIsClicked(true);
        console.log(isClicked);
        setUserInfo({
            user_id: user_id,
            email: email,
            fullname: fullname,
            password: data.password,
            phone: phone,
            role_name: role_name,
            user_name: user_name,
        });
        console.log(userInfo);

    }
    window.onhashchange = function () {
        window.history.back();
    }
    if (isClicked !== false) {
        console.log(user_id);
        return (
            <>
                <BrowserRouter>
                    <Switch>
                        <Route path={url}>
                            <UserProfileUpdate user={userInfo} />
                        </Route>
                    </Switch>
                    <Redirect push to={url} />
                </BrowserRouter>
            </>
        );
    } else {
        return (
            <GridContainer>
                <ToastContainer />
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="info" className={classes.cardTitleWhite}>
                            Nhân Viên
                        </CardHeader>
                        <form id="form-user-profile" >
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <label>Tên đăng nhập</label>
                                        <CustomInput
                                            color="primary"
                                            id="user_name"
                                            formControlProps={{
                                                fullWidth: true,
                                            }}
                                            inputProps={{
                                                multiline: true,
                                                rows: 1,
                                                value: user_name,
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={4}>
                                        <label>Email</label>
                                        <CustomInput
                                            id="email"
                                            formControlProps={{
                                                fullWidth: true,
                                            }}
                                            inputProps={{
                                                multiline: false,
                                                rows: 1,
                                                value: email,
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={4}>
                                        <label>Họ Tên</label>
                                        <CustomInput
                                            id="fullname"
                                            formControlProps={{
                                                fullWidth: true,
                                            }}
                                            inputProps={{
                                                multiline: false,
                                                rows: 1,
                                                value: fullname,
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={4} >
                                        <label>Số điện thoại</label>
                                        <CustomInput
                                            id="phone"
                                            formControlProps={{
                                                fullWidth: true,
                                            }}
                                            inputProps={{
                                                multiline: false,
                                                rows: 1,
                                                value: phone,
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={4} >
                                        <label>Chức vụ</label>
                                        <CustomInput
                                            id="role_name"
                                            formControlProps={{
                                                fullWidth: true,
                                            }}
                                            inputProps={{
                                                multiline: false,
                                                rows: 1,
                                                value: role_name,
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                                <Button color="info" type="button" onClick={onClick}>
                                    Thay đổi thông tin cá nhân
                                </Button>
                            </CardBody>
                        </form>
                    </Card>
                </GridItem>
            </GridContainer>
        );
    }
}
