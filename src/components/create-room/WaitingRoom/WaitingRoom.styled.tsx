import styled from "styled-components"
import { Avatar, Button } from "@mui/material"

export const WaitingRoomModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px;
  gap: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40rem;
  height: 42rem;
  background: linear-gradient(180deg, rgba(68, 97, 108, 0.6) 0%, rgba(42, 72, 74, 0.6) 100%);
  border-radius: 12px;
  backdrop-filter: blur(7px);
  border: 1px solid #fff;
`;
export const StadiumTitle = styled.h1`
  font-size: 24px;
  color: #fff;
  text-align: center;
  font-family: 'Nord', sans-serif;
  font-weight: 500;
  font-size: 40px;
  line-height: 48px;
`;

export const CustomBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 40px;
  width: 574px;
  height: 99px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
`;

export const RoomDetailBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 267px;
  flex: none;
  order: 0;
  flex-grow: 0; 
`;

export const RoomIDTypography = styled.p`
    width: 267px;
    height: 19px;
    font-family: 'Nord', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: rgba(255, 255, 255, 0.8);
`;

export const CreatorBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px;
    gap: 10px;
    width: 228px;
    flex: none;
    order: 1;
    flex-grow: 0;
`;

export const PlayerCountBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 10px;
  width: 267px;
  height: 29px;
  flex: none;
  order: 2;
  align-self: stretch;
  flex-grow: 0;
`;

export const PlayerCountIcon = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  height: 24px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const PlayerCountIconImage = styled.svg`
  width: 24px;
  height: 25px;
  viewBox: 0 0 24 25;
  fill: none;
  xmlns: "http://www.w3.org/2000/svg";
`;

export const PlayerCountTypography = styled.p`
  height: 17px;
  font-family: 'Nord', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: rgba(255, 255, 255, 0.6);
  flex: none;
  order: 1;
  flex-grow: 0;
`;

export const CountdownBox = styled.div`
  width: 267px;
  height: 19px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  gap: 10px;
  flex: none;
  order: 1;
  flex-grow: 0;
`;

export const CountdownTypography = styled.p`
  margin: 0 auto;
  width: 267px;
  height: 19px;
  font-family: 'Nord', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: rgba(255, 255, 255, 0.8);
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const PlayerTitle = styled.p`
  width: 188px;
  font-family: 'Nord', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #FFFFFF;
`;

export const PlayerBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 2px;
  width: 100%;
  height: 234px;
`;

export const PlayerDetailBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 24px;
  width: 267px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const NewBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 267px;
  height: 89px;
  flex: none;
  order: 1;
  flex-grow: 0;
`;


export const StyledAvatar = styled(Avatar)`
  width: 80px;
  height: 80px;
  background-color: #152D31;
  flex: none;
  order: 0;
  flex-grow: 0;
  cursor: pointer;
`;

export const PointTypography = styled.p`
  width: 267px;
  font-family: 'Nord', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: rgba(255, 255, 255, 0.8);
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const AddressBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 10px;
  width: 99px;
  height: 19px;
  flex: none;
  order: 1;
  flex-grow: 0;
`;


export const AddressTypography = styled.p`
  width: 99px;
  font-family: 'Nord', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: rgba(255, 255, 255, 0.6);
  flex: none;
  order: 0;
  flex-grow: 0;
`;
export const ReadyBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 10px;
  width: 58px;
  height: 19px;
  flex: none;
  order: 2;
  flex-grow: 0;
`;

export const ReadyTypography = styled.p`
  width: 58px;
  font-family: 'Nord', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #FFFFFF;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const Divider = styled.div`
  width: 1px;
  height: 234px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  flex: none;
  margin: 0 auto;
  order: 1;
  flex-grow: 0;
`;

export const ReadyButton = styled(Button)`
  width: 100%;
  height: 40px;
  background-color: #152D31;
  color: #FFFFFF;
  border-radius: 12px;
`;
export const ReadyButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 24px;
  width: 574px;
  height: 61px;
  flex: none;
  order: 3;
  flex-grow: 0;
`;

export const ReadyButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 10px;
  width: 574px;
  height: 61px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;
