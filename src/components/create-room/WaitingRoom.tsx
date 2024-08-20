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
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';

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
import useContract from "../../hooks/useContract";
import { useAlert } from "../../contexts/AlertProvider";
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
  const { setAlert } = useAlert();
  const [openDialog, setOpenDialog] = useState(false);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [player1, setPlayer1] = useState<Player | null>(null);
  // const [openAlert, setOpenAlert] = useState(false);
  // const [contentAlert, setContentAlert] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const flow = useAptimusFlow();
  const [valueVol, setValueVol] = React.useState<number>(30);
  const [openVol, setOpenVol] = React.useState<boolean>(false);
  const { handleUnload, sendMessage } = useUnityGame();
  const [roomDetail, setRoomDetail] = useState<RoomType|null>(null);
  const { fetchPlayer, loadingFetch } = useGetPlayer();
  const [countDown,setCountDown] = useState<number|null>(null)
  const { callContract, loading, error } = useContract();

  const handleChangeVol = (event: Event, newValue: number | number[]) => {
    setValueVol(newValue as number);
    sendMessage("RoomPlayer", "SoundControl", newValue);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  // const handleCloseAlert = () => {
  //   setOpenAlert(false);
  // };

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
      if(!isCreator && roomDetail?.is_player2_joined===false){
        console.log("adsdasdsa: "+roomDetail?.is_player2_joined)
        closeRoom()
      }
      if (roomDetail?.is_player2_joined) {
        const p2 = await fetchPlayer(roomDetail.player2.vec[0]);

        setPlayer2({
          address: roomDetail.player2.vec[0] ?? "",
          ready: roomDetail.is_player2_ready,
          avatar: p2?.user_image ?? "",
          point: p2?.points ?? "",
        });

      }
      if(!roomDetail?.is_player2_joined){
        const intervalId = setInterval(() => {
          getDetailRoom(intervalId);
        }, 1500);
      
        return () => clearInterval(intervalId); 
      }
    };
    fetchInitialPlayerData();
  }, [roomDetail?.is_player2_joined,roomDetail?.creator,roomDetail?.is_player2_ready,roomDetail?.creator_ready]);

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
      // setRoomDetail(roomData)

      if (roomData.creator_ready && roomData.is_player2_ready) {
        console.log("exit")
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
      setAlert("Player not ready",'error')
    }
  };
  const toggleReadyStatus = (
    player: Player | null,
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>,
  ): boolean => {
    if (player?.ready) {
      setAlert("Player not ready",'error')
      return false;
    } else {
      setPlayer((prev) => (prev ? { ...prev, ready: !prev.ready } : null));
      return true;
    }
  };
  const readyHandle = async (): Promise<void> => {
    

    const isReadyUpdated = isCreator
      ? toggleReadyStatus(player1, setPlayer1)
      : toggleReadyStatus(player2, setPlayer2);

    if (!isReadyUpdated) return;
    if (isReadyUpdated) {
      await callContract({
        functionName: "ready_by_room_id",
        functionArgs:[Number(room?.room_id)],
        onSuccess(result) {
       
        },
        onError(error) {
          console.error("Error executing transaction:", error);
          setAlert("Transaction failed. Please try again.","error");
        },
      })
    }
    
  };

  const handleCloseRoom = async () => {
    await callContract({
      functionName: "leave_room",
      functionArgs:[],
      onError(error) {
             // @ts-ignore
      console.error("Mã Lỗi:", error.status);
      // @ts-ignore
      setAlert(error);
      console.error("Lỗi khi gọi hàm smart contract:", error);
      },
      onSuccess(result) {
        handleUnload();
        closeRoom();
        setOpenDialog(false);
      },
    })
    
  };
  const handleKickPlayer= async()=>{
    await callContract({
      functionName: "kick_player2_in_room_now",
      functionArgs:[],
      onError(error) {
      // @ts-ignore
      console.error("Mã Lỗi:", error.status);
      // @ts-ignore
     
      console.error("Lỗi khi gọi hàm smart contract:", error);
      },
      onSuccess(result) {
        fetchRoomDetail()

      },
    })

  }
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
                  <h1>{shortenAddress(player2?.address ?? "", 5)} {isCreator&&<IconButton onClick={handleKickPlayer}><PersonRemoveAlt1Icon/></IconButton>}  </h1>
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
                  onClick={()=>{readyHandle()}}
                >
                  ready
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
    </>
  );
};

const style = {
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
  height: "55%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  textAlign: "center",
};

export default WaitingRoom;
