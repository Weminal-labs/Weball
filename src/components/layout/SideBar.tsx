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
  { text: "Create", icon: <SportsEsportsIcon />, to: "/create-room" },
  { text: "Join", icon: <GroupIcon />, to: "/join-room" },
  { text: "Boarding", icon: <LeaderboardOutlined />, to: "/leaderboard" },
  { text: "Addbets", icon: <AttachMoneyOutlined />, to: "/addbets" },

];

const SideBar = () => {
  return (
    <Box
      sx={{
        width: drawerWidth,
        height:"100%",
        flexShrink: 0,
         background: "#181733",
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          marginTop: "48px",
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List sx={{padding:"0px 8px"}}>
          {items.map((item, index) => (
            <NavLink
              to={item.to}
              key={index}
              style={({ isActive }) => ({
                borderRadius:'8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: isActive ? 'white' : 'grey',
                background: isActive ? 'linear-gradient(180deg, #885BFF 0%, #5977D6 100%)' : 'transparent',
                padding: '10px 0',
                width: '100%'
              })}
              aria-hidden="false" // Ensure aria-hidden is not used inappropriately

            >
              <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', color: 'inherit' }}>
                {React.cloneElement(item.icon, { color: 'inherit' })}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ textAlign: 'center', color: 'inherit' }} />
            </NavLink>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default SideBar;
