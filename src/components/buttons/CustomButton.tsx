import React from 'react';
import styled from 'styled-components';
interface CustomButtonProps {
    content: string;
    isMain: boolean;
    onClick: () => void;
    disabled: boolean
  }
  
const CustomButton = ({ content, isMain, onClick }:CustomButtonProps) => {
  return (
    <ButtonStyled isMain={isMain} onClick={onClick}>
      {content}
    </ButtonStyled>
  );
};

// Styled component for the button
const ButtonStyled = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid white; 
  letter-spacing:2px;
cursor: pointer;
  color:white;
  background-color: ${({ isMain }) => (isMain ? '#41646A' : '#152D31')};
  width: 80%;

`;

export default CustomButton;
