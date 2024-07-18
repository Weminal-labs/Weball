import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HelpIcon from '@mui/icons-material/Help';

const drawerWidth = 100;

const items = [
  { text: 'Home', icon: <HomeIcon /> },
  { text: 'Create', icon: <SportsEsportsIcon /> },
  { text: 'join', icon: <GroupIcon /> },

];

const SideBar=()=> {
  return (
    <Box
      sx={{
        width: drawerWidth,
        // marginTop:"48px",
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {items.map((item, index) => (
            <ListItem button key={index}>
              <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', flexDirection:"column", alignItems:"center" }}>
                {item.icon}
                <ListItemText primary={item.text} sx={{ textAlign: 'center' }} />

              </ListItemIcon>
            </ListItem>
          ))}
        </List>
       
      </Box>
    </Box>
  );
}

export default SideBar;
