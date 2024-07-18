// import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import { HomeOutlined, MeetingRoom, MeetingRoomOutlined, LeaderboardOutlined, AttachMoneyOutlined } from '@mui/icons-material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Layout = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("Home");

  useEffect(() =>{
    // get selectedItem from local storage
    const storedItem = localStorage.getItem("selectedSidebarItem") || "Home";
    setSelectedItem(storedItem);
  },[])

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    localStorage.setItem("selectedSidebarItem", item);
    if(item === 'Home') {
      navigate("/");
    } else {
      navigate(`/${item.toLowerCase().replace(/\s/g, '-')}`);
    }
  };

  return (
    <LayoutContainer>
      <Header />
      <ContentContainer>
        <SideBar 
          items={[
            { icon: <HomeOutlined />, text: "Home", onClick: () => { handleItemClick("Home") } },
            { icon: <MeetingRoom />, text: "Create Room", onClick: () => { handleItemClick("Create Room") } },
            { icon: <MeetingRoomOutlined />, text: "Join Room", onClick: () => { handleItemClick("Join Room") } },
            { icon: <LeaderboardOutlined />, text: "Leaderboard", onClick: () => { handleItemClick("Leaderboard") } },
            { icon: <AttachMoneyOutlined />, text: "Add Bets", onClick: () => { handleItemClick("Add Bets") } }
          ]} selectedItem={selectedItem} />
        <Outlet />
      </ContentContainer>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: grid;
  grid-template-rows: 15% 85%;
  background-color: #000;
  height: 100vh;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 100px 1400px;
  justify-content: center;
  align-items: center;
  padding: 20px; 
  flex-direction: row;
`;

export default Layout;
