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
import CustomButton from "../buttons/CustomButton";
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
  const [valueVol, setValueVol] = React.useState<number>(30);
  const [openVol, setOpenVol] = React.useState<boolean>(false);
  const { handleUnload, sendMessage } = useUnityGame();
  const [roomDetail, setRoomDetail] = useState<RoomType | null>(null);
  const { fetchPlayer, loadingFetch } = useGetPlayer();
  const [countDown, setCountDown] = useState<number | null>(null)
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
      if (roomDetail?.creator) {
        const p1 = await fetchPlayer(roomDetail?.creator);

        setPlayer1({
          address: roomDetail?.creator ?? "",
          ready: roomDetail?.creator_ready ?? false,
          avatar: p1?.user_image ?? "",
          point: p1?.points ?? "",
        });
      }
      if (!isCreator && roomDetail?.is_player2_joined === false) {
        console.log("adsdasdsa: " + roomDetail?.is_player2_joined)
        closeRoom()
      }
      if (roomDetail?.is_player2_joined) {
        const p2 = await fetchPlayer(roomDetail.player2.vec[0]);
        console.log(p2)
        setPlayer2({
          address: roomDetail.player2.vec[0] ?? "",
          ready: roomDetail.is_player2_ready,
          avatar: p2?.user_image ?? "",
          point: p2?.points ?? "",
        });

      }
      if (!roomDetail?.is_player2_joined) {
        const intervalId = setInterval(() => {
          getDetailRoom(intervalId);
        }, 1500);

        return () => clearInterval(intervalId);
      }
    };
    fetchInitialPlayerData();
  }, [roomDetail?.is_player2_joined, roomDetail?.creator, roomDetail?.is_player2_ready, roomDetail?.creator_ready]);

  useEffect(() => {
    console.log(roomDetail?.creator_ready)
    if (roomDetail?.creator_ready) {
      setPlayer1((prev: Player | null) => {
        if (prev) {
          ({
            ...prev,
            ready: roomDetail.creator_ready,
          })
        }
        return prev
      });
    }
    if (roomDetail?.is_player2_joined) {
      setPlayer2((prev: Player | null) => {
        if (prev) {
          ({
            ...prev,
            ready: roomDetail.is_player2_ready,
          })
        }
        return prev
      });
    }

  }, [roomDetail?.is_player2_ready, roomDetail?.creator_ready]);
  useEffect(() => {

    const intervalId = setInterval(() => {
      getDetailRoom(intervalId);
    }, 1500);

    return () => clearInterval(intervalId); // Clear interval khi component unmount

  }, []);
  useEffect(() => {
    if (player1?.ready && player2?.ready) {
      console.log(player1)
      console.log(player2)
      setCountDown(5)


    }
  }, [player1, player2])
  const getDetailRoom = async (intervalId: NodeJS.Timeout) => {
    try {
      // console.log("exit")

      const roomData = await fetchRoomDetail();

      if (roomData.creator_ready && roomData.is_player2_ready) {
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
    console.log(player1?.ready + " " + player2?.ready)
    if (player1?.ready && player2?.ready) {
      console.log("start");
      openGame();
    } else {
      setAlert("Player not ready", 'error')
    }
  };
  const toggleReadyStatus = (
    player: Player | null,
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>,
  ): boolean => {
    if (player?.ready) {
      setAlert("You can not cancel ready", 'error')
      return false;
    } else {
      setPlayer((prev) => (prev ? { ...prev, ready: !prev.ready } : null));
      return true;
    }
  };


  const readyHandle = async () => {
    const isReadyUpdated = isCreator
      ? toggleReadyStatus(player1, setPlayer1)
      : toggleReadyStatus(player2, setPlayer2);

    if (!isReadyUpdated) return;
    if (isReadyUpdated) {
      await callContract({
        functionName: "ready_by_room_id",
        functionArgs: [Number(room?.room_id)],
        onSuccess(result) {
          const alertContent = (
            <>
              Ready Transaction:{" "}
              <a
                href={`https://explorer.aptoslabs.com/txn/${result.hash}?network=testnet`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.hash}
              </a>
            </>
          );
          setAlert(alertContent, "success");
        },
        onError(error) {
          console.error("Error executing transaction:", error);
          setAlert("Transaction failed. Please try again.", "error");
        },
      });
    }
  };

  const handleCloseRoom = async () => {
    await callContract({
      functionName: "leave_room",
      functionArgs: [],
      onError(error) {
        // @ts-ignore
        console.error("Mã Lỗi:", error.status);
        // @ts-ignore
        setAlert(error.toString(), "error");
        console.error("Lỗi khi gọi hàm smart contract:", error);
      },
      onSuccess(result) {
        handleUnload();
        closeRoom();
        setOpenDialog(false);
      },
    })

  };
  const handleKickPlayer = async () => {
    await callContract({
      functionName: "kick_player2_in_room_now",
      functionArgs: [],
      onError(error) {
        // @ts-ignore
        console.error("Mã Lỗi:", error.status);
        // @ts-ignore
        setAlert(error.toString(), "error")
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
          backdropFilter: "blur(3px)",
        }}
      >
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "60px",
          gap: "40px",
          position: "absolute",
          width: "680px",
          height: "725px",
          left: "calc(50% - 680px/2 + 0.5px)",
          top: "calc(50% - 725px/2 + 0.5px)",
          background: "linear-gradient(180deg, rgba(68, 97, 108, 0.6) 0%, rgba(42, 72, 74, 0.6) 100%)",
          borderRadius: "12px",
          backdropFilter: "blur(7px)",

        }}>
          <Typography variant="h5" component="h2" sx={{
            width: "560px",
            height: "48px",
            fontFamily: "'Nord', sans-serif",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "40px",
            lineHeight: "48px",
            textAlign: "center",
            color: "#FFFFFF",
            flex: "none",
            order: 0,
            alignSelf: "stretch",
            flexGrow: 0,
          }}>
            STADIUM: {room?.room_name ?? ""}
          </Typography>

          <Box sx={style}>
            {/* <div className={`h-full ${openChat ? "block" : "hidden"}`}>
            <MessengerContainer roomId={room?.room_id ?? ""} />
          </div> */}
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "0px",
              gap: "16px",
              width: "267px",
              height: "99px",
              flex: "none",
              order: 0,
              flexGrow: 0,
            }}>
              <Typography variant="caption" component="p" sx={{
                width: "267px",
                height: "19px",
                fontFamily: "'Nord', sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "19px",
                color: "rgba(255, 255, 255, 0.8)",
                flex: "none",
                order: 0,
                alignSelf: "stretch",
                flexGrow: 0,
              }}>
                Room ID: {room?.room_id ?? ""}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0px",
                  gap: "10px",
                  width: "228px",
                  // height: "19px",
                  flex: "none",
                  order: 1,
                  flexGrow: 0,
                }}
              >
                <Typography sx={{
                  width: "228px",
                  // height: "19px",
                  fontFamily: "'Nord'",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "19px",
                  color: "rgba(255, 255, 255, 0.6)",
                  flex: "none",
                  order: 0,
                  flexGrow: 0,
                }}>Creator: {shortenAddress(player1?.address ?? "", 3)} </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  padding: "0px",
                  gap: "60px",
                  width: "267px",
                  height: "29px",
                  flex: "none",
                  order: 2,
                  alignSelf: "stretch",
                  flexGrow: 0,
                }}
              >
                <Box sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "0px",
                  gap: "8px",
                  width: "116px",
                  height: "24px",
                  flex: "none",
                  order: 0,
                  flexGrow: 0,
                }}>
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.1792 10.8768L11.947 21.3411L6 9.44701L11.947 3.5L13.6248 5.1778C13.9193 5.70514 14.4706 6.69244 14.7182 7.1359C16.2628 9.90236 16.053 9.52649 15.0413 9.90236L11.947 10.9337L7.48673 9.44701L11.947 18.3675L15.8989 10.4637C16.2955 10.6625 16.7259 10.8038 17.1792 10.8768Z" fill="white" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.00004 10.8768L12.2322 21.3411L18.1792 9.44701L12.2322 3.5L10.5544 5.1778C10.2599 5.70514 9.70864 6.69244 9.46103 7.1359C7.91635 9.90236 8.12622 9.52649 9.13792 9.90236L12.2322 10.9337L16.6925 9.44701L12.2322 18.3675L8.28029 10.4637C7.88368 10.6625 7.4533 10.8038 7.00004 10.8768Z" fill="white" />
                    <path d="M6.69029 13.8808L10.4071 21.3146L2.97339 16.8544V13.1375L6.69029 13.8808Z" fill="white" />
                    <path d="M17.0978 13.8808L13.3809 21.3146L20.8147 16.8544V13.1375L17.0978 13.8808Z" fill="white" />
                  </svg>
                  <Typography sx={{
                    // width: "84px",
                    height: "17px",
                    fontFamily: "'Nord', sans-serif",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "17px",
                    color: "rgba(255, 255, 255, 0.6)",
                    flex: "none",
                    order: 1,
                    flexGrow: 0,
                  }}>
                    {player1 && player2 ? "2/2 Player" : "1/2 Player"}
                  </Typography>
                </Box>

                <Box sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  padding: "0px",
                  gap: "8px",
                  width: "90px",
                  height: "24px",
                  flex: "none",
                  order: 1,
                  flexGrow: 0,
                }}>
                  <Typography sx={{
                    width: "14px",
                    // height: "29px",
                    fontFamily: "'Nord'",
                    fontStyle: "normal",
                    fontWeight: 500,
                    fontSize: "24px",
                    // lineHeight: "29px",
                    color: "#FFFFFF",
                    flex: "none",
                    order: 0,
                    flexGrow: 0,
                  }}>
                    <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.696 12.388C12.696 13.764 12.232 14.828 11.304 15.58C10.392 16.332 9.04 16.772 7.248 16.9V19.348H5.256V16.852C3.672 16.692 2.408 16.228 1.464 15.46C0.536 14.676 0.072 13.684 0.072 12.484H2.688C2.688 12.964 2.912 13.364 3.36 13.684C3.824 14.004 4.456 14.228 5.256 14.356V10.804C3.528 10.692 2.272 10.324 1.488 9.7C0.704 9.076 0.312 8.124 0.312 6.844C0.312 5.58 0.728 4.588 1.56 3.868C2.408 3.132 3.64 2.692 5.256 2.548V0.219999H7.248V2.548C8.816 2.676 10.072 3.132 11.016 3.916C11.976 4.7 12.456 5.708 12.456 6.94H9.816C9.816 6.444 9.584 6.028 9.12 5.692C8.656 5.356 8.032 5.14 7.248 5.044V8.332C9.152 8.396 10.536 8.756 11.4 9.412C12.264 10.052 12.696 11.044 12.696 12.388ZM2.976 6.844C2.976 7.26 3.152 7.588 3.504 7.828C3.872 8.052 4.456 8.204 5.256 8.284V5.068C4.52 5.148 3.952 5.34 3.552 5.644C3.168 5.948 2.976 6.348 2.976 6.844ZM7.248 14.38C8.16 14.316 8.856 14.108 9.336 13.756C9.832 13.404 10.08 12.948 10.08 12.388C10.08 11.892 9.856 11.524 9.408 11.284C8.96 11.044 8.24 10.892 7.248 10.828V14.38Z" fill="white" />
                    </svg>

                  </Typography>
                  <Typography sx={{
                    // width: "68px",
                    // height: "17px",
                    fontFamily: "'Nord', sans-serif",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "17px",
                    color: "rgba(255, 255, 255, 0.6)",
                    flex: "none",
                    order: 1,
                    flexGrow: 0,
                  }}>
                    {room?.entry_fee ? room?.entry_fee : "0"} APT
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{
              width: "267px",
              height: "19px",

              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0px",
              gap: "10px",
              flex: "none",
              order: 1,
              flexGrow: 0,
            }}>
              <Typography sx={{
                margin: "0 auto",
                width: "267px",
                height: "19px",
                fontFamily: "'Nord', sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "19px",
                color: "rgba(255, 255, 255, 0.8)",
                flex: "none",
                order: 0,
                flexGrow: 0,
              }}>
                Countdown: {countDown}
              </Typography>
            </Box>
          </Box>

          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "0px",
            gap: "24px",
            width: "560px",
            height: "277px",
            flex: "none",
            order: 2,
            flexGrow: 0,
            margin: "auto 0",
          }}>
            <Typography sx={{
              width: "188px",
              height: "19px",
              fontFamily: "'Nord', sans-serif",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "19px",
              color: "#FFFFFF",
              flex: "none",
              order: 0,
              flexGrow: 0,
            }}>
              Player
            </Typography>

            <Box sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "0px",
              gap: "2px",
              width: "100%",
              height: "234px",
              flex: "none",
              order: 1,
              flexGrow: 0,
            }}
            >
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "0px",
                gap: "24px",
                width: "267px",
                height: "193px",
                flex: "none",
                order: 0,
                flexGrow: 0,
              }}>
                <Avatar component="div" src={player1?.avatar} sx={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#152D31",
                  boxSizing: "border-box",
                  flex: "none",
                  order: 0,
                  flexGrow: 0,
                }} />
                <Box sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "0px",
                  gap: "16px",
                  width: "267px",
                  height: "89px",
                  flex: "none",
                  order: 1,
                  flexGrow: 0,
                }}>
                  <Typography sx={{
                    width: "267px",
                    height: "19px",
                    fontFamily: "'Nord', sans-serif",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "19px",
                    color: "rgba(255, 255, 255, 0.8)",
                    flex: "none",
                    order: 0,
                    alignSelf: "stretch",
                    flexGrow: 0,
                  }}>
                    {player1?.point} Point
                  </Typography>

                  <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0px",
                    gap: "10px",
                    width: "99px",
                    height: "19px",
                    flex: "none",
                    order: 1,
                    flexGrow: 0,
                  }}>
                    <Typography sx={{
                      width: "99px",
                      height: "19px",
                      fontFamily: "'Nord'",
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "19px",
                      color: "rgba(255, 255, 255, 0.6)",
                      flex: "none",
                      order: 0,
                      flexGrow: 0,
                    }}>
                      {shortenAddress(player1?.address ?? "", 3)}
                    </Typography>
                  </Box>

                  <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0px",
                    gap: "10px",
                    width: "58px",
                    height: "19px",
                    flex: "none",
                    order: 2,
                    flexGrow: 0,
                  }}>
                    <Typography sx={{
                      width: "58px",
                      height: "19px",
                      fontFamily: "'Nord'",
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "19px",
                      color: "#FFFFFF",
                      flex: "none",
                      order: 0,
                      flexGrow: 0,
                    }}>
                      {player1?.ready ? "Ready" : ""}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography sx={{
                width: "1px",
                height: "234px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                // transform: "rotate(90deg)",
                flex: "none",
                margin: "0 auto",
                order: 1,
                flexGrow: 0,
              }} />

              <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "0px",
                gap: "24px",
                width: "267px",
                height: "193px",
                flex: "none",
                order: 2,
                flexGrow: 0,
              }}>
                <Avatar component="div" src={player2?.avatar} sx={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#152D31",
                  flex: "none",
                  order: 0,
                  flexGrow: 0,
                  cursor: "pointer",
                }} />
                <Box sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "0px",
                  gap: "16px",
                  width: "267px",
                  height: "89px",
                  flex: "none",
                  order: 1,
                  flexGrow: 0,
                }}>
                  <Typography sx={{
                    width: "267px",
                    height: "19px",
                    fontFamily: "'Nord', sans-serif",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "19px",
                    color: "rgba(255, 255, 255, 0.8)",
                    flex: "none",
                    order: 0,
                    alignSelf: "stretch",
                    flexGrow: 0,
                  }}>
                    {player2?.point} Point
                  </Typography>

                  <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0px",
                    gap: "10px",
                    width: "99px",
                    height: "19px",
                    flex: "none",
                    order: 1,
                    flexGrow: 0,
                  }}>
                    <Typography sx={{
                      width: "99px",
                      height: "19px",
                      fontFamily: "'Nord', sans-serif",
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "19px",
                      color: "rgba(255, 255, 255, 0.6)",
                      flex: "none",
                      order: 0,
                      flexGrow: 0,
                    }}>
                      {shortenAddress(player2?.address ?? "", 3)}
                    </Typography>
                  </Box>

                  <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0px",
                    gap: "10px",
                    width: "58px",
                    height: "19px",
                    flex: "none",
                    order: 2,
                    flexGrow: 0,
                  }}>
                    <Typography sx={{
                      width: "58px",
                      height: "19px",
                      fontFamily: "'Nord', sans-serif",
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "19px",
                      color: "#FFFFFF",
                      flex: "none",
                      order: 0,
                      flexGrow: 0,
                    }}>
                      {player2?.ready ? "Ready" : ""}
                    </Typography>
                  </Box>

                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "0px",
            gap: "24px",
            width: "574px",
            height: "61px",
            flex: "none",
            order: 3,
            alignSelf: "stretch",
            flexGrow: 0,
          }}>
            <Box sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: "16px 24px",
              gap: "10px",
              width: "574px",
              height: "61px",
              // background: "#41646A",
              // border: "2px solid #B7B7B7",
              flex: "none",
              order: 0,
              alignSelf: "stretch",
              flexGrow: 0,
            }}>
              <CustomButton content="Ready" isMain={true} onClick={() => { readyHandle() }} disabled={false}  />
            </Box>
          </Box>
        </Box>
        {/* <Avatar
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
                <h1>{shortenAddress(player2?.address ?? "", 5)} {isCreator && <IconButton onClick={handleKickPlayer}><PersonRemoveAlt1Icon /></IconButton>}  </h1>
                <h1>{player2?.ready ? "ready" : ""}</h1>
              </Box>
            )}
          </Box>
          <Typography sx={{ mt: 4 }}>
            TOTAL: {(Number(room?.bet_amount) / 10000000).toFixed(2)} APT
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
                onClick={() => { readyHandle() }}
              >
                ready
              </Button>
            </div>
          </Box>
          <Box sx={{
            width: "266px",
            height: "112px",
            transform: "matrix(-1, 0, 0, 1, 0, 0)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "0px",
            gap: "40px",
            flex: "none",
            order: 1,
            flexGrow: 0,
          }}>
            <Typography
              sx={{
                position: "absolute",
                width: "267px",
                height: "19px",
                left: "0px",
                top: "0px",
                fontFamily: "'Nord'",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "19px",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              Countdown: {countDown}
            </Typography>
          </Box>
        </Box> */}
      </Modal >
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
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "0px",
  gap: "40px",
  width: "574px",
  height: "99px",
  flex: "none",
  order: 1,
  alignSelf: "stretch",
  flexGrow: 0,
};

export default WaitingRoom;
