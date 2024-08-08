import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import { AttachMoney, People } from "@mui/icons-material";
import { RoomType } from "../../type/type";
import { shortenAddress } from "../../utils/Shorten";
import { MODULE_ADDRESS } from "../../utils/Var";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useAptimusFlow, useKeylessLogin } from "aptimus-sdk-test/react";
import { AptimusNetwork } from "aptimus-sdk-test";
import { useUnityGame } from "../../hooks/useUnityGame";
import { useEffect } from "react";

interface RoomProps {
  roomType: RoomType;
  openDialog: () => void;

  setRoomObj: React.Dispatch<React.SetStateAction<RoomType | null>>;
}

const RoomCard: React.FC<RoomProps> = ({
  roomType,
  openDialog,
  setRoomObj,
}) => {

  const handleCLick = () => {
    setRoomObj(roomType);
    openDialog();
  };

  return (
    <Card onClick={handleCLick} sx={{ maxWidth: 450, cursor: "pointer" }}>
      <CardMedia
        sx={{ height: 280, width: "100%" }}
        image="/stadium/stadium1.jpg"
        title="Stadium"
      />
      <CardContent>
        <h2 className="text-lg font-semibold">Stadium: {roomType.room_name}</h2>
        <Box className="my-2 flex gap-2">
          <Box className="flex gap-1" sx={{ color: "#1976d2" }}>
            <People sx={{ color: "#1976d2" }} />
            <Typography component="span" sx={{ color: "#1976d2" }}>
              {roomType.is_player2_joined ? "2" : "1"}/2 players
            </Typography>
          </Box>
          <Box className="flex gap-1" sx={{ color: "#1976d2" }}>
            <AttachMoney sx={{ color: "#1976d2" }} />
            <Typography component="span" sx={{ color: "#1976d2" }}>
            {(Number(roomType.bet_amount) / 100000000).toFixed(2)} APT
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
