import React from "react";
import styled from "styled-components";
import PersonIcon from "@mui/icons-material/Person";
import { NavLink } from "react-router-dom";
import { useAptimusFlow, useKeylessLogin } from "aptimus-sdk-test/react";

const HeaderContainer = styled.div`
  width: 95%;
  height: 40px;
  padding: 28px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftHeader = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const TitleContainer = styled.header`
  background: linear-gradient(to right, #3a6084, #0e235e);
  width: 190px;
  height: 24px;
  background-color: #0e235e;
  padding: 16px 12px;
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
  margin-right: 15px;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 3px;
`;

const FeaturesContainer = styled.div`
  padding-right: 100px;
  margin-left: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 100%;
  cursor: pointer;
  gap: 30px;
  font-weight: 500;
`;

const Feature = styled.div`
  color: #fff;
  font-size: 16px;
  letter-spacing: 2px;
`;
const StyledNavLink = styled(NavLink)`
  color: #fff;
  font-size: 16px;
  letter-spacing: 2px;
  text-decoration: none;
  border: none;
  &.active {
    color: #e72222;
  }

  &:hover {
    color: #ddd;
  }
`;

const RightHeader = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  width: 150px;
  height: 40px;
`;

const ProfileButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: #3d4b61;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 15px;
`;

const Header: React.FC = () => {
  const flow = useAptimusFlow();

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
              src="/logo.jpg"
              alt="logo"
            />
          </Logo>
          <Title>WEBALL</Title>
        </TitleContainer>
        <FeaturesContainer>
          <StyledNavLink to="/">
            <Feature>Home</Feature>
          </StyledNavLink>
          <StyledNavLink to="/rooms">
            <Feature>Rooms</Feature>
          </StyledNavLink>
        </FeaturesContainer>
      </LeftHeader>
      <RightHeader>
        <ProfileButton onClick={() => flow.logout()}>
          <PersonIcon />
        </ProfileButton>
      </RightHeader>
    </HeaderContainer>
  );
};

export default Header;
