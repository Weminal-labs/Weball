import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Header from "../../components/layout/Header/Header";
import SideBar from "../../components/layout/SideBar";

const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  gap: 16px;
  height: 100vh;
  backdrop-filter: blur(2px);
`;

const HeaderWrapper = styled.div`
  grid-column: span 12;
  grid-row: span 1;
`;

const SidebarWrapper = styled.div`
  grid-column: span 2;
  grid-row: span 11;
`;

const MainContentWrapper = styled.div`
  grid-column: span 10;
  grid-row: span 11;
  padding:30px
`;

const Layout = () => {
  return (
    <LayoutContainer>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <SidebarWrapper>
        <SideBar />
      </SidebarWrapper>
      <MainContentWrapper>
        <Outlet />
      </MainContentWrapper>
    </LayoutContainer>
  );
};

export default Layout;
