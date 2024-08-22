import React from "react";
import { Modal, Button } from "@mui/material";
import { PlayerInfoModalBox, InfoItem } from "./Header.style";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { PlayerInfo } from "../../../type/type";
import useContract from "../../../hooks/useContract";
import { useState, useEffect } from "react";

interface PlayerInfoModalProps {
    open: boolean;
    handleClose: () => void;
    playerInfo: PlayerInfo | null;
    playerAddress: string | null;
}

const PlayerInfoModal: React.FC<PlayerInfoModalProps> = ({ open, handleClose, playerInfo, playerAddress }) => {
    if (!playerInfo) return null;
    const { username, name, points, games_played, winning_games, likes_received, dislikes_received, user_image } = playerInfo;
    const winRate = (Number(games_played) > 0) ? (Number(winning_games) / Number(games_played)) * 100 : 0;
    const [likes, setLikes] = useState(Number(likes_received));
    const [dislikes, setDislikes] = useState(Number(dislikes_received));

    const { callContract } = useContract();

    useEffect(() => {
        setLikes(Number(likes_received));
        setDislikes(Number(dislikes_received));
    }, [likes_received, dislikes_received]);

    const handleLike = async () => {
        await callContract({
            functionName: "give_like_account",
            functionArgs: [playerAddress],
            onSuccess: (data) => {
                setLikes((prev) => prev + 1);
                setDislikes((prev) => prev - 1);
            },
            onError: (error) => {
                if(error.message.includes("E_CANNOT_LIKE_SELF")) 
                    alert("You cannot like yourself");
                else 
                    alert("Already liked it");
            },
        })
    }

    const handleDislike = async () => {
        await callContract({
            functionName: "give_dislike_account",
            functionArgs: [playerAddress],
            onSuccess: (data) => {
                setDislikes((prev) => prev + 1);
                setLikes((prev) => prev - 1);
            },
            onError: (error) => {
                if(error.message.includes("E_CANNOT_DISLIKE_SELF")) 
                    alert("You cannot dislike yourself");
                else if(error.message.includes("E_ALREADY_DISLIKED"))
                    alert("Already disliked it");
            },
        })
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <PlayerInfoModalBox>
                <img src={user_image} alt={`${username}'s avatar`} style={{ width: '100px', borderRadius: '50%', marginBottom: '20px' }} />
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