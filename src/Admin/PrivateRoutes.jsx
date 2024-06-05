import React from "react";
import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import Auth from "../service/auth";

const PrivateRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  useEffect(() => {
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        return null;
      }
    };
    const token = localStorage.getItem("auth");
    if (token) {
      const decodedJwt = parseJwt(token);
      if (decodedJwt.exp < Date.now() / 1000) {
        setIsAuthenticated(false);
        Auth.removeAuthorizationToken();
        Auth.removeUserId();
        return;
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
