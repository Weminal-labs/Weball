import {
  Box,
  TextField,
  Button,
  Typography,
  Modal,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,

} from "@mui/material";
import { useState } from "react";
import { useAptimusFlow, useKeylessLogin } from "aptimus-sdk-test/react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { AptimusNetwork } from "aptimus-sdk-test";
import { UnityGameComponent, useUnityGame } from "../hooks/useUnityGame";
import { MODULE_ADDRESS } from "../utils/Var";
import { CreateRoomType } from "../type/type";
import LoadingScreen from "../components/LoadingScreen";
const stadiums = [
  "Old Trafford",
  "Camp Nou",
  "Santiago Bernabéu",
  "Anfield",
  "Allianz Arena",
];

const CreateRoom: React.FC = () => {
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const [bet, setBet] = useState("");
  const { address } = useKeylessLogin();
  const flow = useAptimusFlow();
  const handleClose = () => setShow(false);
  const { sendMessage, isLoaded } = useUnityGame();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createRoomContract = async () => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);

    const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::create_room`;
    const ROOM_NAME = roomName;
    const BET_AMOUNT = bet; // Số tiền cược

    try {
      setIsLoading(true);
      const transaction = await aptos.transaction.build.simple({
        sender: address ?? "",
        data: {
          function: FUNCTION_NAME,
          functionArguments: [ROOM_NAME, BET_AMOUNT],
        },
      });
      const committedTransaction = await flow.executeTransaction({
        aptos,
        transaction,
        network: AptimusNetwork.TESTNET,
      });
      // @ts-ignore
      const createRoomObj: CreateRoomType = committedTransaction.events[1].data;
      console.log(createRoomObj);
      if (isLoaded === false) {
        console.log("Máy chủ chưa kết nối");
        return;
      }
      const obj = {
        roomId: createRoomObj.room_id,
        roomName: createRoomObj.room_name,
        userId: createRoomObj.creator,
        userName: userName,
      };
      setIsLoading(false);

      sendMessage("RoomPlayer", "JoinOrCreateRoom", JSON.stringify(obj));
      setShow(true);
    } catch (error) {
      setIsLoading(false);

      console.error("Lỗi khi gọi hàm smart contract:", error);
    }
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
      {isLoading?<LoadingScreen/>:<Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "50%",
          height: "80%",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 3,
          border: "2px solid black",
          paddingX: 4,
          paddingY: 3,
          borderRadius: 5,
          background: "white",
          boxShadow: "4px 4px 20px rgba(0, 0, 0.1, 0.2)",
        }}
      >
        <div>
          <Typography variant="h4" align="center">
            Create a room
          </Typography>
          <h3 className="text-center opacity-70">
            Create a room for friends to compete in a soccer match. Enjoy the
            game and have fun!
          </h3>
        </div>

        <Autocomplete
          sx={{ width: "70%" }}
          options={stadiums}
          value={roomName}
          onChange={(event, newValue) => setRoomName(newValue ?? "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Stadium"
              variant="outlined"
              sx={{ width: "70%" }}
            />
          )}
        />
        <div className="w-[70%]">
          <h2 className="text-left">Bet Amout</h2>

          <RadioGroup
            aria-label="bet"
            name="bet"
            value={bet}
            onChange={(e) => setBet(e.target.value)}
            sx={{ width: "70%" }}
          >
            <FormControlLabel value="5" control={<Radio />} label="5" />
            <FormControlLabel value="10" control={<Radio />} label="10" />
            <FormControlLabel value="15" control={<Radio />} label="15" />
          </RadioGroup>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={createRoomContract}
          sx={{
            width: "70%",
            marginTop: 2,
          }}
        >
          Create
        </Button>
      </Box>
      }
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
    </Box>
  );
};

export default CreateRoom;
