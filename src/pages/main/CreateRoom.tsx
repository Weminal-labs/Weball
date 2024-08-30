import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useAptimusFlow, useKeylessLogin } from "aptimus-sdk-test/react";
import {
  Aptos,
  AptosConfig,
  InputViewFunctionData,
  Network,
} from "@aptos-labs/ts-sdk";
import { AptimusNetwork } from "aptimus-sdk-test";
import { MODULE_ADDRESS } from "../../utils/Var";
import { CreateRoomType, RoomType } from "../../type/type";
import LoadingScreen from "../../components/layout/LoadingScreen";
import WaitingRoom from "../../components/create-room/WaitingRoom/WaitingRoom";
import AlertComponent from "../../components/layout/AlertComponent";
import CreateForm from "../../components/create-room/CreateForm/CreateForm";
import { useNavigate } from "react-router-dom";
import RoomCard from "../../components/join-room/Room";
import useAuth from "../../hooks/useAuth";
import UnityGameComponent, { useUnityGame } from "../../hooks/useUnityGame";
import { Compare } from "../../utils/CompareAddress";

const CreateRoom: React.FC = () => {
  const [openWaitRoom, setOpenWaitRoom] = useState(false);
  const address = localStorage.getItem("address");
  const flow = useAptimusFlow();
  const { sendMessage, isLoaded, show, setShow } = useUnityGame();
  // const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roomObj, setRoomObj] = useState<CreateRoomType | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [contentAlert, setContentAlert] = useState("");
  const [loadGame, setLoadGame] = useState(false);

  const [isCreator, setIsCreator] = useState(false);
  const { auth } = useAuth();
  useEffect(() => {
    getCurrentRoom();
  }, []);
  useEffect(() => {
    if (show === false) {
      console.log("Finish Game");
      setRoomObj(null);
      setLoadGame(false);
    }
  }, [show]);
  useEffect(() => {
    console.log("loadGame state updated:", loadGame);
  }, [loadGame]);
  const getCurrentRoom = async () => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);
    const payload: InputViewFunctionData = {
      function: `${MODULE_ADDRESS}::gamev3::get_room_now`,
      functionArguments: [address],
    };
    const data = await aptos.view({ payload });
    if (data[0]) {
      // @ts-ignore

      const roomData: RoomType = data[0].vec[0];
      // console.log(roomData.vec[0])

      setRoomObj({
        bet_amount: roomData.bet_amount,
        creator: roomData.creator,
        room_id: roomData.room_id,
        room_name: roomData.room_name,
      });
      // const checkIsCreator = roomData.creator.slice(-5).toLowerCase() === address?.slice(-5).toLowerCase();
      const checkIsCreator = Compare(roomData.creator, address!, 5);
      if (!checkIsCreator) {
        setIsCreator(false);
      } else {
        setIsCreator(true);
      }
      setOpenWaitRoom(true);

      setLoadGame(true);
    }
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const createRoomContract = async (ROOM_NAME: string, bet_amount: string) => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);
    const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::create_room`;
    try {
      setIsLoading(true);
      const transaction = await aptos.transaction.build.simple({
        sender: address ?? "",

        data: {
          function: FUNCTION_NAME,
          functionArguments: [ROOM_NAME, bet_amount],
        },
      });
      const committedTransaction = await flow.executeTransaction({
        aptos,
        transaction,
        network: AptimusNetwork.TESTNET,
      });
      // @ts-ignore
      const createRoomObj: CreateRoomType = committedTransaction.events[1].data;
      setIsLoading(false);

      console.log(createRoomObj);
      setRoomObj(createRoomObj);
      setOpenWaitRoom(true);
      setIsCreator(true);
      setLoadGame(true);
    } catch (error) {
      setIsLoading(false);
      // @ts-ignore
      console.error("Mã Lỗi:", error.status);
      // @ts-ignore
      if (error.status === 429) {
        setContentAlert("Exceed request limit, please wait 5 minutes");
        setOpenAlert(true);
      }
      // @ts-ignore

      if (error.status === 400) {
        flow.logout();
        window.location.reload();

        // setContentAlert("Token expired")
        // setOpenAlert(true)
      }
      // @ts-ignore

      setContentAlert(error.toString());
      setOpenAlert(true);
      console.error("Lỗi khi gọi hàm smart contract:", error);
    }
  };

  const openGame = () => {
    if (isLoaded === false) {
      setContentAlert("Server is loading, please try again");
      setOpenAlert(true);
      return;
    }
    const obj = {
      roomId: roomObj?.room_id,
      roomName: roomObj?.room_name,
      userId: roomObj?.creator,
      userName: auth?.email,
    };
    sendMessage("RoomPlayer", "JoinOrCreateRoom", JSON.stringify(obj));
    setShow(true);
    setOpenWaitRoom(false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        background: "linear-gradient(45deg, #219CE2 30%,#0CBD16 90%)",
      }}
    >
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          {loadGame
            ? null
            : // currentRoom?<RoomCard  /> :
              // <CreateForm createRoomContract={createRoomContract}></CreateForm>
              null}
        </>
      )}
      {roomObj && (
        <WaitingRoom
          room={roomObj}
          open={openWaitRoom}
          closeRoom={() => {
            setLoadGame((prev) => {
              return false;
            });
            setShow(false);
            setOpenWaitRoom(false);
          }}
          openGame={openGame}
          isCreator={isCreator}
        />
      )}
      {loadGame && (
        <Modal
          open={true}
          style={{ display: show ? "block" : "none" }}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <UnityGameComponent />
        </Modal>
      )}
      <AlertComponent
        handleCloseAlert={handleCloseAlert}
        openAlert={openAlert}
        content={contentAlert}
      />
    </Box>
  );
};

export default CreateRoom;
