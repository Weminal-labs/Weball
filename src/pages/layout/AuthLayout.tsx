import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const address = localStorage.getItem("address")
  const nav = useNavigate()
  useEffect(()=>{
    if(address){
      nav("/")
    }

  },[])
  return (
    <div className="flex h-[100vh] w-full items-center justify-center bg-gradient-to-r from-[#617ed7] to-[#15cb24]">
      <div className="flex  flex-col">
        <img
          className="h-[360px] w-[360px]"
          src={"/logo.png"}
          alt="logo"
        />{" "}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
