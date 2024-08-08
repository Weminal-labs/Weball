import { Box, Button, Divider, LinearProgress, Typography, Modal, styled } from "@mui/material";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import {ContentCopy} from '@mui/icons-material';
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../utils/Var";
import { shortenAddress } from "../utils/Shorten";


interface ProfileModalProps {
    open: boolean;
    handleOpen: () => void;
    handleClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, handleOpen, handleClose }) => {
    const address = localStorage.getItem("address");
    const [numOfMatches, setNumOfMatches] = useState<number>(123);
    const [numOfWins, setNumOfWins] = useState<number>(100);
    const [winRatio, setWinRatio] = useState<number>(0);
    const [points, setPoints] = useState<number>(0);
    const { auth } = useAuth();

    useEffect(()=>{
        getProfile()
    },[])

    const getProfile = async () => {
        const aptosConfig = new AptosConfig({ network: Network.TESTNET });
        const aptos = new Aptos(aptosConfig);
        const payload: InputViewFunctionData = {
            function: `${MODULE_ADDRESS}::gamev3::get_player_info`,
            functionArguments: [address],
        };

        const data = await aptos.view({ payload });
        console.log(data);
        setPoints(data[0].vec[2]);
    };


    // Function to calculate win ratio
    useEffect(() => {
        if (numOfMatches > 0) {
            const ratio = (numOfWins / numOfMatches) * 100;
            setWinRatio(ratio);
        }
    }, [numOfWins, numOfMatches]);


    const handleCopy = () => {
        navigator.clipboard.writeText(address??"")
    }

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
                        <div style={{
                            width: '70px',
                            height: '70px',
                            backgroundImage: `url(${auth?.picture})`,
                            backgroundSize: 'cover',
                            border: '3px solid gray',
                            borderRadius: '50%'
                        }}></div>
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
                            🪪 {shortenAddress(address ?? "", 5)}  <ContentCopy style={{ fontSize: 'smaller', cursor: 'pointer' }} onClick={handleCopy} />
                        </Box>
                    </Box>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', fontSize: '20px', paddingLeft: '5px', marginBottom: '-20px' }}>
                        ⚔️ {numOfMatches} matches
                    </div>
                    <div style={{ width: '100%', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ fontSize: '30px' }}>🏆</div>
                        <CustomLinearProgress variant="determinate" value={winRatio} sx={{ width: '100%' }} />
                    </div>

                    <Box display="flex" alignItems="center" justifyContent="space-evenly" color='#808080' borderTop={4} borderBottom={4} borderRight={0} borderLeft={0} width="100%" height={80}>
                        <Box display='flex' alignItems="center" justifyContent="center" flexDirection='column'>
                            <Typography>{numOfWins}</Typography>
                            <Typography>Wins</Typography>
                        </Box>
                        <Divider variant="middle" orientation="vertical" sx={{ borderColor: 'gray', borderWidth: 2, marginY: 2 }} />
                        <Box display='flex' alignItems="center" justifyContent="center" flexDirection='column'>
                            <Typography>{numOfMatches - numOfWins}</Typography>
                            <Typography>Losts</Typography>
                        </Box>
                    </Box>

                    <Box display='flex' gap={3}>
                        <Button variant="contained" sx={{ fontSize: '18px' }}>Update</Button>
                        <Button onClick={handleClose} variant="contained" sx={{ fontSize: '18px' }}>Close</Button>
                    </Box>
                    
                </Box>
            </Box>
        </Modal>
    );
};

export default ProfileModal;
