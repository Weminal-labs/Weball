import React from "react";
import { Modal, Button } from "@mui/material";
import { PlayerInfoModalBox, InfoItem } from "./Header.style";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { PlayerInfo } from "../../../type/type";

interface PlayerInfoModalProps {
    open: boolean;
    handleClose: () => void;
    playerInfo: PlayerInfo | null;
}

const PlayerInfoModal: React.FC<PlayerInfoModalProps> = ({ open, handleClose, playerInfo }) => {
    if (!playerInfo) return null;
    const { username, name, points, games_played, winning_games, likes_received, dislikes_received, user_image } = playerInfo;
    const winRate = (Number(games_played) > 0) ? (Number(winning_games) / Number(games_played)) * 100 : 0;

    return (
        <Modal open={open} onClose={handleClose}>
            <PlayerInfoModalBox>
                <img src={user_image} alt={`${username}'s avatar`} style={{ width: '100px', borderRadius: '50%', marginBottom: '20px' }} />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    style={{ marginBottom: '20px' }}
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
                    <Button startIcon={<ThumbUpIcon />} variant="outlined" color="primary">
                        Like ({likes_received})
                    </Button>
                    <Button startIcon={<ThumbDownIcon />} variant="outlined" color="secondary">
                        Dislike ({dislikes_received})
                    </Button>
                </div>
            </PlayerInfoModalBox>
        </Modal>
    );
};

export default PlayerInfoModal;
