import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Modal,
  RadioGroup,
  TextField,
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
    width: "90px",
    height: "40px",
    backgroundColor: selected ? "green" : "grey",
    color: selected ? "white" : "green",
    borderRadius: "4px",
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      backgroundColor: selected ? "blue" : "grey",
    },
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
    style={{ margin: 0 }}
  />
);

const CreateForm: React.FC<Props> = ({ createRoomContract, open, onClose }) => {
  const [roomName, setRoomName] = useState("");
  const [bet, setBet] = useState("");
  const [mate, setMate] = useState("");
  const [isMateEnabled, setIsMateEnabled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { setAlert } = useAlert();

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

      <StyledAutocomplete
        options={stadiums}
        value={roomName}
        onChange={(event, newValue) => setRoomName(newValue ?? "")}
        renderInput={(params) => (
          <StyledTextField {...params} label="Stadium" variant="outlined" fullWidth />
        )}
      />

      <Box sx={{ width: '100%', maxWidth: '400px' }}>
        <Typography
          variant="h6"
          sx={{ textAlign: 'left', fontWeight: 'bold' }}
        >
          APT
        </Typography>
        <StyledRadioGroup
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
      <div className="flex flex-col">
        <FormControlLabel
          control={
            <Switch
              checked={isMateEnabled}
              onChange={(e) => setIsMateEnabled(e.target.checked)}
            />
          }
          label="Mate"
        />
        <StyledTextField
          label="Your mate"
          variant="outlined"
          value={mate}
          onChange={(e) => setMate(e.target.value)}
          disabled={!isMateEnabled}
          sx={{ width: '400px' }}
        />
      </div>
      <div className="w-[75%]">
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
