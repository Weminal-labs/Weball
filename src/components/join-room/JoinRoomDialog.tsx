import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { CreateRoomType, RoomType } from "../../type/type";
import { useAptimusFlow, useKeylessLogin } from "aptimus-sdk-test/react";
import useContract from "../../hooks/useContract";

interface Pros {
  open: boolean;
  room: RoomType | null;
  closeModal: () => void;
  openWaitingRoom: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const JoinRoomDialog: React.FC<Pros> = ({
  open,
  room,
  closeModal,
  setIsLoading,
  openWaitingRoom,
}) => {

  const { callContract, loading, error } = useContract();

  const JoinRoomHandle = async () => {
    closeModal();
    setIsLoading(true);
    await callContract({
      functionName:"join_room_by_room_id",
      functionArgs: [Number(room?.room_id)],
      onSuccess(result) {
        setIsLoading(false);
        openWaitingRoom();
      },
      onError(error) {
        console.error("Lỗi khi:", error.status);

        console.error("Lỗi khi gọi hàm smart contract:", error);
      },
      onFinally() {
          
      },
    })
  };
  return (
    <Modal
      open={open}
      aria-labelledby="waiting-room-title"
      aria-describedby="waiting-room-description"
      onClose={closeModal}
    >
      <Box sx={style}>
        <Typography variant="h4" align="center">
          Are You Ready?
        </Typography>
       
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
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  alignItems: "center",
};
export default JoinRoomDialog;
