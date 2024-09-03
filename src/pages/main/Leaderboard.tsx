import React, { useState, useEffect } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import {
  Aptos,
  AptosConfig,
  Network,
  Secp256k1PrivateKey,
  Account,
  AccountAddress,
  InputViewFunctionData,
} from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../../utils/Var";
import PlayerInfoModal from "../../components/layout/Header/PlayerInfoModal";
import useGetPlayer from "../../hooks/useGetPlayer";
import { PlayerInfo } from "../../type/type.ts";// Player Interface
interface Player {
  address: string;
  username: string;
  games_played: number;
  points: number;
  winning_games: number;
  rank: number;
}

const GlobalStyle = createGlobalStyle`
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

const LeaderboardContainer = styled.div`
  color: white;
  padding: 1px;
  width: 60vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center; // Add this line
  justify-content: center; // Add this line
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-in;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ $active: boolean }>`
  background-color: ${(props) => (props.$active ? "white" : "transparent")};
  color: #488C84;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${(props) => (props.$active ? "white" : "white")};
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
  animation-delay: ${(props) => props.place * 0.2}s;
`;


const Crown = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const Username = styled.div`
  margin-top: 10px;
  font-weight: bold;
  cursor: pointer;
`;

const Score = styled.div`
  color: #ff9a3c;
  font-weight: bold;
`;

const Pedestal = styled.div<{ place: number }>`
  width: 100px;
  height: ${(props) => 100 - (props.place - 1) * 20}px;
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

const PlayerInfoWrapper = styled.div`
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



const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"top10" | "top50" | "top100">(
    "top10",
  );
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerInfoModalOpen, setPlayerInfoModalOpen] = useState(false);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [playerAddress, setPlayerAddress] = useState<string | null>(null);
  const { fetchPlayer } = useGetPlayer();


  useEffect(() => {
    if (activeTab === "top10") {
      fetchTop10Players();
    } else if (activeTab === "top50") {
      fetchTop50Players();
    } else {
      fetchTop100Players();
    }
  }, [activeTab]);

 const fetchPlayers = async (getPlayersFunction: string) => {
    try {
      const aptosConfig = new AptosConfig({ 
        network: Network.TESTNET,
        fullnode: 'https://faucet.testnet.suzuka.movementlabs.xyz/v1',
        faucet: 'https://faucet.testnet.suzuka.movementlabs.xyz/',
      });
      const aptos = new Aptos(aptosConfig);
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::gamev3::${getPlayersFunction}`,
        functionArguments: [],
      };
      const data = await aptos.view({ payload });

      const players = data.map((entry: any, index: number) => {
        const player = entry[0];
        return {
          address: player.address,
          username: player.username || `Player ${index + 1}`, // Add this line
          games_played: parseInt(player.games_played, 10),
          points: parseInt(player.points, 10),
          winning_games: parseInt(player.winning_games, 10),
          rank: index + 1,
        };
      });

      setPlayers(players);
    } catch (error) {
      console.error(`Failed to fetch players:`, error);
    }
  };

  const fetchTop10Players = () => fetchPlayers("get_top_10_players");
  const fetchTop50Players = () => fetchPlayers("get_top_50_players");
  const fetchTop100Players = () => fetchPlayers("get_top_100_players");


  const handlePlayerInfoOpen = async (playerAddress: string) => {
    setLoading(true);
    const player = await fetchPlayer(playerAddress);
    if (player) {
      setPlayerInfo(player);
      setPlayerAddress(playerAddress);
      setPlayerInfoModalOpen(true);
    }
    setLoading(false);
  };

  const topPlayers = players.slice(0, 3);
  const otherPlayers = players.slice(3);

  return (
    <>
      <GlobalStyle />
      <LeaderboardContainer>
        <TabContainer>
          <Tab
            $active={activeTab === "top10"}
            onClick={() => setActiveTab("top10")}
          >
            Top 10
          </Tab>
          <Tab
            $active={activeTab === "top50"}
            onClick={() => setActiveTab("top50")}
          >
            Top 50
          </Tab>
          <Tab
            $active={activeTab === "top100"}
            onClick={() => setActiveTab("top100")}
          >
            Top 100
          </Tab>
        </TabContainer>

       <PodiumContainer>
          {topPlayers.map((player, index) => (
            <PodiumPlace key={player.address} place={index + 1}>
              <Crown>{index === 0 ? "👑" : index === 1 ? "🥈" : "🥉"}</Crown>
              <Avatar
                src={`https://avatars.dicebear.com/api/human/${player.address}.svg`}
                alt={player.username}
              />
              <Username onClick={() => handlePlayerInfoOpen(player.address)}>
                {shortenAddress(player.address)}
              </Username>
              <Score>{player.points}</Score>
              <Pedestal place={index + 1}>{index + 1}</Pedestal>
            </PodiumPlace>
          ))}
        </PodiumContainer>

        <LeaderboardList>
          {otherPlayers.map((player) => (
            <LeaderboardItem key={player.address}>
              <Rank>{player.rank}</Rank>
              <PlayerInfoWrapper>
                <SmallAvatar
                  src={`https://avatars.dicebear.com/api/human/${player.address}.svg`}
                  alt={player.username}
                />
                <Username onClick={() => handlePlayerInfoOpen(player.address)}>
                  {player.username || shortenAddress(player.address)}
                </Username>
              </PlayerInfoWrapper>
              <PlayerScore>{player.points}</PlayerScore>
            </LeaderboardItem>
          ))}
        </LeaderboardList>
      </LeaderboardContainer>
      <PlayerInfoModal
  open={playerInfoModalOpen}
  handleClose={() => setPlayerInfoModalOpen(false)}
  playerInfo={playerInfo}
  playerAddress={playerAddress}
/>
    </>
  );
};

export default Leaderboard;