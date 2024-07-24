import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import { AttachMoney, People } from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
import { RoomType } from "../type/type";
import { shortenAddress } from "../utils/Shorten";

interface RoomProps {
  roomType: RoomType;
}

const RoomCard: React.FC<RoomProps> = ({ roomType }) => {
  const { auth } = useAuth();

  return (
    <Card sx={{ maxWidth: 450 }}>
      <CardMedia
        sx={{ height: 280, width: 380 }}
        image="./public/stadium/stadium1.jpg"
        title="Stadium"
      />
      <CardContent>
        <h2 className="text-lg font-semibold">Stadium: {roomType.room_name}</h2>
        <Box className="my-2 flex gap-2">
          <Box className="flex gap-1" sx={{ color: "#1976d2" }}>
            <People sx={{ color: "#1976d2" }} />
            <Typography component="span" sx={{ color: "#1976d2" }}>
              {roomType.is_player2_joined?"2":"1"}/2 players
            </Typography>
          </Box>
          <Box className="flex gap-1" sx={{ color: "#1976d2" }}>
            <AttachMoney sx={{ color: "#1976d2" }} />
            <Typography component="span" sx={{ color: "#1976d2" }}>
              {roomType.bet_amount} aptos
            </Typography>
          </Box>
        </Box>
        <Divider variant="middle" />
        <div className="my-3 flex flex-col gap-1">
          <div className="text-sm opacity-85">
            Creator: {shortenAddress(roomType.creator, 5)}
          </div>
          <div>ID: {roomType.room_id}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
