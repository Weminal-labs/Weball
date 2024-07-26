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
import { UnityGameComponent } from "../../hooks/useUnityGame";

const ITEMS_PER_PAGE = 6;

const JoinRoom: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [list, setList] = useState<RoomType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleClose = () => setShow(false);

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

  const filteredRooms = list.filter((room) =>
    room.room_id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedRooms = filteredRooms.slice(startIndex, endIndex);

  const getRooms = async () => {
    setIsLoading(true);

    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);
    const payload: InputViewFunctionData = {
      function: `${MODULE_ADDRESS}::gamev3::get_all_rooms`,
    };

    const data = await aptos.view({ payload });
    setIsLoading(false);
    // @ts-ignore
    setList(data[0]);
  };

  return (
    <JoinRoomContainer>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Box sx={{
            width:"100%",
            display:"flex",
            gap:"12px"
          }}
          >
            
            <TextField
              label="Search Room by ID"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              sx={{ width: "40%"}}
            />

            <Button variant="contained" color="primary" onClick={handleReload}>
              Reload
            </Button>
          </Box>

          <GridContainer container spacing={4}>
            {displayedRooms.map((room, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <RoomCard
                  setShow={setShow}
                  roomType={room}
                  setIsLoading={setIsLoading}
                />
              </Grid>
            ))}
          </GridContainer>
          <Stack spacing={4} sx={{marginBottom:"20px"}}>
            <Pagination
              count={Math.ceil(filteredRooms.length / ITEMS_PER_PAGE)}
              page={page}
              onChange={handlePageChange}
            />
          </Stack>
        </>
      )}

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
