import React from 'react';
import { Box, Button, Divider, LinearProgress, Typography, TextField, Grid, Avatar } from "@mui/material";
import { ContentCopy, Star, CheckCircle, Cancel } from "@mui/icons-material";
import { shortenAddress } from "../../utils/Shorten";
import { ProfileModalProps } from "./ProfileModal.tsx";
import { PlayerInfo } from '../../type/type';

import { 
  ModalContainer, 
  ModalContent, 
  Header, 
  ImageUpload, 
  InfoBox, 
  StatBox, 
  StatItem, 
  AvatarImage 
} from './styles.ts';

interface ProfileModalContentProps extends ProfileModalProps {
  auth: any;
  address: string;
  playerInfo: PlayerInfo;
  winRate: number;
  editing: boolean;
  editingName: string;
  editingUsername: string;
  editingImageLink: string;
  usernameTaken: boolean;
  loading: boolean;
  existingImages: string[];
  handleCopy: () => void;
  handleExistingImageSelect: (imageUrl: string) => void;
  handleImageLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdate: () => void;
  handleCloseModal: () => void;
  setEditing: (editing: boolean) => void;
  setEditingName: (name: string) => void;
  setEditingUsername: (username: string) => void;
}

const ProfileModalContent: React.FC<ProfileModalContentProps> = ({
  auth,
  address,
  playerInfo,
  winRate,
  editing,  
  editingName,
  editingUsername,
  editingImageLink,
  usernameTaken,
  loading,
  existingImages,
  handleCopy,
  handleExistingImageSelect,
  handleImageLinkChange,
  handleUpdate,
  handleCloseModal,
  setEditing,
  setEditingName,
  setEditingUsername
}) => {
  return (
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
              imageUrl={playerInfo.user_image || auth?.picture}
              editing={editing}
            />
          </label>
          <InfoBox>
            ✉️ {auth?.email}
            <br />
            🪪 {shortenAddress(address, 5)}{" "}
            <ContentCopy
              style={{ fontSize: "smaller", cursor: "pointer" }}
              onClick={handleCopy}
            />
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
  );
};

export default ProfileModalContent;