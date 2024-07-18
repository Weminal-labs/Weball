import styled from "styled-components";

interface RoomProps {
    roomName: string;
    currentName: string;
    opponentName: string;
    bettingAmount: number;
    onClick: () => void;
}

const RoomCard: React.FC<RoomProps> = ({ roomName, currentName, opponentName, bettingAmount, onClick }) => {
    return (
        <RoomCardContainer>
            <RoomName>{roomName}</RoomName>
            <BettingAmount>{bettingAmount} APT</BettingAmount>
            <RoomInfo>
                <PlayerNameWrapper>
                    <Playername>{currentName}</Playername>
                </PlayerNameWrapper>
                <PlayerNameWrapper>
                    <Playername>{opponentName}</Playername>
                </PlayerNameWrapper>
            </RoomInfo>
            <JoinButton onClick={onClick}>Join</JoinButton>
        </RoomCardContainer>
    );
};

const RoomCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-image: url("./public/vs.png");
  background-size: cover;
  background-position: center;
  gap: 15px;
  padding-bottom: 30px;
  height: 250px;
  width: 230px;
`;

const RoomName = styled.h2`
  color: #333;
  font-size: 36px;
  margin-bottom: 0px;
  margin-top: -10px;
`;

const BettingAmount = styled.span`
  color: #333;
  font-size: 24px;
  margin-bottom: 12px;
`;

const RoomInfo = styled.div`
    display: flex;
    margin-top: 10px;
    align-items: center;
    width: 100%;
    justify-content: space-between;
`;

const PlayerNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Playername = styled.span`
  color: white;
  font-size: 24px;
  margin-bottom: 25px;

`;

const JoinButton = styled.button`
  font-family: "Open Sans", sans-serif;
  font-size: 26px;
  letter-spacing: 2px;
  text-decoration: none;
  text-transform: uppercase;
  color: #000;
  cursor: pointer;
  border: 3px solid;
  padding: 0.25em 0.5em;
  box-shadow: 1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px, 5px 5px 0px 0px;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  &:active {
    box-shadow: 0px 0px 0px 0px;
    top: 5px;
    left: 5px;
  }
  @media (min-width: 768px) {
    padding: 0.25em 0.75em;
  }
`

export default RoomCard;

