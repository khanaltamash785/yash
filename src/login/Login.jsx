import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./login.scss";
import Auth from "../service/auth";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";

const Login = () => {
  const [form, setForm] = useState({
    userName: "",
    password: "",
  });
  let navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const save = async () => {
    try {
      const resp = await axios.post(
        "/admin/login",
        form
      );
      console.log("skdkj", resp);
      if (resp.status === 200) {
        enqueueSnackbar("successfully Login!", {
          variant: "success",
        });
        Auth.saveAuthorizationToken(resp.data.token);
        Auth.saveUserId(resp.data && resp.data.user && resp.data.user._id);
        navigate("/admin");
      } else {
        enqueueSnackbar("Opps! something went wrong", {
          variant: "error",
        });
      }
    } catch (e) {
      enqueueSnackbar("Opps! something went wrong", {
        variant: "error",
      });
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div className="Login_body" style={{}}>
        <div className="Login_containt">
          <div className="Log_heading">LogIn</div>
          <TextField
            label="User Name"
            variant="standard"
            fullWidth
            required
            onChange={(e) => {
              setForm({ ...form, userName: e.target.value });
            }}
          />
          <TextField
            label="password"
            variant="standard"
            fullWidth
            required
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            required
            onClick={() => {
              save();
            }}
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Login;
