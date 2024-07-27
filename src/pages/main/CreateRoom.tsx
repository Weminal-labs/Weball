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
  IconButton,
  Theme,
  styled,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { useAptimusFlow, useKeylessLogin } from "aptimus-sdk-test/react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { AptimusNetwork } from "aptimus-sdk-test";
import { UnityGameComponent, useUnityGame } from "../../hooks/useUnityGame";
import { MODULE_ADDRESS } from "../../utils/Var";
import { CreateRoomType } from "../../type/type";
import LoadingScreen from "../../components/layout/LoadingScreen";

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

  interface CustomButtonProps {
    theme?: Theme;
    selected?: boolean;
  }

  interface CustomFormControlLabelProps {
    value: string;
    label: string;
    selectedValue: string;
    onChange: (value: string) => void;
  }

  const CustomButton = styled('div')<CustomButtonProps>(({ theme, selected }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90px',
    height: '40px',
    backgroundColor: selected ? theme.palette.primary.main : theme.palette.grey[300],
    color: selected ? theme.palette.common.white : theme.palette.text.primary,
    borderRadius: '4px',
    cursor: 'pointer',
    userSelect: 'none',
    '&:hover': {
      backgroundColor: selected ? theme.palette.primary.dark : theme.palette.grey[400],
    },
  }));

  const CustomFormControlLabel: React.FC<CustomFormControlLabelProps> = ({ value, label, selectedValue, onChange }) => (
    <FormControlLabel
      control={
        <CustomButton
          selected={selectedValue === value}
          onClick={() => onChange(value)}
        >
          {label}
        </CustomButton>
      }
      label=""
      style={{ margin: 0 }}
    />
  );

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
          <Box
            sx={{
              position: 'relative',
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "40%",
              height: "70%",
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
            <IconButton
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1000,
                color: 'primary',
              }}
            >
              <CloseIcon />
            </IconButton>

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
              sx={{ width: "75%" }}
              options={stadiums}
              value={roomName}
              onChange={(event, newValue) => setRoomName(newValue ?? "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Stadium"
                  variant="outlined"
                />
              )}
            />

            <div className="w-[75%]">
              <h2 className="text-left" style={{ color: "black", fontSize: "24px", fontWeight: 'bold' }}>APT</h2>
              <RadioGroup
                aria-label="bet"
                name="bet"
                value={bet}
                onChange={(e) => setBet(e.target.value)}
                sx={{ width: "100%", display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <CustomFormControlLabel value="5" label="5" selectedValue={bet} onChange={setBet} />
                <CustomFormControlLabel value="10" label="10" selectedValue={bet} onChange={setBet} />
                <CustomFormControlLabel value="15" label="15" selectedValue={bet} onChange={setBet} />
              </RadioGroup>
            </div>
            <Button
              disabled
              variant="contained"
              sx={{
                width: "75%",
                '&:hover': {
                  backgroundColor: "initial",
                  cursor: "not-allowed",
                },
              }}
            >
              Password
            </Button>

            <Button

              variant="contained"
              onClick={createRoomContract}
              sx={{
                width: "75%",
              }}
            >
              Create
            </Button>
          </Box>
          {
            <Modal
              open={true}
              style={{ display: show ? "block" : "none" }}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <UnityGameComponent />
            </Modal>
          }
        </>
      )}
    </Box>
  );
};

export default CreateRoom;
