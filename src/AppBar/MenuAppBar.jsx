import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router";
import SettingsIcon from "@mui/icons-material/Settings";
import "../Admin/adminDashboard.scss";
import MenuItem from "@mui/material//MenuItem";
import Menu from "@mui/material//Menu";
import Auth from "../service/auth";
const MenuAppBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  var navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="div_app_bar">
      <div className="app_bar_heading">Admin Dashboard</div>
      <div className="button">
        <HomeIcon
          style={{ color: "white", cursor: "pointer" }}
          onClick={() => navigate("/admin")}
        />
        <SettingsIcon
          style={{ color: "white", cursor: "pointer" }}
          onClick={() => {
            navigate("/admin/questionList");
          }}
        />

        <AccountCircleIcon
          onClick={handleMenu}
          style={{ color: "white", cursor: "pointer" }}
        />
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              navigate("/login");
              handleClose();
              Auth.removeAuthorizationToken();
            }}
          >
            Log Out
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};
export default MenuAppBar;
