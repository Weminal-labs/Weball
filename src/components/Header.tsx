import React from "react";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import useAuth from "../hooks/useAuth";
import { Avatar } from "@mui/material";

const HeaderContainer = styled.div`
  height: 40px;
  padding: 20px;
  text-align: left;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #181818;
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
  margin-right: 5px;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 3px;
`;

const Search = styled.div`
  width: 40%;
  position: relative;
  display: flex;
  flex: 1;
  margin-left: 40px;
`;

const SearchTerm = styled.input`
  width: 100%;
  border: 3px solid #00b4cc;
  border-right: none;
  padding: 6px 10px;
  height: 20px;
  border-radius: 20px 0 0 20px;
  outline: none;
  color: #9dbfaf;

  &:focus {
    color: #00b4cc;
  }
  line-height: 20px;
`;

const SearchButton = styled.button`
  width: 40px;
  height: 36px;
  border: 1px solid #00b4cc;
  background: #00b4cc;
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

const WelcomeText = styled.p`
  color: white;
  font-size: 14px;
  margin-right: 20px;
`;
const Header: React.FC = () => {
  const { auth } = useAuth();
  const flow = useAptimusFlow();

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
              src={"../public/logo.png"}
              alt="logo"
            />
          </Logo>
          <Title>WEBALL</Title>
        </TitleContainer>
      </LeftHeader>
      <Search>
        <SearchTerm type="text" placeholder="What are you looking for?" />
        <SearchButton type="submit">
          <SearchIcon />
        </SearchButton>
      </Search>
      <RightHeader>
        <WelcomeText
          onClick={() => {
            flow.logout();
          }}
        >
          {auth?.email}
        </WelcomeText>
        <Avatar src={auth?.picture} />
      </RightHeader>
    </HeaderContainer>
  );
};

export default Header;
