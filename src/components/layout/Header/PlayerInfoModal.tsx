import React from "react";
import { Modal, Button } from "@mui/material";
import { PlayerInfoModalBox, InfoItem } from "./Header.style";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { PlayerInfo } from "../../../type/type";
import useContract from "../../../hooks/useContract";
import { useState, useEffect } from "react";
import { useAlert } from "../../../contexts/AlertProvider";

interface PlayerInfoModalProps {
    open: boolean;
    handleClose: () => void;
    playerInfo: PlayerInfo | null;
    playerAddress: string | null;
}

const PlayerInfoModal: React.FC<PlayerInfoModalProps> = ({ open, handleClose, playerInfo, playerAddress }) => {
    const { setAlert } = useAlert();
    const { callContract } = useContract();
    
    const [likes, setLikes] = useState<number>(0);
    const [dislikes, setDislikes] = useState<number>(0);

    useEffect(() => {
        if (playerInfo) {
            setLikes(Number(playerInfo.likes_received));
            setDislikes(Number(playerInfo.dislikes_received));
        }
    }, [playerInfo]);

    if (!playerInfo) {
        return null; // Or show a loading spinner, or placeholder content
    }

    const { username, name, points, games_played, winning_games, likes_received, dislikes_received, user_image } = playerInfo;
    const winRate = (Number(games_played) > 0) ? (Number(winning_games) / Number(games_played)) * 100 : 0;

    const handleAddFriend = async (username: string) => {
        // await callContract({
        //     functionName: "add_friend_account",
        //     functionArgs: [username],
        // });
    };

    const handleLike = async () => {
        await callContract({
            functionName: "give_like_account",
            functionArgs: [playerAddress],
            onSuccess: (data) => {
                setLikes((prev) => prev + 1);
                setDislikes((prev) => prev - 1);
            },
            onError: (error) => {
                if (error.message.includes("E_CANNOT_LIKE_SELF")) 
                    setAlert("You cannot like yourself", "error");
                else 
                    setAlert("Already liked it", "success");
            },
        });
    };

    const handleDislike = async () => {
        await callContract({
            functionName: "give_dislike_account",
            functionArgs: [playerAddress],
            onSuccess: (data) => {
                setDislikes((prev) => prev + 1);
                setLikes((prev) => prev - 1);
            },
            onError: (error) => {
                if (error.message.includes("E_CANNOT_DISLIKE_SELF")) 
                    setAlert("You cannot dislike yourself", "error");
                else if (error.message.includes("E_ALREADY_DISLIKED"))
                    setAlert("Already disliked it", "error");
            },
        });
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <PlayerInfoModalBox>
                <img src={user_image} alt={`${username}'s avatar`} style={{ width: '100px', borderRadius: '50%', marginBottom: '20px' }} />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    style={{ marginBottom: '20px' }}
                    onClick={() => handleAddFriend(username)}
                >
                    Add friend
                </Button>
                <div style={{ width: '100%', textAlign: 'left' }}>
                    <h2>{name}</h2>
                    <h4>{username}</h4>
                    <InfoItem>
                        <span>Points:</span> <span>{points}</span>
                    </InfoItem>
                    <InfoItem>
                        <span>Games Played:</span> <span>{games_played}</span>
                    </InfoItem>
                    <InfoItem>
                        <span>Winning Games:</span> <span>{winning_games}</span>
                    </InfoItem>
                    <InfoItem>
                        <span>Win Rate:</span> <span>{winRate.toFixed(2)}%</span>
                    </InfoItem>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '10px' }}>
                    <Button startIcon={<ThumbUpIcon />} variant="outlined" color="primary" onClick={handleLike}>
                        Like ({likes})
                    </Button>
                    <Button startIcon={<ThumbDownIcon />} variant="outlined" color="secondary" onClick={handleDislike}>
                        Dislike ({dislikes})
                    </Button>
                </div>
            </PlayerInfoModalBox>
        </Modal>
    );
};

export default PlayerInfoModal;
