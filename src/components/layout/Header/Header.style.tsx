import styled from "styled-components";
import { Box, IconButton } from "@mui/material";

export const HeaderContainer = styled.div`
  height: 100%;
  padding: 20px;
  text-align: left;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const LeftHeader = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  flex: 1;
`;

export const TitleContainer = styled.header`
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

export const Logo = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50px;
  margin-right: 5px;
`;

export const Title = styled.h1`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 3px;
`;

export const RightHeader = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  flex: 1;
`;

export const WelcomeText = styled.p`
  color: white;
  font-size: 14px;
  margin-right: 20px;
  cursor: pointer;
`;

export const ChatModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1000px;
  height: 85vh;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
`;

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
`;

export const MessageItem = styled.div`
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.4);
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
`;

export const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MessageText = styled.span`
  font-size: 16px;
`;

export const MessageMeta = styled.span`
  font-size: 12px;
  color: #555;
`;

export const MessageUsername = styled.span`
  font-size: 12px;
  color: #555;
  cursor: pointer;
`;

export const PlayerInfoModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: #233A3E;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const CloseButton = styled(IconButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
`;

export const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
`;

export const modalStyles = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};