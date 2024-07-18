import React, { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { useAuthCallback } from "aptimus-sdk-test/react";

export const CallbackPage = () => {
  const { handled } = useAuthCallback(); // This hook will handle the callback from the authentication provider

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
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
};
