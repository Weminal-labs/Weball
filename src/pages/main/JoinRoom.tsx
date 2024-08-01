import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  Aptos,
  AptosConfig,
  InputViewFunctionData,
  Network,
} from "@aptos-labs/ts-sdk";
import {
  Box,
  Button,
  Grid,
  Modal,
  Pagination,
  Stack,
  TextField,
} from "@mui/material";
import { RoomType } from "../../type/type";
import { MODULE_ADDRESS } from "../../utils/Var";
import LoadingScreen from "../../components/layout/LoadingScreen";
import RoomCard from "../../components/join-room/Room";
import UnityGameComponent, { useUnityGame } from "../../hooks/useUnityGame";
import JoinRoomDialog from "../../components/join-room/JoinRoomDialog";
import WaitingRoom from "../../components/create-room/WaitingRoom";
import useAuth from "../../hooks/useAuth";
import { useKeylessLogin } from "aptimus-sdk-test/react";
import useGetRoom from "../../hooks/useGetRoom";

const ITEMS_PER_PAGE = 6;

const JoinRoom: React.FC = () => {

  const [page, setPage] = useState<number>(1);
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roomObj, setRoomObj] = useState<RoomType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openWaitRoom, setOpenWaitRoom] = useState(false);
  const { sendMessage, isLoaded } = useUnityGame();
  const address = localStorage.getItem("address")
  const handleClose = () => setShow(false);
  const [loadGame, setLoadGame] = useState(false);
  const {getRooms,isLoading,rooms,setIsLoading}=useGetRoom()
  useEffect(() => {
    getRooms();
  }, []);
  const handleReload = () => {
    getRooms();
  };
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page on search
  };

  const filteredRooms = rooms.filter((room) =>
    room.room_id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedRooms = filteredRooms.slice(startIndex, endIndex);

  // const handleOpenWaitRoom = () => {
  //   setOpenWaitRoom(true);
  //   setOpenDialog(false);
  // };
  const openGame = () => {
    const obj = {
      roomId: roomObj?.room_id,
      roomName: roomObj?.room_name,
      userId: address,
      userName: "userName",
    };
    sendMessage("RoomPlayer", "JoinOrCreateRoom", JSON.stringify(obj));

    setShow(true);
    setOpenWaitRoom(false);
  };
  return (
    <JoinRoomContainer>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: "12px",
            }}
          >
            <TextField
              label="Search Room by ID"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              sx={{ width: "40%" }}
            />

            <Button variant="contained" color="primary" onClick={handleReload}>
              Reload
            </Button>
          </Box>

          <GridContainer container spacing={4}>
            {displayedRooms.map((room, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <RoomCard
                  setRoomObj={setRoomObj}
                  openDialog={() => {
                    setOpenDialog(true);
                  }}
                  roomType={room}
                />
              </Grid>
            ))}
          </GridContainer>
          <Stack spacing={4} sx={{ marginBottom: "20px" }}>
            <Pagination
              count={Math.ceil(filteredRooms.length / ITEMS_PER_PAGE)}
              page={page}
              onChange={handlePageChange}
            />
          </Stack>
        </>
      )}
      {loadGame && (
        <Modal
          open={true}
          style={{ display: show ? "block" : "none" }}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <>
            <UnityGameComponent />
          </>
        </Modal>
      )}

      <JoinRoomDialog
        openWaitingRoom={() => {
          setLoadGame(true);
          setOpenWaitRoom(true);
        }}
        open={openDialog}
        closeModal={() => {
          setOpenDialog(false);
        }}
        room={roomObj}
        setIsLoading={setIsLoading}
      />
      {roomObj && (
        <WaitingRoom
          openGame={openGame}
          room={roomObj}
          open={openWaitRoom}
          closeRoom={() => {
            setOpenWaitRoom(false);
          }}
          isCreator={false}
          // handleClose={()=>{setOpenWaitRoom(false)}}
        />
      )}
    </JoinRoomContainer>
  );
};

const GridContainer = styled(Grid)`
  width: 100%;
  display: flex;
  justify-content: left;
`;

const JoinRoomContainer = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  flex-wrap: wrap;
  gap: 25px;
  padding: 50px;
  background: linear-gradient(45deg, #219ce2 30%, #0cbd16 90%);
`;

export default JoinRoom;
