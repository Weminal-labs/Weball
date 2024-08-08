// Import styled-components đã được sửa để khắc phục lỗi không tìm thấy module
import React from 'react';
import styled, { keyframes } from 'styled-components';
// Định nghĩa giao diện Player
interface Player {
  id: string;
  username: string;
  avatar: string;
  score: number;
  rank: number;
}

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

const LeaderboardContainer = styled.div`
 background-color: #1a1a2e;
  color: white;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease-in;
`; 
const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? '#ff2e63' : 'transparent'};
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${props => props.active ? '#ff2e63' : '#ff2e6350'};
  }
`;

const PodiumContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 30px;
`;

const PodiumPlace = styled.div<{ place: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: ${props => props.place * 0.2}s;
`;

const Crown = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #ff2e63;
`;

const Username = styled.div`
  margin-top: 10px;
  font-weight: bold;
`;

const Score = styled.div`
  color: #ff9a3c;
  font-weight: bold;
`;

const Pedestal = styled.div<{ place: number }>`
  width: 100px;
  height: ${props => 100 - (props.place - 1) * 20}px;
  background-color: #252a34;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
`;

const LeaderboardList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: #252a34;
  }
  &::-webkit-scrollbar-thumb {
    background: #ff2e63;
    border-radius: 5px;
  }
`;

const LeaderboardItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #252a34;
  margin-bottom: 5px;
  border-radius: 5px;
  transition: all 0.3s ease;
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 0 10px rgba(255, 46, 99, 0.5);
  }
`;

const Rank = styled.div`
  width: 30px;
  font-weight: bold;
`;

const PlayerInfo = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

const SmallAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
`;

const PlayerScore = styled.div`
  color: #ff9a3c;
  font-weight: bold;
`;
// Component chính
const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'daily' | 'monthly'>('daily');

  const topPlayers: Player[] = [
    { id: '1', username: '@jeniffer', avatar: 'https://i.pravatar.cc/300', score: 2670, rank: 1 },
    { id: '2', username: '@amanda', avatar: 'https://i.pravatar.cc/300', score: 156, rank: 2 },
    { id: '3', username: '@canes', avatar: 'https://i.pravatar.cc/300', score: 1543, rank: 3 },
  ];

  const otherPlayers: Player[] = [
    { id: '4', username: '@player', avatar: 'https://i.pravatar.cc/300', score: 34323, rank: 4 },
    { id: '5', username: '@pineapple', avatar: 'https://i.pravatar.cc/300', score: 243553, rank: 5 },
    { id: '6', username: '@catplayer', avatar: 'https://i.pravatar.cc/300', score: 143902, rank: 6 },
    // Add more players as needed
  ];

  return (
    <LeaderboardContainer>
      <TabContainer>
        <Tab active={activeTab === 'daily'} onClick={() => setActiveTab('daily')}>Daily</Tab>
        <Tab active={activeTab === 'monthly'} onClick={() => setActiveTab('monthly')}>Monthly</Tab>
      </TabContainer>

      <PodiumContainer>
        {topPlayers.map((player, index) => (
          <PodiumPlace key={player.id} place={index + 1}>
            <Crown>{index === 0 ? '👑' : index === 1 ? '👑' : '👑'}</Crown>
            <Avatar src={player.avatar} alt={player.username} />
            <Username>{player.username}</Username>
            <Score>{player.score}</Score>
            <Pedestal place={index + 1}>{index + 1}</Pedestal>
          </PodiumPlace>
        ))}
      </PodiumContainer>

      <LeaderboardList>
        {otherPlayers.map(player => (
          <LeaderboardItem key={player.id}>
            <Rank>{player.rank}</Rank>
            <PlayerInfo>
              <SmallAvatar src={player.avatar} alt={player.username} />
              <Username>{player.username}</Username>
            </PlayerInfo>
            <PlayerScore>{player.score}</PlayerScore>
          </LeaderboardItem>
        ))}
      </LeaderboardList>
    </LeaderboardContainer>
  );
};

export default Leaderboard;
