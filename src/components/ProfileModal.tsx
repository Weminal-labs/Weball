import { Box, Button, Divider, LinearProgress, Typography, Modal, styled, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { ContentCopy, Star, CheckCircle, Cancel } from '@mui/icons-material';
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../utils/Var";
import { shortenAddress } from "../utils/Shorten";
import { useAptimusFlow } from "aptimus-sdk-test/react";
interface ProfileModalProps {
    open: boolean;
    handleOpen: () => void;
    handleClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, handleOpen, handleClose }) => {
    const { auth } = useAuth();
    const address = localStorage.getItem("address") ?? "";

    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [point, setPoint] = useState<number>(0);
    const [gamesPlayed, setGamesPlayed] = useState<number>(0);
    const [winningGames, setWinningGames] = useState<number>(0);
    const [likesReceived, setLikesReceived] = useState<number>(0);
    const [dislikesReceived, setDislikesReceived] = useState<number>(0);
    const [userImage, setUserImage] = useState<string>('');
    const [winRate, setWinRate] = useState<number>(0);

    const [editing, setEditing] = useState<boolean>(false);
    const [editingName, setEditingName] = useState<string>(name);
    const [editingUsername, setEditingUsername] = useState<string>(username);
    const [file, setFile] = useState<File | null>(null);
    const [usernameTaken, setUsernameTaken] = useState(false);
    const flow = useAptimusFlow();

    useEffect(() => {

    }, [name, username, userImage])

    useEffect(() => {
        fetchPlayerInfo(address);
    }, [address]);

    useEffect(() => {
        const checkUsername = async () => {
            if (editingUsername) {
                const taken = await isUsernameTaken(editingUsername, username);
                setUsernameTaken(taken as boolean);
            } else {
                setUsernameTaken(false);
            }
        };

        checkUsername();
    }, [editingUsername]);

    const fetchPlayerInfo = async (address: string) => {
        try {
            const aptosConfig = new AptosConfig({ network: Network.TESTNET });
            const aptos = new Aptos(aptosConfig);

            const hexAddress = address.startsWith('0x') ? address : `0x${address}`;
         
             
            const fund = await aptos.getAccountAPTAmount({ accountAddress: address??""});
            console.log(fund/100000000)
        
            const payload: InputViewFunctionData = {
                function: `${MODULE_ADDRESS}::gamev3::get_player_info`,
                functionArguments: [hexAddress],
            };

            const response = await aptos.view({ payload });

            console.log("API Response:", response);

            if (response && Array.isArray(response) && response.length > 0) {
                const playerData = response[0];
                if (playerData && typeof playerData === 'object' && 'data' in playerData && Array.isArray(playerData.data)) {
                    const dataArray = playerData.data;
                    console.log("Data Array:", dataArray);

                    const playerInfo: Record<string, unknown> = {};
                    dataArray.forEach(item => {
                        if (item && typeof item === 'object' && 'key' in item && 'value' in item)
                            playerInfo[item.key as string] = item.value;
                        else
                            console.error("Invalid item format:", item);
                    });

                    setUsername(playerInfo.username as string || '');
                    setName(playerInfo.name as string || '');
                    setPoint(Number(playerInfo.points) || 0);
                    setGamesPlayed(Number(playerInfo.games_played) || 0);
                    setWinningGames(Number(playerInfo.winning_games) || 0);
                    setLikesReceived(Number(playerInfo.likes_received) || 0);
                    setDislikesReceived(Number(playerInfo.dislikes_received) || 0);
                    setUserImage(playerInfo.user_image as string || '');

                    // Update edit states
                    setEditingName(playerInfo.name as string || '');
                    setEditingUsername(playerInfo.username as string || '');
                } else {
                    console.error("Unexpected playerData format:", playerData);
                }
            } else {
                console.error("Unexpected response format or empty array:", response);
            }

        } catch (error) {
            console.error("Failed to fetch player info:", error);
        }
    };

    // const handleUpdate = async () => {
    //     const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    //     const aptos = new Aptos(aptosConfig);
    //     const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::update_account `;
    //     const transaction = await aptos.transaction.build.simple({
    //         sender: address ?? "",
    //         data: {
    //         function: FUNCTION_NAME,
    //         functionArguments: [name, username, userImage], 
    //         },
    //     });  
    //     const committedTransaction = await flow.executeTransaction({
    //         aptos,
    //         transaction,
    //         network: Network.TESTNET,
    //         });
    //     };
    // };

    useEffect(() => {
        if (gamesPlayed > 0) {
            const ratio = (winningGames / gamesPlayed) * 100;
            setWinRate(ratio);
        }
    }, [gamesPlayed, winningGames]);

    const isUsernameTaken = async (username: string, currentUsername: string) => {
        try {
            const aptosConfig = new AptosConfig({ network: Network.TESTNET });
            const aptos = new Aptos(aptosConfig);
            const payload: InputViewFunctionData = {
                function: `${MODULE_ADDRESS}::gamev3::is_username_taken`,
                functionArguments: [username],
            };
            const response = await aptos.view({ payload });

            if (username === currentUsername) {
                return false; // username is the same as current user's username, so it's not taken
            } else {
                return response[0] as boolean;
            }
        } catch (error) {
            console.error("Failed to check username exists:", error);
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 15,
        borderRadius: 5,
        '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            backgroundColor: '#1a90ff',
        },
        '&.MuiLinearProgress-colorPrimary': {
            backgroundColor: theme.palette.grey[300],
        },
    }));

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="profile-modal-title"
            aria-describedby="profile-modal-description"
        >
            <Box display="flex" alignItems="center" justifyContent="center"
                sx={{
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 620,
                    p: 4,
                }}
            >
                <Box sx={{
                    position: 'absolute',
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
                }}>
                    <Box width="70%" height='50px' bgcolor='#ccc' color="white" sx={{
                        position: "absolute",
                        textAlign: 'center',
                        lineHeight: '50px',
                        fontWeight: 'bold',
                        top: '-25px',
                        borderRadius: '5px',
                        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
                        zIndex: 100,
                    }}>
                        Player Information
                    </Box>
                    <Box display="flex" gap={2} alignItems="center">
                        <label htmlFor="image-upload">
                            <div
                                id="image-upload"
                                style={{
                                    width: '70px',
                                    height: '70px',
                                    backgroundImage: `url(${userImage || auth?.picture})`,
                                    backgroundSize: 'cover',
                                    border: '3px solid gray',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    position: 'relative',
                                }}
                                onMouseEnter={() => document.getElementById('image-upload')!.style.opacity = '0.7'}
                                onMouseLeave={() => document.getElementById('image-upload')!.style.opacity = '1'}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}

                                />
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
                            ✉️  {auth?.email}
                            <br />
                            🪪 {shortenAddress(address, 5)}  <ContentCopy style={{ fontSize: 'smaller', cursor: 'pointer' }} onClick={handleCopy}
                            />
                        </Box>
                    </Box>
                    <Box display='flex' flexDirection='column' gap={1} width='100%'>
                        {editing ? (
                            <>
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                />
                                <TextField
                                    label="Username"
                                    variant="outlined"
                                    value={editingUsername}
                                    onChange={(e) => setEditingUsername(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            usernameTaken ? (
                                                <Cancel color="error" />
                                            ) : (
                                                <CheckCircle color="action" />
                                            )
                                        ),
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <Box display="flex" flexDirection="row" alignItems="center">
                                    <Typography variant="h6" style={{ fontWeight: 'bold', marginRight: '8px' }}>
                                        Name:
                                    </Typography>
                                    <Typography variant="h6">
                                        {name}
                                    </Typography>
                                </Box>
                                <Box display="flex" flexDirection="row" alignItems="center">
                                    <Typography variant="h6" style={{ fontWeight: 'bold', marginRight: '8px' }}>
                                        Username:
                                    </Typography>
                                    <Typography variant="h6">
                                        @{username}
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Box>
                    <Box display="flex" justifyContent="flex-start" width="100%" marginTop='-15px' >
                        <Typography variant="h6" style={{ fontWeight: 'bold', marginRight: '8px' }}>
                            Total:
                        </Typography>
                        <Typography variant="h6">
                            {gamesPlayed} matches
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="flex-start" width="100%"marginTop='-15px' >
                        <Typography variant="h6" style={{ fontWeight: 'bold', marginRight: '8px' }}>
                            Win rate:
                        </Typography>
                        <Typography variant="h6">
                            {winRate}%
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="space-evenly" color='#808080' borderTop={4} borderBottom={4} borderRight={0} borderLeft={0} width="100%" height={80}>
                        <Box display='flex' alignItems="center" justifyContent="center" flexDirection='column'>
                            <Typography>{winningGames}</Typography>
                            <Typography>Wins</Typography>
                        </Box>
                        <Divider variant="middle" orientation="vertical" sx={{ borderColor: 'gray', borderWidth: 2, marginY: 2 }} />
                        <Box display='flex' alignItems="center" justifyContent="center" flexDirection='column'>
                            <Typography>{gamesPlayed - winningGames}</Typography>
                            <Typography>Losses</Typography>
                        </Box>
                    </Box>

                    <Box display='flex' gap={3} alignItems="center">
                        <Star color="primary" />
                        <Typography variant="h6" color="textPrimary">{point} Points</Typography>
                    </Box>



                    <Box display='flex' gap={3}>
                        {editing ? (
                            <Button onClick={handleUpdate} variant="contained" sx={{ fontSize: '18px' }}>Update</Button>
                        ) : (
                            <Button onClick={() => setEditing(true)} variant="contained" sx={{ fontSize: '18px' }}>Edit</Button>
                        )}
                        <Button onClick={() => { handleClose(), setEditing(false) }} variant="contained" sx={{ fontSize: '18px' }}>Close</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

export default ProfileModal;