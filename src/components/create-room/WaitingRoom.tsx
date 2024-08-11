import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { CreateRoomType, RoomType } from "../../type/type";
import { shortenAddress } from "../../utils/Shorten";
import {
  Aptos,
  AptosConfig,
  InputViewFunctionData,
  Network,
} from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../../utils/Var";
import AlertComponent from "../layout/AlertComponent";
import LeaveDialog from "./LeaveDialog";
import MessengerContainer from "../chat/MessengerContainer";
import { ChatOutlined, Height } from "@mui/icons-material";
import "../../App.css";
import { useUnityGame } from "../../hooks/useUnityGame";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import { AptimusNetwork } from "aptimus-sdk-test";
interface Pros {
  open: boolean;
  room: CreateRoomType | null;
  closeRoom: () => void;
  openGame: () => void;
  isCreator: boolean;
}
interface Player {
  address: string;
  ready: boolean;
}

const WaitingRoom = ({ open, room, closeRoom, isCreator, openGame }: Pros) => {
  const { auth } = useAuth();
  const address = localStorage.getItem("address");
  const [openDialog, setOpenDialog] = useState(false);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [contentAlert, setContentAlert] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const flow = useAptimusFlow();
  const {
    handleUnload,
  } = useUnityGame();

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const closeModal = () => {
    handleCloseDialog();
    closeRoom();
  };
  useEffect(() => {
    if (!isCreator) {
      setPlayer2({ address: address ?? "", ready: false });
      getDetailRoom();
    } else {
      setPlayer1({ address: address ?? "", ready: true });
    }
    const intervalId = setInterval(getDetailRoom, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const getDetailRoom = async () => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);
    console.log(Number(room?.room_id));
    const payload: InputViewFunctionData = {
      function: `${MODULE_ADDRESS}::gamev3::room_detail_by_room_id`,
      functionArguments: [Number(room?.room_id ?? 0)],
    };
    const data = await aptos.view({ payload });
    // @ts-ignore
    const roomData: RoomType = data[0];

    if (!isCreator) {
      setPlayer1({ address: roomData.creator, ready: roomData.creator_ready });
      // console.log(player1);
    } else {
      // console.log(roomData);
      if (roomData.is_player2_joined) {
        setPlayer2({
          address: roomData.player2.vec[0],
          ready: roomData.is_player2_ready,
        });
      }
    }
  };
  const startGame = () => {
    if (player1?.ready && player2?.ready) {
      console.log("start");
      openGame();
    } else {
      setContentAlert("Player not ready");
      setOpenAlert(true);
    }
  };
  const toggleReadyStatus = (
    player: Player | null,
    setPlayer: React.Dispatch<React.SetStateAction<Player|null>>,
  ): boolean => {
    if (player?.ready) {
      setContentAlert("You can't cancel your ready");
      setOpenAlert(true);
      return false;
    } else {
      setPlayer((prev) => (prev ? { ...prev, ready: !prev.ready } : null));
      return true;
    }
  };
  const readyHandle = async (): Promise<void> => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);

    const isReadyUpdated = isCreator
      ? toggleReadyStatus(player1, setPlayer1)
      : toggleReadyStatus(player2, setPlayer2);

    if (!isReadyUpdated) return;

    try {
      if (isReadyUpdated) {
        console.log(address)

        const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::ready_by_room_id`;

        const transaction = await aptos.transaction.build.simple({
          sender: address ?? "",
          data: {
            function: FUNCTION_NAME,
            functionArguments: [Number(room?.room_id)],
          },
        });
        await flow.executeTransaction({
          aptos,
          transaction,
          network: AptimusNetwork.TESTNET,
        });
      }
    } catch (error) {
      console.error("Error executing transaction:", error);
      setContentAlert("Transaction failed. Please try again.");
      setOpenAlert(true);
    }
  };
  
  const handleCloseRoom = async () => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);

   
    try {
      const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::leave_room_by_room_id`;
      console.log(room?.room_id);
      const transaction = await aptos.transaction.build.simple({
        sender: address ?? "",
        data: {
          function: FUNCTION_NAME,
          functionArguments: [room?.room_id],
        },
      });
      const committedTransaction = await flow.executeTransaction({
        aptos,
        transaction,
        network: AptimusNetwork.TESTNET,
      });
      console.log(committedTransaction)
    } catch (error) {
      console.error("Mã Lỗi:", error.status);
      console.error("Lỗi khi gọi hàm smart contract:", error);
    }
   
    handleUnload();
    closeRoom();
    setOpenDialog(false);
  };
  return (
    <>
      <Modal
        open={open}
        aria-hidden={false}
        onClose={() => {
          setOpenDialog(true);
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={style}>
          <div className={`h-full ${openChat ? "block" : "hidden"}`}>
            <MessengerContainer roomId={room?.room_id ?? ""} />
          </div>
          <div className="w-[400px]">
            <Typography variant="h6" component="h2">
              Staidum: {room?.room_name ?? ""}
            </Typography>
            <Typography variant="caption" component="p">
              Room ID: {room?.room_id ?? ""}
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-around", mt: 4 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Avatar
                  component="div"
                  src={auth?.picture}
                  sx={{ cursor: "pointer", width: "60px", height: "60px" }}
                />
                <h1>10 Point</h1>
                <h1>{shortenAddress(player1?.address ?? "", 5)}</h1>
                <h1>{player1?.ready ? "ready" : ""}</h1>
              </Box>
              <Divider
                orientation="vertical"
                variant="fullWidth"
                sx={{ borderColor: "black" }}
                flexItem
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Avatar
                  component="div"
                  src={auth?.picture}
                  sx={{ cursor: "pointer", width: "60px", height: "60px" }}
                />
                <h1>10 Point</h1>
                <h1>{shortenAddress(player2?.address ?? "", 5)}</h1>
                <h1>{player2?.ready ? "ready" : ""}</h1>
              </Box>
            </Box>
            <Typography sx={{ mt: 4 }}>

              TOTAL: {(Number(room?.bet_amount)/ 100000000).toFixed(2)} APT
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
                gap: 2,
              }}
            >
              <IconButton
                color="primary"
                onClick={() => {
                  setOpenChat(!openChat);
                }}
              >
                <ChatOutlined />
              </IconButton>
              <div className="flex gap-1">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={readyHandle}
                >
                  ready
                </Button>
                <Button variant="contained" color="success" onClick={startGame}>
                  Start
                </Button>
              </div>
            </Box>
          </div>
        </Box>
      </Modal>
      <LeaveDialog
        openDialog={openDialog}
        handleCloseDialog={() => {
          setOpenDialog(false);
        }}
        handleCloseRoom={handleCloseRoom}
      />
      <AlertComponent
        handleCloseAlert={handleCloseAlert}
        openAlert={openAlert}
        content={contentAlert}
      />
    </>
  );
};

const style = {
  position: "absolute",
  display: "flex",

  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%)",
  // width: "40%",
  height: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  textAlign: "center",
};

export default WaitingRoom;
