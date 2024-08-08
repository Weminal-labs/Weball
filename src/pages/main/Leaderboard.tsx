import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Định nghĩa giao diện Player
interface Player {
  address: string;
  games_played: number;
  points: number;
  winning_games: number;
  rank: number;
}

const GlobalStyle = createGlobalStyle`
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #0cbd16;
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

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'top10' | 'top50' | 'top100'>('top10');
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (activeTab === 'top10') {
      fetchTop10Players();
    } else if (activeTab === 'top50') {
      fetchTop50Players();
    } else {
      fetchTop100Players();
    }
  }, [activeTab]);

  const fetchTop10Players = async () => {
    try {
      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);
      const payload = {
        function: `${MODULE_ADDRESS}::gamev3::get_top_10_players`,
        functionArguments: [],
      };
      const data = await aptos.view({ payload });

      const players = data.map((player: any, index: number) => ({
        address: player.address,
        games_played: parseInt(player.games_played, 10),
        points: parseInt(player.points, 10),
        winning_games: parseInt(player.winning_games, 10),
        rank: index + 1,
      }));

      setPlayers(players);
    } catch (error) {
      console.error("Failed to fetch top 10 players:", error);
    }
  };

  const fetchTop50Players = async () => {
    try {
      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);
      const payload = {
        function: `${MODULE_ADDRESS}::gamev3::get_top_50_players`,
        functionArguments: [],
      };
      const data = await aptos.view({ payload });

      const players = data.map((player: any, index: number) => ({
        address: player.address,
        games_played: parseInt(player.games_played, 10),
        points: parseInt(player.points, 10),
        winning_games: parseInt(player.winning_games, 10),
        rank: index + 1,
      }));

      setPlayers(players);
    } catch (error) {
      console.error("Failed to fetch top 50 players:", error);
    }
  };

  const fetchTop100Players = async () => {
    try {
      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);
      const payload = {
        function: `${MODULE_ADDRESS}::gamev3::get_top_100_players`,
        functionArguments: [],
      };
      const data = await aptos.view({ payload });

      const players = data.map((player: any, index: number) => ({
        address: player.address,
        games_played: parseInt(player.games_played, 10),
        points: parseInt(player.points, 10),
        winning_games: parseInt(player.winning_games, 10),
        rank: index + 1,
      }));

      setPlayers(players);
    } catch (error) {
      console.error("Failed to fetch top 100 players:", error);
    }
  };

  const topPlayers = players.slice(0, 3);
  const otherPlayers = players.slice(3);

  return (
    <>
      <GlobalStyle />
      <LeaderboardContainer>
        <TabContainer>
          <Tab active={activeTab === 'top10'} onClick={() => setActiveTab('top10')}>Top 10</Tab>
          <Tab active={activeTab === 'top50'} onClick={() => setActiveTab('top50')}>Top 50</Tab>
          <Tab active={activeTab === 'top100'} onClick={() => setActiveTab('top100')}>Top 100</Tab>
        </TabContainer>

        <PodiumContainer>
          {topPlayers.map((player, index) => (
            <PodiumPlace key={player.address} place={index + 1}>
              <Crown>{index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}</Crown>
              <Avatar src={`https://avatars.dicebear.com/api/human/${player.address}.svg`} alt={player.address} />
              <Username>{player.address}</Username>
              <Score>{player.points}</Score>
              <Pedestal place={index + 1}>{index + 1}</Pedestal>
            </PodiumPlace>
          ))}
        </PodiumContainer>

        <LeaderboardList>
          {otherPlayers.map(player => (
            <LeaderboardItem key={player.address}>
              <Rank>{player.rank}</Rank>
              <PlayerInfo>
                <SmallAvatar src={`https://avatars.dicebear.com/api/human/${player.address}.svg`} alt={player.address} />
                <Username>{player.address}</Username>
              </PlayerInfo>
              <PlayerScore>{player.points}</PlayerScore>
            </LeaderboardItem>
          ))}
        </LeaderboardList>
      </LeaderboardContainer>
    </>
  );
};

export default Leaderboard;