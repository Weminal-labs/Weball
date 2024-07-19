import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center bg-gradient-to-r from-[#617ed7] to-[#15cb24]">
      <div className="flex  flex-col">
        <img
          className="h-[200px] w-[200px]"
          src={"../public/logo.png"}
          alt="logo"
        />{" "}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
