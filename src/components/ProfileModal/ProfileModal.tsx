import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../../utils/Var";
import { PlayerInfo } from "../../type/type";
import useGetPlayer from "../../hooks/useGetPlayer";
import useContract from "../../hooks/useContract";
import { Box, LinearProgress, Typography, Avatar } from "@mui/material";
import { shortenAddress } from '../../utils/Shorten';
import { ContentCopy } from "@mui/icons-material";
import { useAlert } from "../../contexts/AlertProvider";
import CustomButton from "../buttons/CustomButton";
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
  const [balance, setBalance] = useState<string>("");
  const { fetchPlayer } = useGetPlayer();
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
    const resource = await aptos.getAccountResource<Coin>({
      accountAddress: address,
      resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
    });

    const value = resource.coin.value;
    setBalance(value);
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

  // const handleUpdate = async () => {
  //   if (usernameTaken) {
  //     setAlert("Username is already taken. Please choose another one.", "error");
  //     return;
  //   }
  //   await callContract({
  //     functionName: "update_account",
  //     functionArgs: [editingName, editingUsername, editingImageLink],
  //     onSuccess: (data: any) => {
  //       setAlert("Profile updated successfully!", "success");
  //       setPlayerInfo((prev) => ({
  //         ...prev,
  //         name: editingName,
  //         username: editingUsername,
  //         user_image: editingImageLink,
  //       }));
  //       handleCloseModal();
  //     },
  //     onError: (error: any) => {
  //       console.error("Error updating profile:", error);
  //     },
  //   });
  // };

  const handleCloseModal = () => {
    handleClose();
    setEditing(false);
    setUsernameTaken(false);
    setEditingImageLink("");
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <Box display="flex" alignItems="center" mb={1}>
      <Typography variant="body1" fontWeight="bold" sx={{ mr: 1, fontSize: '1.2rem' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>{value}</Typography>
    </Box>
  );

  // Reusable Component for Stat Boxes
  const StatBox = ({ title, value }: { title: string; value: string }) => (
    <Box textAlign="center" flex={1}>
      <Typography variant="h6" fontWeight="bold">{value}</Typography>
      <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
    </Box>
  );


  return (
    <Modal open={open} onClose={handleCloseModal} sx={{
      backdropFilter: "blur(8px)",

    }}>
      <Box sx={{
        width: '90vw', maxWidth: '580px', margin: 'auto', marginTop: '7%', background: 'linear-gradient(180deg, rgba(68, 97, 108, 0.6) 0%, rgba(42, 72, 74, 0.6) 100%)',
        backdropFilter: "blur(1.5rem)", borderRadius: '8px', boxShadow: 24, padding: 3, position: 'relative', textTransform: 'uppercase'
      }}>
        <Typography variant="h6" fontWeight="bold" mb={2} mt={2} align="center" fontSize="2.3rem" letterSpacing="0.2rem" color="white">
          Player Information
        </Typography>
        {loading && (
          <Box width="100%" mb={2}>
            <LinearProgress />
          </Box>
        )}
        <Box display="flex" alignItems="center" gap={4} margin="10px 0px 10px 35px" >
          <Avatar
            src={playerInfo?.user_image || auth?.picture || ""}
            alt="Profile Picture"
            sx={{ width: 60, height: 60, cursor: editing ? 'pointer' : 'default' }}

          />
          <Box display="flex" flexDirection="column" gap={1} mb={2} mt={2} >
            <Typography variant="body1">email: {auth?.email}</Typography>
            <Typography variant="body1" display="flex" alignItems="center">
              id: {shortenAddress(address, 5)} <ContentCopy style={{ cursor: 'pointer', marginLeft: '5px' }} onClick={() => navigator.clipboard.writeText(address)} />
            </Typography>
            <Typography variant="body1">creator: {playerInfo?.name}</Typography>
            <Typography variant="body1" display="flex" alignItems="center"> $ {parseFloat(balance) / 100000000} </Typography>
          </Box>
        </Box>
        <Typography variant="body1" fontSize="1.3rem" margin="0px 0px 0px 35px">   Win Rate: {winRate}%</Typography>
        <Box display="flex" justifyContent="start" flexDirection="row" gap={2} margin="30px 0px 0px 35px">
          <Box
            width="120px"
            height="50px"
            textAlign="center"
            lineHeight="50px"
            sx={{
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                padding: "2px", // Adjust the thickness of the border here
                background: "linear-gradient(to right, #F3F3F3, #433100)",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                WebkitMaskComposite: "xor",
              },
              backgroundColor: "rgba(21, 45, 49, 0.6)" // 60% opacity

            }}
          >{Number(playerInfo?.games_played) - Number(playerInfo?.winning_games)} losses</Box>
          <Box
            width="110px"
            height="50px"
            textAlign="center"
            lineHeight="50px"

            sx={{
              position: "relative",
              borderRadius: "10px",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                padding: "2px", // Adjust the thickness of the border here
                background: "linear-gradient(to right, #FFDE64, #433100)",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                WebkitMaskComposite: "xor",
              },
              backgroundColor: "#152D31", // Inner content background color
            }}
          >{Number(playerInfo?.winning_games)} wins</Box>

        </Box>
        <Box display="flex" justifyContent="center" margin="35px 35px 25px 35px">
          <CustomButton content="close" isMain={true} onClick={handleCloseModal} disabled={loading} />
        </Box>

        {/* <Box sx={{ overflowY: 'auto', maxHeight: '50vh', mb: 3 }}>
      {editing ? (
        <>
          <TextField
            label="Name"
            variant="outlined"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ fontSize: '1.2rem' }}
          />
          <TextField
            label="Username"
            variant="outlined"
            value={editingUsername}
            onChange={(e) => setEditingUsername(e.target.value)}
            error={usernameTaken}
            helperText={usernameTaken ? "Username is already taken" : ""}
            InputProps={{
              endAdornment: usernameTaken ? <Cancel color="error" /> : <CheckCircle color="action" />,
            }}
            fullWidth
            margin="normal"
            sx={{ fontSize: '1.2rem' }}
          />
          <Typography variant="subtitle1" sx={{ mt: 2, fontSize: '1.2rem', textAlign: 'left' }} >
            Select an avatar
          </Typography>
          <Grid container spacing={2}>
            {existingImages.map((imgUrl, index) => (
              <Grid item xs={4} sm={2} key={index}>
                <Avatar
                  src={imgUrl}
                  sx={{
                    width: 56,
                    height: 56,
                    border: editingImageLink === imgUrl ? "3px solid blue" : "2px solid gray",
                    cursor: "pointer",
                  }}
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
            sx={{ mt: 2, fontSize: '1.2rem' }}
          />
        </>
      ) : (
        <>
          <Box display="flex" flexDirection="column" gap={1} mb={2} mt={2} >
            <InfoRow label="Name:" value={playerInfo?.name} />
            <InfoRow label="Username:" value={`@${playerInfo?.username}`} />
            <InfoRow label="Total Matches:" value={`${playerInfo?.games_played || 0} matches`} />
            <InfoRow label="Win Rate:" value={`${winRate}%`} />
          </Box>
          <Box display="flex" alignItems="center" gap={1} >
            <Star color="primary" />
            <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>{playerInfo?.points} Points</Typography>
          </Box>
        </>
      )}
    </Box> */}
        {/* {!editing && (
    </Box> */}
        {/* {!editing && (
      <>
        <Box display="flex" justifyContent="space-between" gap={2} mb={2}>
          <StatBox title="Wins" value={playerInfo?.winning_games} />
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'gray' }} />
          <StatBox title="Losses" value={(Number(playerInfo?.games_played) - Number(playerInfo?.winning_games)).toString()} />
        </Box>
      </>
    )} */}
        {/* <Box display="flex" justifyContent="flex-end" gap={2}>
          {editing ? (
            <>
              <Button onClick={handleUpdate} variant="contained" color="primary" disabled={loading || usernameTaken}>
                {loading ? "Updating..." : "Update"}
              </Button>
              <Button onClick={() => setEditing(false)} variant="outlined">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)} variant="contained">
              Edit
            </Button>
          )}
        </Box> */}
      </Box>
    </Modal>


  );
};

export default ProfileModal;