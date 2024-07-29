import React from "react";
import styled from "styled-components";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import useAuth from "../../hooks/useAuth";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

const HeaderContainer = styled.div`
  height: 60px;
  padding: 20px;
  text-align: left;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #181733;
`;

const LeftHeader = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  flex: 1;
`;

const TitleContainer = styled.header`
  background: linear-gradient(180deg, #885bff 0%, #5977d6 100%);
  width: 160px;
  background-color: #0e235e;
  padding: 4px 12px;

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  cursor: pointer;
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50px;
  margin-right: 5px;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 3px;
`;

const RightHeader = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  flex: 1;
`;

const WelcomeText = styled.p`
  color: white;
  font-size: 14px;
  margin-right: 20px;
`;
const Header: React.FC = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const flow = useAptimusFlow();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    flow.logout();
    window.location.reload();
    // localStorage.clear();
    // sessionStorage.clear();
  };
  console.log(auth);
  return (
    <HeaderContainer>
      <LeftHeader>
        <TitleContainer>
          <Logo>
            <img
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "50px",
              }}
              src={"/logo.png"}
              alt="logo"
            />
          </Logo>
          <Title>WEBALL</Title>
        </TitleContainer>
      </LeftHeader>
      {/* <Search>
        <SearchTerm type="text" placeholder="What are you looking for?" />
        <SearchButton type="submit">
          <SearchIcon />
        </SearchButton>
      </Search> */}
      <RightHeader>
        <WelcomeText>{auth?.email}</WelcomeText>
        <Avatar
          component="div"
          src={auth?.picture}
          onClick={handleClick}
          sx={{ cursor: "pointer" }}
        />
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </RightHeader>
    </HeaderContainer>
  );
};

export default Header;
