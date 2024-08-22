import styled from 'styled-components';
import { Box } from "@mui/material";

export const ModalContainer = styled(Box)`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 620px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled(Box)`
  position: absolute;
  width: 450px;
  max-width: 80%;
  border-radius: 10px;
  background-color: lightgray;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  border: 2px solid primary;
  padding: 32px;
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.2);
`;

export const Header = styled(Box)`
  width: 70%;
  height: 50px;
  background-color: #ccc;
  color: white;
  position: absolute;
  text-align: center;
  line-height: 50px;
  font-weight: bold;
  top: -25px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

export const ImageUpload = styled.div<{ imageUrl: string, editing: boolean }>`
  width: 70px;
  height: 70px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  border: 3px solid gray;
  border-radius: 50%;
  cursor: ${props => (props.editing ? 'pointer' : 'default')};
  position: relative;
`;

export const InfoBox = styled(Box)`
  width: 320px;
  height: 110px;
  border: 3px solid gray;
  border-radius: 8px;
  font-size: 20px;
  padding: 8px;
`;

export const StatBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  color: #808080;
  border-top: 4px solid;
  border-bottom: 4px solid;
  width: 100%;
  height: 80px;
`;

export const StatItem = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const AvatarImage = styled.img<{ selected: boolean }>`
  width: 56px;
  height: 56px;
  border: ${props => (props.selected ? '3px solid blue' : '2px solid gray')};
  cursor: pointer;
`;