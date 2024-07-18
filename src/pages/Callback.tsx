import React, { useEffect } from "react";

import { CircularProgress } from "@mui/material";
import { useAuthCallback } from "aptimus-sdk-test/react";
import { User } from "../type/type";
import { jwtDecode } from "jwt-decode";
import useAuth from "../hooks/useAuth";

export const CallbackPage = () => {
  const { handled } = useAuthCallback(); // This hook will handle the callback from the authentication provider
  const {  getAuth} = useAuth();

  useEffect(() => {

      if (handled) {
        window.location.href = "/";
    }
 

  }, [handled]);




  return (
    <div
      style={{
        backgroundImage: "url('../public/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <CircularProgress />
    </div>
  );
};
