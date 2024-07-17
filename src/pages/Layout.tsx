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
        <SideBarContainer>
          <SideBar items={[
            { icon: <HomeOutlined />, text: "Home", onClick: () => { handleItemClick("Home") } },
              { icon: <MeetingRoom />, text: "Create Room", onClick: () => { handleItemClick("Create Room") } },
              { icon: <MeetingRoomOutlined />, text: "Join Room", onClick: () => { handleItemClick("Join Room") } },
              { icon: <LeaderboardOutlined />, text: "Leaderboard", onClick: () => { handleItemClick("Leaderboard") } },
              { icon: <AttachMoneyOutlined />, text: "Add Bets", onClick: () => { handleItemClick("Add Bets") } }
            ]} selectedItem={selectedItem} />
        </SideBarContainer>
        <Outlet />
      </ContentContainer>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #000;
`;

const ContentContainer = styled.div`
  flex: 11; 
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px; 
  flex-direction: row;
`;

const SideBarContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default Layout;
