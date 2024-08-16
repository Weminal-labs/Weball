import {
    Box,
    Button,
    Divider,
    LinearProgress,
    Typography,
    Modal,
    TextField,
    Grid,
    Avatar,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import useAuth from "../hooks/useAuth";
  import { ContentCopy, Star, CheckCircle, Cancel } from "@mui/icons-material";
  import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
  import { MODULE_ADDRESS } from "../utils/Var";
  import { shortenAddress } from "../utils/Shorten";
  import { useAptimusFlow } from "aptimus-sdk-test/react";
  import { AptimusNetwork } from "aptimus-sdk-test";
import { PlayerInfo } from "../type/type";
  
  interface ProfileModalProps {
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
  
    const [username, setUsername] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [point, setPoint] = useState<number>(0);
    const [gamesPlayed, setGamesPlayed] = useState<number>(0);
    const [winningGames, setWinningGames] = useState<number>(0);
    const [likesReceived, setLikesReceived] = useState<number>(0);
    const [dislikesReceived, setDislikesReceived] = useState<number>(0);
    const [userImage, setUserImage] = useState<string>("");
    const [winRate, setWinRate] = useState<number>(0);
  
    const [editing, setEditing] = useState<boolean>(false);
    const [editingName, setEditingName] = useState<string>(name);
    const [editingUsername, setEditingUsername] = useState<string>(username);
    const [editingImageLink, setEditingImageLink] = useState<string>("");
    const [usernameTaken, setUsernameTaken] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [player,setPlayer]=useState<PlayerInfo|null>(null)
    const flow = useAptimusFlow();
  
    useEffect(() => {
      if (open) {
        fetchPlayerInfo(address);
      }
    }, [address, open]);
  
    useEffect(() => {
      if (editing) {
        setEditingName(name);
        setEditingUsername(username);
        setEditingImageLink("");
      }
    }, [editing, name, username]);
  
    useEffect(() => {
      const checkUsername = async () => {
        if (editingUsername && editingUsername !== username) {
          const taken = await isUsernameTaken(editingUsername);
          setUsernameTaken(taken as boolean);
        } else {
          setUsernameTaken(false);
        }
      };
  
      checkUsername();
    }, [editingUsername, username]);
  
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
                      // @ts-ignore

          const playerData: PlayerInfo = response[0];
          setPlayer(playerData)
          console.log(playerData)
          // if (
          //   playerData &&
          //   typeof playerData === "object" &&
          //   "data" in playerData &&
          //   Array.isArray(playerData.data)
          // ) {
            // const dataArray = playerData.data;
  
            // const playerInfo: Record<string, unknown> = {};
            // dataArray.forEach((item) => {
            //   if (item && typeof item === "object" && "key" in item && "value" in item)
            //     playerInfo[item.key as string] = item.value;
            //   else console.error("Invalid item format:", item);
            // });
  
            // setUsername((playerInfo.username as string) || "");
            // setName((playerInfo.name as string) || "");
            // setPoint(Number(playerInfo.points) || 0);
            // setGamesPlayed(Number(playerInfo.games_played) || 0);
            // setWinningGames(Number(playerInfo.winning_games) || 0);
            // setLikesReceived(Number(playerInfo.likes_received) || 0);
            // setDislikesReceived(Number(playerInfo.dislikes_received) || 0);
            // setUserImage((playerInfo.user_image as string) || "");
  
            // // Update edit states
            // setEditingName((playerInfo.name as string) || "");
            // setEditingUsername((playerInfo.username as string) || "");
          // } else {
          //   console.error("Unexpected playerData format:", playerData);
          // }
        } else {
          console.error("Unexpected response format or empty array:", response);
        }
      } catch (error) {
        console.error("Failed to fetch player info:", error.status);

        console.error("Failed to fetch player info:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if (gamesPlayed > 0) {
        const ratio = (winningGames / gamesPlayed) * 100;
        setWinRate(parseFloat(ratio.toFixed(2)));
      } else {
        setWinRate(0);
      }
    }, [gamesPlayed, winningGames]);
  
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
      // setUserImage(link);
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
        console.log('name: ', editingName)
        console.log('username:', editingUsername)
        console.log('image:', editingImageLink)

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

        setUserImage(editingImageLink)
  
        if (committedTransaction?.success) {
          alert("Profile updated successfully!");
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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            position: "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 620,
            p: 4,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "450px",
              maxWidth: "80%",
              borderRadius: 10,
              backgroundColor: "lightgray",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 3,
              border: "2px solid primary",
              paddingX: 4,
              paddingY: 5,
              boxShadow: "4px 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Box
              width="70%"
              height="50px"
              bgcolor="#ccc"
              color="white"
              sx={{
                position: "absolute",
                textAlign: "center",
                lineHeight: "50px",
                fontWeight: "bold",
                top: "-25px",
                borderRadius: "5px",
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                zIndex: 100,
              }}
            >
              Player Information
            </Box>
            {loading && (
              <Box width="100%">
                <LinearProgress />
              </Box>
            )}
            <Box display="flex" gap={2} alignItems="center">
              <label htmlFor="image-upload">
                <div
                  id="image-upload"
                  style={{
                    width: "70px",
                    height: "70px",
                    backgroundImage: `url(${userImage || auth?.picture})`,
                    backgroundSize: "cover",
                    border: "3px solid gray",
                    borderRadius: "50%",
                    cursor: editing ? "pointer" : "default",
                    position: "relative",
                  }}
                >
                 
                </div>
              </label>
              <Box
                width={320}
                height={85}
                border="3px solid gray"
                borderRadius="8px"
                fontSize={20}
                padding={1}
              >
                ✉️ {auth?.email}
                <br />
                🪪 {shortenAddress(address, 5)}{" "}
                <ContentCopy
                  style={{ fontSize: "smaller", cursor: "pointer" }}
                  onClick={handleCopy}
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap={1} width="100%">
              {editing ? (
                <>
                  <TextField
                    label="Name"
                    variant="outlined"
                    value={player?.name}
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
                        <Avatar
                          src={imgUrl}
                          sx={{
                            width: 56,
                            height: 56,
                            border:
                              editingImageLink === imgUrl
                                ? "3px solid blue"
                                : "2px solid gray",
                            cursor: "pointer",
                          }}
                          onClick={() => handleExistingImageSelect(imgUrl)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <TextField
                    label="Or enter image URL"
                    variant="outlined"
                    value={editingImageLink}
                    onChange={handleImageLinkChange}
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
                    <Typography variant="h6">{name}</Typography>
                  </Box>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Typography
                      variant="h6"
                      style={{ fontWeight: "bold", marginRight: "8px" }}
                    >
                      Username:
                    </Typography>
                    <Typography variant="h6">@{username}</Typography>
                  </Box>
                </>
              )}
            </Box>
            <Box display="flex" justifyContent="flex-start" width="100%" marginTop="-15px">
              <Typography variant="h6" style={{ fontWeight: "bold", marginRight: "8px" }}>
                Total:
              </Typography>
              <Typography variant="h6">{gamesPlayed} matches</Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start" width="100%" marginTop="-15px">
              <Typography variant="h6" style={{ fontWeight: "bold", marginRight: "8px" }}>
                Win rate:
              </Typography>
              <Typography variant="h6">{winRate}%</Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-evenly"
              color="#808080"
              borderTop={4}
              borderBottom={4}
              borderRight={0}
              borderLeft={0}
              width="100%"
              height={80}
            >
              <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                <Typography>{winningGames}</Typography>
                <Typography>Wins</Typography>
              </Box>
              <Divider
                variant="middle"
                orientation="vertical"
                sx={{ borderColor: "gray", borderWidth: 2, marginY: 2 }}
              />
              <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                <Typography>{gamesPlayed - winningGames}</Typography>
                <Typography>Losses</Typography>
              </Box>
            </Box>
  
            <Box display="flex" gap={3} alignItems="center">
              <Star color="primary" />
              <Typography variant="h6" color="textPrimary">
                {point} Points
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
          </Box>
        </Box>
      </Modal>
    );
  };
  export default ProfileModal;
  