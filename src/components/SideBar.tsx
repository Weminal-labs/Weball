import React from "react";
import styled from "styled-components";
import { SvgIconProps } from "@mui/material/SvgIcon";

interface SideBarProps {
  items: { icon: React.ReactElement<SvgIconProps>; text: string; onClick: () => void }[];
  selectedItem: string; // Add this prop
}

export const SideBar: React.FC<SideBarProps> = ({ items, selectedItem }) => {
  return (
    <SideBarContainer>
      {items.map((item, index) => (
        <SideBarItem 
          key={index} 
          icon={item.icon} 
          text={item.text} 
          onClick={item.onClick} 
          isSelected={item.text === selectedItem} // Check if item is selected
        />
      ))}
    </SideBarContainer>
  );
};

const SideBarItem: React.FC<{ icon: React.ReactElement<SvgIconProps>; text: string; onClick: () => void; isSelected: boolean }> = ({ icon, text, onClick, isSelected }) => {
  return (
    <ItemContainer onClick={onClick} isSelected={isSelected}>
      <ItemIcon>{React.cloneElement(icon, { fontSize: "inherit" })}</ItemIcon>
      <ItemText>{text}</ItemText>
    </ItemContainer>
  );
};

const SideBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ItemContainer = styled.div<{ isSelected: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  padding: 10px 0;
  font-size: 50px;
  background-color: ${({ isSelected }) => (isSelected ? "#282828" : "#181818")};
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const ItemIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: gray;
`;

const ItemText = styled.div`
  color: #fff;
  font-size: 12px;
  text-align: center;
  color: gray;
`;

export default SideBar;
