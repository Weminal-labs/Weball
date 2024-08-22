import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../../utils/Var";
import { PlayerInfo } from "../../type/type";
import useGetPlayer from "../../hooks/useGetPlayer";
import useContract from "../../hooks/useContract";
import { ModalContainer, ModalContent, Header, ImageUpload, InfoBox, StatBox, StatItem, AvatarImage } from './styles.tsx';
import { Box, Button, Divider, LinearProgress, Typography, TextField, Grid } from "@mui/material";
import { shortenAddress } from '../../utils/Shorten';
import { ContentCopy } from "@mui/icons-material";
import { Cancel, CheckCircle, Star, AttachMoney } from "@mui/icons-material";
import { useAlert } from "../../contexts/AlertProvider";
type Coin = { coin: { value: string } };

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
  const [balance,setBalance]=useState<string>("")
  const { fetchPlayer  } = useGetPlayer();
  const { callContract } = useContract();

  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
    username: "", name: "", points: "0", games_played: "0", winning_games: "0", likes_received: "0", dislikes_received: "0", user_image: "", pool: "",
  });

  const [winRate, setWinRate] = useState<number>(0);
  const [editing, setEditing] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<string>(playerInfo.name);
  const [editingUsername, setEditingUsername] = useState<string>(playerInfo.username);
  const [editingImageLink, setEditingImageLink] = useState<string>("");
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { setAlert } = useAlert();

  useEffect(() => {
    if (open) {
      fetchPlayerInfo(address);
    }
  }, [address, open]);

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
    setLoading(true);
    const player = await fetchPlayer(address);
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);
    const resource =await aptos.getAccountResource<Coin>({
      accountAddress: address,
      resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
    });
     
    // Now you have access to the response type property
    const value = resource.coin.value;
    setBalance(value)
    if (player) {
      setPlayerInfo(player);
      setEditingName(player.name || "");
      setEditingUsername(player.username || "");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (Number(playerInfo.games_played) > 0) {
      const ratio = (Number(playerInfo.winning_games) / Number(playerInfo.games_played)) * 100;
      setWinRate(parseFloat(ratio.toFixed(2)));
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

  const handleUpdate = async () => {
    if (usernameTaken) {
      setAlert("Username is already taken. Please choose another one.", "error");
      return;
    }
    await callContract({
      functionName: "update_account",
      functionArgs: [editingName, editingUsername, editingImageLink],
      onSuccess: (data: any) => {
        setAlert("Profile updated successfully!", "success");
        setPlayerInfo((prev) => ({
          ...prev,
          name: editingName,
          username: editingUsername,
          user_image: editingImageLink,
        }));
        window.location.reload();
      },
      onError: (error: any) => {
        console.error("Error updating profile:", error);
      },
    });
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
      <ModalContainer>
      <ModalContent>
        <Header>Player Information</Header>
        {loading && (
          <Box width="100%">
            <LinearProgress />
          </Box>
        )}
        <Box display="flex" gap={2} alignItems="center">
          <label htmlFor="image-upload">
            <ImageUpload
              id="image-upload"
              imageUrl={playerInfo.user_image || auth?.picture || ""}
              editing={editing}
            />
          </label>
          <InfoBox>
            ✉️ {auth?.email}
            <br />
            🪪 {shortenAddress(address, 5)}{" "}
            
            <ContentCopy
              style={{ fontSize: "smaller", cursor: "pointer" }}
              onClick={() => navigator.clipboard.writeText(address)}
            />
            <br />
            <AttachMoney color="action" /> {parseFloat(balance)/1000000000} APT
          </InfoBox>
        </Box>
        <Box display="flex" flexDirection="column" gap={1} width="100%">
          {editing ? (
            <>
              <TextField
                label="Name"
                variant="outlined"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Username"
                variant="outlined"
                value={editingUsername}
                onChange={(e) => setEditingUsername(e.target.value)}
                error={usernameTaken}
                helperText={usernameTaken ? "Username is already taken" : ""}
                InputProps={{
                  endAdornment: usernameTaken ? (
                    <Cancel color="error" />
                  ) : (
                    <CheckCircle color="action" />
                  ),
                }}
                fullWidth
              />
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Select an Avatar:
              </Typography>
              <Grid container spacing={2}>
                {existingImages.map((imgUrl, index) => (
                  <Grid item xs={4} sm={2} key={index}>
                    <AvatarImage
                      src={imgUrl}
                      selected={editingImageLink === imgUrl}
                      onClick={() => setEditingImageLink(imgUrl)}
                    />
                  </Grid>
                ))}
              </Grid>
              <TextField
                label="Or enter image URL"
                variant="outlined"
                value={editingImageLink}
                onChange={(e) => setEditingImageLink(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
            </>
          ) : (
            <>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Typography
                  variant="h6"
                  style={{ fontWeight: "bold", marginRight: "8px" }}
                >
                  Name:
                </Typography>
                <Typography variant="h6">{playerInfo.name}</Typography>
              </Box>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Typography
                  variant="h6"
                  style={{ fontWeight: "bold", marginRight: "8px" }}
                >
                  Username:
                </Typography>
                <Typography variant="h6">@{playerInfo.username}</Typography>
              </Box>
            </>
          )}
        </Box>
        <Box display="flex" justifyContent="flex-start" width="100%" marginTop="-15px">
          <Typography variant="h6" style={{ fontWeight: "bold", marginRight: "8px" }}>
            Total:
          </Typography>
          <Typography variant="h6">{playerInfo.games_played} matches</Typography>
        </Box>
        <Box display="flex" justifyContent="flex-start" width="100%" marginTop="-15px">
          <Typography variant="h6" style={{ fontWeight: "bold", marginRight: "8px" }}>
            Win rate:
          </Typography>
          <Typography variant="h6">{winRate.toString()}%</Typography>
        </Box>
        <StatBox>
          <StatItem>
            <Typography>{playerInfo.winning_games}</Typography>
            <Typography>Wins</Typography>
          </StatItem>
          <Divider
            variant="middle"
            orientation="vertical"
            sx={{ borderColor: "gray", borderWidth: 2, marginY: 2 }}
          />
          <StatItem>
            <Typography>{Number(playerInfo.games_played) - Number(playerInfo.winning_games)}</Typography>
            <Typography>Losses</Typography>
          </StatItem>
        </StatBox>
        <Box display="flex" gap={3} alignItems="center">
          <Star color="primary" />
          <Typography variant="h6" color="textPrimary">
            {playerInfo.points} Points
          </Typography>
        </Box>
        <Box display="flex" gap={3}>
          {editing ? (
            <>
              <Button
                onClick={handleUpdate}
                variant="contained"
                sx={{ fontSize: "18px" }}
                disabled={loading || usernameTaken}
              >
                {loading ? "Updating..." : "Update"}
              </Button>
              <Button
                onClick={() => setEditing(false)}
                variant="contained"
                sx={{ fontSize: "18px" }}
                disabled={loading}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setEditing(true)}
                variant="contained"
                sx={{ fontSize: "18px" }}
                disabled={loading}
              >
                Edit
              </Button>
              <Button
                onClick={handleCloseModal}
                variant="contained"
                sx={{ fontSize: "18px" }}
                disabled={loading}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </ModalContent>
    </ModalContainer>
    </Modal>
  );
};

export default ProfileModal;