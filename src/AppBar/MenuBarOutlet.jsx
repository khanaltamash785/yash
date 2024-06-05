import React from "react";
import { Outlet } from "react-router";
import MenuAppBar from "./MenuAppBar";

const MenuBarOutlet = () => {
  return (
    <div style={{ height: "8vh" }}>
      <MenuAppBar />
      <Outlet />
    </div>
  );
};
export default MenuBarOutlet;
