import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { CreateRoomType, RoomType } from "../../type/type";
import { useAptimusFlow, useKeylessLogin } from "aptimus-sdk-test/react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../../utils/Var";
import { AptimusNetwork } from "aptimus-sdk-test";

interface Pros {
  open: boolean;
  room: RoomType | null;
  closeModal: () => void;
  openWaitingRoom: ()=>void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

}
const JoinRoomDialog: React.FC<Pros> = ({ open, room, closeModal ,setIsLoading,openWaitingRoom}) => {
  const address = localStorage.getItem("address")
    const flow = useAptimusFlow();

    const JoinRoomHandle = async () => {
    
        const aptosConfig = new AptosConfig({ network: Network.TESTNET });
        const aptos = new Aptos(aptosConfig);
        const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::join_room_by_room_id`;
        const ROOM_ID = Number(room?.room_id);
        console.log(ROOM_ID)
        closeModal()
        setIsLoading(true);
        try {
          const transaction = await aptos.transaction.build.simple({
            sender: address ?? "",
            data: {
              function: FUNCTION_NAME,
              functionArguments: [ROOM_ID],
            },
          });
                // @ts-ignore
    
          const committedTransaction = await flow.executeTransaction({
            aptos,
            transaction,
            network: AptimusNetwork.TESTNET,
          });
          //@ts-ignore
          console.log(committedTransaction.events[1].data);
          setIsLoading(false);
          openWaitingRoom()
          // if (isLoaded === false) {
          //   console.log("Máy chủ chưa kết nối");
          //   return;
          // }
          // const obj = {
          //   roomId: roomType.room_id,
          //   roomName: roomType.room_name,
          //   userId: roomType.creator,
          //   userName: "userName",
          // };
          // setIsLoading(false);
          // sendMessage("RoomPlayer", "JoinOrCreateRoom", JSON.stringify(obj));
          // setShow(true);
        } catch (error) {
          console.error("Lỗi khi gọi hàm smart contract:", error);
        }
      };
    return (
    <Modal
      open={open}
      aria-labelledby="waiting-room-title"
      aria-describedby="waiting-room-description"
      onClose={closeModal}
    >
      <Box
        sx={style}
      >
        <Typography variant="h4" align="center">
          Are You Ready?
        </Typography>
        <TextField
          id="outlined-basic"
          label="Code Id"
          variant="outlined"
          sx={{
            width: "80%",
            outline: "120px",
          }}
        />
        <Box
          sx={{
            fontSize: 24,
            fontWeight: "bold",
            border: "2px solid black",
            width: "80%",
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "row",
            borderRadius: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              room id: {room?.room_id}
            </Typography>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              TOTAL: {room?.bet_amount} APT
            </Typography>
          </div>
          <Button
            variant="contained"
            size="large"
            sx={{
              width: "100px",
             
            }}
            onClick={JoinRoomHandle}
          >
            Join
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
    textAlign: "center",
    display:"flex",
    flexDirection:"column",
    gap:"12px",
    alignItems:"center"
  };
export default JoinRoomDialog;
