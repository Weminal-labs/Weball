import {
  Box,
  FormControlLabel,
  Typography,
  Theme,
  useMediaQuery,
  useTheme,
  Switch,
} from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { useAlert } from "../../../contexts/AlertProvider";
import CustomButton from "../../buttons/CustomButton";
import { StyledAutocomplete, StyledBox, StyledIconButton, StyledModal, StyledRadioGroup, StyledTextField } from "./CreateForm.style";
import CustomInput from "../../input/CustomInput";
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
import { SendButton } from "../../SendButton/SendButton";

const stadiums = [
  "Old Trafford",
  "Camp Nou",
  "Santiago Bernabéu",
  "Anfield",
  "Allianz Arena",
];

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

interface Props {
  createRoomContract: (
    ROOM_NAME: string,
    bet_amount: string,
    withMate: boolean,
    mateAddress: string,
  ) => Promise<void>;
  open: boolean;
  onClose: () => void;
}

const CustomButtonSelect = styled("div")<CustomButtonProps>(
  ({ theme, selected }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "55px",
    height: "50px",
    backgroundColor: selected ? "grey" : "#152D31",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      backgroundColor: "grey",
    },
    fontFamily: 'revert'
  }),
);

const CustomFormControlLabel: React.FC<CustomFormControlLabelProps> = ({
  value,
  label,
  selectedValue,
  onChange,
}) => (
  <FormControlLabel
    control={
      <CustomButtonSelect
        selected={selectedValue === value}
        onClick={() => onChange(value)}
      >
        {label}
      </CustomButtonSelect>
    }
    label=""
    sx={{ margin: 0 }}
  />
);

const CreateForm: React.FC<Props> = ({ createRoomContract, open, onClose }) => {
  const [roomName, setRoomName] = useState<string>("");
  const [bet, setBet] = useState("");
  const [mate, setMate] = useState("");
  const [isMateEnabled, setIsMateEnabled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { setAlert } = useAlert();
  const address = localStorage.getItem("address")


  const allFieldsFilled = () => {
    if (roomName && bet) {
      createRoomContract(
        roomName,
        (parseInt(bet) * 10000000).toString(),
        isMateEnabled,
        mate,
      );
    } else {
      setAlert("Fields are not filled", "error");
      console.log("Fields are not filled");
    }
  };

  return (
    <StyledModal
      open={open}
      onClose={onClose}
      aria-labelledby="create-room-modal-title"
      aria-describedby="create-room-modal-description"

    >
      <StyledBox isMobile={isMobile}>
        <StyledIconButton onClick={onClose}>
          <CloseIcon />
        </StyledIconButton>

        <h1 id="create-room-modal-title" className="text-[40px]">
          Create a Room
        </h1>
        <Box sx={{ width: '90%', maxWidth: '500px' }}>
          <Typography variant="h6" mb={1} fontSize='0.8rem' letterSpacing='0.1rem'>STAGE</Typography>
          <StyledAutocomplete
            options={stadiums}
            value={roomName}
            //@ts-ignore
            onChange={(event,value) => setRoomName(value)}
            renderInput={(params) => (
              <StyledTextField {...params} label="STADIUM" variant="outlined" fullWidth />
            )}
          />
        </Box>
        <Box sx={{ width: '90%', maxWidth: '500px' }}>
          <Typography variant="h6" mb={1} fontSize='0.8rem' letterSpacing='0.1rem'>BET</Typography>
          <StyledRadioGroup
            sx={{ maxWidth: '40%', display: 'flex', justifyContent: 'space-between', margin: '0 auto' }}
            aria-label="bet"
            name="bet"
            value={bet}
            onChange={(e) => setBet(e.target.value)}
            row
          >
            <CustomFormControlLabel
              value="0.5"
              label="0.5"
              selectedValue={bet}
              onChange={setBet}
            />
            <CustomFormControlLabel
              value="1"
              label="1"
              selectedValue={bet}
              onChange={setBet}
            />
            <CustomFormControlLabel
              value="3"
              label="3"
              selectedValue={bet}
              onChange={setBet}
            />
          </StyledRadioGroup>
        </Box>
        <Box sx={{width: '90%'}}>
          <Box sx={{ width: '100%', maxWidth: '500px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontSize='0.8rem' letterSpacing='0.1rem'>MATE</Typography>
            <Switch
              checked={isMateEnabled}
              onChange={(e) => setIsMateEnabled(e.target.checked)}
              color="primary"
            />
          </Box>
          <Box sx={{ width: '100%', maxWidth: '500px' }}>
            <CustomInput
              value={mate}
              onChange={(e) => setMate(e.target.value)}
              placeholder="YOUR MATE"
              isMain={true}
              disabled={!isMateEnabled}
            />
          </Box></Box>
        <Box display="flex" justifyContent="center" width="90%" mt={1}>
          <SendButton walletAddress={address || ""} type={Network.TESTNET}>
            Faucet
          </SendButton>
        </Box>
        <div className="w-[90%] mb-5">
          <CustomButton
            onClick={allFieldsFilled}
            content="Create"
            disabled={false}
            isMain={true}
          />
        </div>
      </StyledBox>
    </StyledModal>
  );
};

export default CreateForm;
