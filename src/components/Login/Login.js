import React, { useState } from "react";
import "./Login.css";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

async function loginUser(credentials) {
  return fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      else return response.json();
    })
    .catch((error) => console.log(error));
}
export default function Login({ setToken, setRole, setUserId, setFullname }) {
  const [user_name, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    const noti = toast("Please wait...", {
      position: "top-center",
    });
    e.preventDefault();
    const data = await loginUser({
      user_name,
      password,
    });
    console.log(data);
    if (!data) {
      setToken("");
      setRole("");
      toast.update(noti, {
        render: "Tài khoản không hợp lệ",
        position: "top-center",
        autoClose: 5000,
        type: "error",
        isLoading: false,
      });
    } else {
      var obj = JSON.parse(JSON.stringify(data));
      const roles = obj.roles;
      const role = roles[0];
      setToken(obj.accessToken);
      setRole(role);
      setUserId(obj.user_id);
      setFullname(obj.fullname);
    }
  };
  return (
    <div className="login-wrapper">
      <div style={{ width: "300px" }}>
        <img
          src="https://mrpa.s3-ap-southeast-1.amazonaws.com/default/Vfarm-White.png"
          className="logo-img"
        />
      </div>
      <div className="login-form">
        {/* <h1 className="title">Please Login</h1> */}
        <form onSubmit={handleSubmit}>
          <div className="label">
            <input
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="Tài Khoản"
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Mật Khẩu"
            />
          </div>
          <button type="submit" className="button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
Login.propTypes = {
  setRole: PropTypes.func.isRequired,
};
Login.propTypes = {
  setUserId: PropTypes.func.isRequired,
};
Login.propTypes = {
  setFullname: PropTypes.func.isRequired,
};
