import React, { useState, useEffect } from "react";
import { Aptos, AptosConfig, Network, InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../../../utils/Var.tsx";
import PlayerInfoModal from "../../../components/layout/Header/PlayerInfoModal.tsx";
import useGetPlayer from "../../../hooks/useGetPlayer.tsx";
import { PlayerInfo } from "../../../type/type.tsx";// Player Interface
import { GlobalStyle, LeaderboardContainer, TopPlayerContainer, TabContainer, Tab, PodiumContainer, PodiumPlace, Crown, Avatar, Username, Score, Pedestal, TableContainer, LeaderboardItem, PlayerInfoWrapper, SmallAvatar, PlayerScore, Rank } from "./LeaderBoard.style.tsx";

interface Player {
  rank: number;
  address: string;
  user_image: string;
  username: string;
  points: string;
}

const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"top10" | "top50" | "top100">("top10");
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
      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::gamev3::${getPlayersFunction}`,
        functionArguments: [],
      };
      const data = await aptos.view({ payload });
      const playerArray = data[0];
      if (Array.isArray(playerArray)) {
        const players = playerArray.map(async (entry: any, index: number) => {
          const player = await fetchPlayer(entry.address);
          return {
            address: entry.address,
            user_image: player?.user_image || "",
            username: player?.username || "",
            points: entry.points || "",
            rank: index + 1,
          };
        });
        const resolvedPlayers = await Promise.all(players);
        setPlayers(resolvedPlayers);
      } else {
        console.error("Unexpected data format:", playerArray);
      }
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
      setPlayerInfo(player as PlayerInfo);
      setPlayerAddress(playerAddress);
      setPlayerInfoModalOpen(true);
    }
    setLoading(false);
  };

  const topPlayers = players.slice(0, 3);
  const remainingPlayers = players.slice(3);

  return (
    <>
      {/* <GlobalStyle /> */}
      <LeaderboardContainer>
        <TopPlayerContainer>
          <TabContainer>
            <Tab $active={activeTab === "top10"} onClick={() => setActiveTab("top10")}>Top 10</Tab>
            <Tab $active={activeTab === "top50"} onClick={() => setActiveTab("top50")}>Top 50</Tab>
            <Tab $active={activeTab === "top100"} onClick={() => setActiveTab("top100")}>Top 100</Tab>
          </TabContainer>
          <PodiumContainer>
            {topPlayers.map((player, index) => (
              <PodiumPlace key={player.address} place={index + 1}>
                <Crown>{index === 0 ? "👑" : index === 1 ? "🥈" : "🥉"}</Crown>
                <Avatar
                  src={player.user_image}
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
        </TopPlayerContainer>

        <TableContainer>
          {remainingPlayers.map((player) => (
            <LeaderboardItem key={player.address}>
              <Rank>{player.rank}</Rank>
              <PlayerInfoWrapper>
                <SmallAvatar
                  src={player.user_image}
                  alt={player.username}
                />
                <Username onClick={() => handlePlayerInfoOpen(player.address)}>
                  {shortenAddress(player.address)}
                </Username>
              </PlayerInfoWrapper>
              <PlayerScore>{player.points}</PlayerScore>
            </LeaderboardItem>
          ))}
        </TableContainer>
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