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
    <Card onClick={handleCLick} sx={{ maxWidth: 400, cursor: "pointer",   color:"white" ,    background: 'linear-gradient(90deg, #173236 0%, rgba(5, 12, 16, 0.3) 100%)'

    }}>
      <CardMedia
        sx={{ height: 160, width: "100%" }}
        image="/stadium/stadium1.jpg"
        title="Stadium"
      />
      <CardContent
        sx={{
          // background: "white",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          opacity:"0.6",
          fontSize:"14px",
          paddingX:"40px"
          // backdropFilter: "blur(1.5rem)",
        }}
      >
        <h2 className="text-base font-semibold">{roomType.room_name}</h2>
        <Box className="my-2 flex gap-2">
          <Box className="flex gap-1" sx={{ }}>
            <People sx={{  }} />
            <Typography component="span" sx={{  }}>
              {roomType.is_player2_joined ? "2" : "1"}/2 players
            </Typography>
          </Box>
          <Box className="flex gap-1" sx={{}}>
            <AttachMoney sx={{ }} />
            <Typography component="span" sx={{  }}>
              {(Number(roomType.bet_amount) / 10000000).toFixed(2)} APT
            </Typography>
          </Box>
        </Box>
        <Divider variant="middle" />
        <div className="my-3 flex flex-col gap-1">
          <div className="opacity-85">
            Creator: {shortenAddress(roomType.creator, 5)}
          </div>
          <div className="flex justify-between">
            <div>ID: {roomType.room_id}</div>
            {roomType.invited_friend_username.vec[0] && (
              <div>Mate: {roomType.invited_friend_username.vec[0]}</div>
            )}{" "}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
