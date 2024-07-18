// import React from 'react'
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { Box } from "@mui/material";

const Layout = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <Box sx={{display:"flex",flexDirection:"column"}}>
        <Header />
        <Box sx={{display:"flex"}}>
          <SideBar/>
          <Outlet></Outlet>
        </Box>
      </Box>
    </div>
  );
};

export default Layout;
