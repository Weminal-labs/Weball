import React, { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { useAuthCallback } from "aptimus-sdk-test/react";

export const CallbackPage = () => {
  const { handled } = useAuthCallback();

  useEffect(() => {
    if (handled) {
      window.location.href = "/";
    }
  }, [handled]);

  return (
    <div className="flex justify-center">
      <CircularProgress />
    </div>
  );
};
