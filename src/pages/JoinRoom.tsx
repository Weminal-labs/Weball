import React, { useEffect, useState } from "react";
import styled from "styled-components";
import RoomModal from "../components/RoomModal";
import useModal from "../hooks/useModal";
import {
  Aptos,
  AptosConfig,
  InputViewFunctionData,
  Network,
} from "@aptos-labs/ts-sdk";
import { RoomType } from "../type/type";
import { Box, Grid, Modal, Pagination, Stack } from "@mui/material";
import { MODULE_ADDRESS } from "../utils/Var";
import { UnityGameComponent } from "../hooks/useUnityGame";
import RoomCard from "../components/Room";
import { useUnityGame } from "../hooks/useUnityGame";
import LoadingScreen from "../components/LoadingScreen";

const ITEMS_PER_PAGE = 6;

const JoinRoom: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [list, setList] = useState<RoomType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  useEffect(() => {
    getRooms();
  }, []);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedRooms = list.slice(startIndex, endIndex);

  const getRooms = async () => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);
    console.log(MODULE_ADDRESS);
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
          <GridContainer container spacing={4}>
            {displayedRooms.map((room, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <RoomCard setShow={setShow} roomType={room} setIsLoading={setIsLoading}/>
              </Grid>
            ))}
          </GridContainer>
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(list.length / ITEMS_PER_PAGE)}
              page={page}
              onChange={handlePageChange}
            />
          </Stack>
        </>
      )}

      {
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
      }
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
  background: linear-gradient(45deg, #219CE2 30%,#0CBD16 90%);
`;

export default JoinRoom;
