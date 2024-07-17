import React from "react";
import styled from "styled-components";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import { NavLink } from "react-router-dom";
import { useAptimusFlow } from "aptimus-sdk-test/react";

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
  flex: 1
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
  margin-left: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
  gap: 30px;
  font-weight: 500;
  border: 2px solid #fff;
  padding: 10px;
  border-radius: 50px;
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

const Search = styled.div`
  width: 60%;
  position: relative;
  display: flex;
  flex: 1;
  margin-left: 40px;
`;

const SearchTerm = styled.input`
  width: 100%;
  border: 3px solid #00B4CC;
  border-right: none;
  padding: 6px 10px;
  height: 20px;
  border-radius: 20px 0 0 20px;
  outline: none;
  color: #9DBFAF;

  &:focus {
    color: #00B4CC;
  }
  line-height: 20px;
`;

const SearchButton = styled.button`
  width: 40px;
  height: 36px;
  border: 1px solid #00B4CC;
  background: #00B4CC;
  text-align: center;
  color: #fff;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  font-size: 20px;
  line-height: 20px;
`;

const RightHeader = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  flex: 1;
`;

const ProfileNameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

const ProfileName = styled.p`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
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
            <Feature>Apply for Subcription</Feature>
          </StyledNavLink>
        </FeaturesContainer>
      </LeftHeader>
        <Search>
          <SearchTerm type="text" placeholder="What are you looking for?" />
          <SearchButton type="submit">
            <SearchIcon />
          </SearchButton>
        </Search>
      <RightHeader>
          <ProfileNameContainer>
            <ProfileName>Hoang Long Vu</ProfileName>
          </ProfileNameContainer>
        <ProfileButton onClick={() => flow.logout()}>
          <PersonIcon />
        </ProfileButton>
      </RightHeader>
    </HeaderContainer>
  );
};

export default Header;
