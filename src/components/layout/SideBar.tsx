import React from "react";
import { Box, List, ListItemIcon, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import GroupIcon from "@mui/icons-material/Group";
import { AttachMoneyOutlined, LeaderboardOutlined } from "@mui/icons-material";

const drawerWidth = 100;

const items = [
  { text: "Home", icon: <HomeIcon />, to: "/" },
  // { text: "Friend", icon: <GroupIcon />, to: "/create-room" },
  { text: "Play", icon: <SportsEsportsIcon />, to: "/playGame" },
  { text: "Boarding", icon: <LeaderboardOutlined />, to: "/leaderboard" },
  { text: "Faucet", icon: <AttachMoneyOutlined />, to: "/faucet" },
];

const SideBar = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height:"100%",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        //  background: "#181733",
        // [`& .MuiDrawer-paper`]: {
        //   width: drawerWidth,
        //   boxSizing: "border-box",
        //   marginTop: "48px",
        // },
      }}
    >
      <Box
        sx={{
    
        }}
      >
        <List
          sx={{
            padding: "0px 8px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems:"center",
            gap:"20px"
          }}
        >
          {items.map((item, index) => (
            <NavLink
              to={item.to}
              key={index}
              style={({ isActive }) => ({
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                textDecoration: "none",
                color: isActive ? "#0A665B" : "white",
                background: isActive
                  ? "white"
                  : "transparent",
                padding: "10px 0",
                width: "80%",
                letterSpacing:"2px"
              })}
              aria-hidden="false"
            >
              <ListItemIcon
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                {React.cloneElement(item.icon, { color: "inherit" })}
              </ListItemIcon>
       
              <span className="text-left">{item.text}</span>
            </NavLink>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default SideBar;
