import styled from "styled-components";

// create Room card
const RoomCard: React.FC<{ roomName: string; roomCode: string }> = ({ roomName, roomCode }) => {
  return (
    <RoomCardContainer>
      <RoomName>{roomName}</RoomName>
      <RoomCode>{roomCode}</RoomCode>
    </RoomCardContainer>
  );
};

const RoomCardContainer = styled.div`
  background-color: #fff;
  border-radius: 15px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const RoomName = styled.h2`
  color: #333;
  font-size: 20px;
  margin-bottom: 10px;
`;

const RoomCode = styled.p`
  color: #666;
  font-size: 16px;
`;

export default RoomCard;
