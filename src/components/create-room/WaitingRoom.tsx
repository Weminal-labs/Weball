import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Slider,
  Stack,
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
import { ChatOutlined, VolumeDown } from "@mui/icons-material";
import "../../App.css";
import { useUnityGame } from "../../hooks/useUnityGame";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import { AptimusNetwork } from "aptimus-sdk-test";
import useGetPlayer from "../../hooks/useGetPlayer";
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
  avatar: string;
  point: string;
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
  const [valueVol, setValueVol] = React.useState<number>(30);
  const [openVol, setOpenVol] = React.useState<boolean>(false);
  const { handleUnload, sendMessage } = useUnityGame();
  const [roomDetail, setRoomDetail] = useState<RoomType|null>(null);
  const { fetchPlayer, loadingFetch } = useGetPlayer();
  const [countDown,setCountDown] = useState<number|null>(null)
  const handleChangeVol = (event: Event, newValue: number | number[]) => {
    setValueVol(newValue as number);
    sendMessage("RoomPlayer", "SoundControl", newValue);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    const fetchInitialPlayerData = async () => {
      if(roomDetail?.creator){
        const p1 = await fetchPlayer(roomDetail?.creator);
        console.log(":a")

        setPlayer1({
          address: roomDetail?.creator??"",
          ready: roomDetail?.creator_ready??false,
          avatar: p1?.user_image ?? "",
          point: p1?.points ?? "",
        });
      }

      if (roomDetail?.is_player2_joined) {
        const p2 = await fetchPlayer(roomDetail.player2.vec[0]);
        console.log(":s")

        setPlayer2({
          address: roomDetail.player2.vec[0] ?? "",
          ready: roomDetail.is_player2_ready,
          avatar: p2?.user_image ?? "",
          point: p2?.points ?? "",
        });

      }
    };
    fetchInitialPlayerData();
  }, [roomDetail?.is_player2_joined,roomDetail?.creator]);

  useEffect(() => {
    console.log(roomDetail?.creator_ready)
    if(roomDetail?.creator_ready){
      setPlayer1((prev: Player | null) =>{
        if(prev){
          ({
            ...prev,
            ready: roomDetail.creator_ready,
          })
        }
        return prev
      } );
    }
    if (roomDetail?.is_player2_joined) {
      setPlayer2((prev: Player | null) =>{
        if(prev){
          ({
            ...prev,
            ready: roomDetail.is_player2_ready,
          })
        }
        return prev
      } );

  

    }
 

  }, [roomDetail?.is_player2_ready,roomDetail?.creator_ready]);
  useEffect(() => {
 
      const intervalId = setInterval(() => {
        getDetailRoom(intervalId);
      }, 1500);
    
      return () => clearInterval(intervalId); // Clear interval khi component unmount
    
  }, []);
  useEffect(()=>{
    if (player1?.ready && player2?.ready) {
      console.log(player1)
      console.log(player2)
      setCountDown(5)
   

    }
  },[player1,player2])
  const getDetailRoom = async (intervalId: NodeJS.Timeout) => {
    try {

      const roomData = await fetchRoomDetail();
      setRoomDetail(roomData)
      console.log(roomData)

      if (roomData.creator_ready && roomData.is_player2_ready) {
        console.log(roomDetail)

        clearInterval(intervalId); // Dừng interval khi cả hai player sẵn sàng
       
       
        
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };
  useEffect(() => {
    if (countDown) {
      console.log(countDown);

      const countDownvalId = setInterval(() => {
        countDownHandle(countDownvalId);
      }, 1000);
      return () => clearInterval(countDownvalId); // Clear interval when component unmounts or countDown changes
    }
  }, [countDown]);
  const fetchRoomDetail = async (): Promise<RoomType> => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);
    const payload: InputViewFunctionData = {
      function: `${MODULE_ADDRESS}::gamev3::room_detail_by_room_id`,
      functionArguments: [Number(room?.room_id ?? 0)],
    };
    const data = await aptos.view({ payload });
    // @ts-ignore
    const roomData: RoomType = data[0];
    setRoomDetail(roomData);
    return roomData;
  };
  const countDownHandle = (intervalId: NodeJS.Timeout) => {
    console.log(countDown);
  
    if (countDown === 1) {
      startGame(); // Khi countdown về 0, bắt đầu game
      clearTimeout(intervalId);
    } else {
      setCountDown((prev: number | null) => {

        if (prev && prev >= -1) {

          return prev - 1; // Giảm giá trị countdown
        }
        return prev;
      });
    }
  };
  
  
  const startGame = () => {
    console.log(player1?.ready +" "+ player2?.ready)
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
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>,
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
  const readyHandle = async (address: string): Promise<void> => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);

    const isReadyUpdated = isCreator
      ? toggleReadyStatus(player1, setPlayer1)
      : toggleReadyStatus(player2, setPlayer2);

    if (!isReadyUpdated) return;

    try {
      if (isReadyUpdated) {
        console.log(address);

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
      const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::leave_room`;
      console.log(room?.room_id);
      const transaction = await aptos.transaction.build.simple({
        sender: address ?? "",
        data: {
          function: FUNCTION_NAME,
          functionArguments: [],
        },
      });
      const committedTransaction = await flow.executeTransaction({
        aptos,
        transaction,
        network: AptimusNetwork.TESTNET,
      });
      handleUnload();
      closeRoom();
      setOpenDialog(false);
      console.log(committedTransaction);
    } catch (error) {
      // @ts-ignore
      console.error("Mã Lỗi:", error.status);
      // @ts-ignore
      setContentAlert(error.toString());
      setOpenAlert(true);
      console.error("Lỗi khi gọi hàm smart contract:", error);
    }
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
            <h2>{countDown}</h2>
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
                  src={player1?.avatar}
                  sx={{ cursor: "pointer", width: "60px", height: "60px" }}
                />
                <h1>{player1?.point} Point</h1>
                <h1>{shortenAddress(player1?.address ?? "", 5)}</h1>
                <h1>{player1?.ready ? "ready" : ""}</h1>
              </Box>
              <Divider
                orientation="vertical"
                variant="fullWidth"
                sx={{ borderColor: "black" }}
                flexItem
              />
              {roomDetail?.is_player2_joined && (
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
                    src={player2?.avatar}
                    sx={{ cursor: "pointer", width: "60px", height: "60px" }}
                  />
                  <h1>{player2?.point} Point</h1>
                  <h1>{shortenAddress(player2?.address ?? "", 5)}</h1>
                  <h1>{player2?.ready ? "ready" : ""}</h1>
                </Box>
              )}
            </Box>
            <Typography sx={{ mt: 4 }}>
              TOTAL: {(Number(room?.bet_amount) / 100000000).toFixed(2)} APT
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", width: "150px" }}>
                <IconButton
                  color="primary"
                  onClick={() => {
                    setOpenChat(!openChat);
                  }}
                >
                  <ChatOutlined />
                </IconButton>
                <div className="flex grow items-center">
                  <IconButton
                    onClick={() => {
                      setOpenVol(!openVol);
                    }}
                  >
                    <VolumeDown color="primary" />
                  </IconButton>
                  {openVol && (
                    <Slider
                      aria-label="Volume"
                      value={valueVol}
                      onChange={handleChangeVol}
                    />
                  )}
                </div>
              </Box>

              <div className="flex gap-1">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={()=>{readyHandle(address!)}}
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
