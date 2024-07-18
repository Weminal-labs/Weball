// import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import { HomeOutlined, MeetingRoom, MeetingRoomOutlined, LeaderboardOutlined, AttachMoneyOutlined } from '@mui/icons-material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PermanentDrawer from '../components/Side';
import { Box } from '@mui/material';

const Layout = () => {


  return (
    <LayoutContainer>
      <Header />
      <Box sx={{display:"flex", height:"100vh"}}>
        <SideBar/>
        <Outlet  />
      </Box>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  flex-direction:column;
  height: 100vh
  `;


export default Layout;
