import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../../utils/Var";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import { AptimusNetwork } from "aptimus-sdk-test";
import { PlayerInfo } from "../../type/type";
import ProfileContent from "./ProfileContent";

export interface ProfileModalProps {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

const existingImages = [
  "https://i.pinimg.com/564x/08/13/41/08134115f47ccd166886b40f36485721.jpg",
  "https://i.pinimg.com/564x/92/ab/3f/92ab3fa97e04a9eedc3a73daa634aa84.jpg",
  "https://i.pinimg.com/564x/1a/cd/42/1acd42b4e937c727350954d0df62177d.jpg",
  "https://i.pinimg.com/564x/0b/2d/d4/0b2dd46969ebcec7433a030e5e19b624.jpg",
  "https://i.pinimg.com/564x/4c/53/a8/4c53a88106cf101590c53ddc421c5c56.jpg",
];

const ProfileModal: React.FC<ProfileModalProps> = ({ open, handleOpen, handleClose }) => {
  const { auth } = useAuth();
  const address = localStorage.getItem("address") ?? "";

  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
    username: "",
    name: "",
    points: "0",
    games_played: "0",
    winning_games: "0",
    likes_received: "0",
    dislikes_received: "0",
    user_image: "",
    pool: "",
  });

  const [winRate, setWinRate] = useState<number>(0);
  const [editing, setEditing] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<string>(playerInfo.name);
  const [editingUsername, setEditingUsername] = useState<string>(playerInfo.username);
  const [editingImageLink, setEditingImageLink] = useState<string>("");
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const flow = useAptimusFlow();

  useEffect(() => {
    if (open) {
      fetchPlayerInfo(address);
    }
  }, [address, open]);

  useEffect(() => {
    if (editing) {
      setEditingName(playerInfo.name);
      setEditingUsername(playerInfo.username);
      setEditingImageLink("");
    }
  }, [editing, playerInfo]);

  useEffect(() => {
    const checkUsername = async () => {
      if (editingUsername && editingUsername !== playerInfo.username) {
        const taken = await isUsernameTaken(editingUsername);
        setUsernameTaken(taken as boolean);
      } else {
        setUsernameTaken(false);
      }
    };
    checkUsername();
  }, [editingUsername, playerInfo.username]);

  const fetchPlayerInfo = async (address: string) => {
    try {
      setLoading(true);
      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);

      const hexAddress = address.startsWith("0x") ? address : `0x${address}`;

      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::gamev3::get_player_info`,
        functionArguments: [hexAddress],
      };

      const response = await aptos.view({ payload });

      if (response && Array.isArray(response) && response.length > 0) {
        const playerData = response[0];
        const parsedPlayerData: PlayerInfo = typeof playerData === "string" ? JSON.parse(playerData) : playerData;

        setPlayerInfo(parsedPlayerData);
        setEditingName(parsedPlayerData.name || "");
        setEditingUsername(parsedPlayerData.username || "");
      } else {
        console.error("Unexpected response format or empty array:", response);
      }
    } catch (error) {
      console.error("Failed to fetch player info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const gamesPlayedNum = Number(playerInfo.games_played);
    const winningGamesNum = Number(playerInfo.winning_games);

    if (gamesPlayedNum > 0) {
      const ratio = (winningGamesNum / gamesPlayedNum) * 100;
      setWinRate(parseFloat(ratio.toFixed(2)));
    } else {
      setWinRate(0);
    }
  }, [playerInfo.games_played, playerInfo.winning_games]);

  const isUsernameTaken = async (username: string) => {
    try {
      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::gamev3::is_username_taken`,
        functionArguments: [username],
      };
      const response = await aptos.view({ payload });

      return response[0] as boolean;
    } catch (error) {
      console.error("Failed to check username exists:", error);
      return false;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
  };

  const handleExistingImageSelect = (imageUrl: string) => {
    setEditingImageLink(imageUrl);
  };

  const handleImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setEditingImageLink(link);
  };

  const handleUpdate = async () => {
    if (usernameTaken) {
      alert("Username is already taken. Please choose another one.");
      return;
    }

    try {
      setLoading(true);
      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);
      const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::update_account`;

      const transaction = await aptos.transaction.build.simple({
        sender: address ?? "",
        data: {
          function: FUNCTION_NAME,
          functionArguments: [editingName, editingUsername, editingImageLink],
        },
      });
      const committedTransaction = await flow.executeTransaction({
        aptos,
        transaction,
        network: AptimusNetwork.TESTNET,
      });

      if (committedTransaction?.success) {
        alert("Profile updated successfully!");
        setPlayerInfo((prev) => ({
          ...prev,
          name: editingName,
          username: editingUsername,
          user_image: editingImageLink,
        }));
        window.location.reload();
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setEditing(false);
    setUsernameTaken(false);
    setEditingImageLink("");
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="profile-modal-title"
      aria-describedby="profile-modal-description"
    >
      <ProfileContent
        auth={auth}
        address={address}
        playerInfo={playerInfo}
        winRate={winRate}
        editing={editing}
        editingName={editingName}
        editingUsername={editingUsername}
        editingImageLink={editingImageLink}
        usernameTaken={usernameTaken}
        loading={loading}
        existingImages={existingImages}
        handleCopy={handleCopy}
        handleExistingImageSelect={handleExistingImageSelect}
        handleImageLinkChange={handleImageLinkChange}
        handleUpdate={handleUpdate}
        handleCloseModal={handleCloseModal}
        setEditing={setEditing}
        setEditingName={setEditingName}
        setEditingUsername={setEditingUsername}
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
    </Modal>
  );
};

export default ProfileModal;
