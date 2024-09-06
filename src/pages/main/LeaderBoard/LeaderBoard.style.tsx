import styled, { keyframes, createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
::-webkit-scrollbar {
  width: 12px;
}


::-webkit-scrollbar-thumb {
  background-color: #1E90FF;
  border-radius: 6px;
  border: 3px solid #0cbd16;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #1E90FF #0cbd16;
}
`;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;
export const TopPlayerContainer = styled.div`

`;

export const LeaderboardContainer = styled.div`
margin-left: 150px;
  color: white;
  width: 60vw;
  height: 80vh;
  display: flex;
  align-items: center; 
  justify-content: space-around;
  gap: 200px;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-in;
`;

export const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

export const Tab = styled.button<{ $active: boolean }>`
  background-color: ${(props) => (props.$active ? "white" : "transparent")};
  color: #488C84;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${(props) => (props.$active ? "white" : "white")};
  }
`;

export const PodiumContainer = styled.div`
    display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 30px;
`;

export const PodiumPlace = styled.div<{ place: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: ${(props) => props.place * 0.2}s;
`;


export const Crown = styled.div`
  font-size: 35px;
  margin-bottom: 10px;
`;

export const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

export const Username = styled.div`
  margin-top: 10px;
  font-weight: bold;
  cursor: pointer;
`;

export const Score = styled.div`
  color: #ff9a3c;
  font-weight: bold;
`;

export const Pedestal = styled.div<{ place: number }>`
  width: 100px;
  height: ${(props) => 100 - (props.place - 1) * 20}px;
  background-color: #252a34;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
`;

export const TableContainer = styled.div`
  max-height: 400px;
  width: 40%;
  overflow-y: auto;
  padding-right: 10px;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: #252a34;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
  }
`;

export const LeaderboardItem = styled.div`
  background: linear-gradient(180deg, rgba(68, 97, 108, 0.6) 0%, rgba(42, 72, 74, 0.6) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-bottom: 5px;
  border-radius: 5px;
  transition: all 0.3s ease;
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 0 10px rgba(255, 46, 99, 0.5);
  }
`;

export const Rank = styled.div`
  width: 30px;
  font-weight: bold;
`;

export const PlayerInfoWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
`;
export const SmallAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
`;

export const PlayerScore = styled.div`
  color: #ff9a3c;
  font-weight: bold;
`;

