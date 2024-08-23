import {
  Autocomplete, Box, Button, FormControlLabel, IconButton, Modal, RadioGroup, TextField, Typography, Theme, useMediaQuery, useTheme,
  Switch,
} from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { useAlert } from '../../contexts/AlertProvider';


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

const CustomButton = styled("div")<CustomButtonProps>(
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

const CreateForm: React.FC<Props> = ({ createRoomContract, open, onClose }) => {
  const [roomName, setRoomName] = useState("");
  const [bet, setBet] = useState("");
  const [mate, setMate] = useState("");
  const [isMateEnabled, setIsMateEnabled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { setAlert } = useAlert();

  const allFieldsFilled = () => {
    if(roomName && bet) {
      createRoomContract(roomName, (parseInt(bet) * 1000000).toString(),isMateEnabled,mate)

    } else {
      setAlert( "Fields are not filled", "error", );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-room-modal-title"
      aria-describedby="create-room-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 2 : 3,
          width: isMobile ? "90%" : "80%",
          maxWidth: isMobile ? "none" : "600px",
          height: "auto",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          border: "2px solid black",
          borderRadius: "8px",
          background: "white",
          boxShadow: "4px 4px 20px rgba(0, 0, 0.1, 0.2)",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1000,
            color: "primary",
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          id="create-room-modal-title"
          variant={isMobile ? "h5" : "h4"}
          align="center"
          gutterBottom
        >
          Create a Room
        </Typography>
        <Typography
          id="create-room-modal-description"
          variant={isMobile ? "body2" : "body1"}
          align="center"
          gutterBottom
          sx={{ opacity: 0.7 }}
        >
          Create a room for friends to compete in a soccer match. Enjoy the game
          and have fun!
        </Typography>

        <Autocomplete
          sx={{ width: "100%", maxWidth: "400px" }}
          options={stadiums}
          value={roomName}
          onChange={(event, newValue) => setRoomName(newValue ?? "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Stadium"
              variant="outlined"
              fullWidth
            />
          )}
        />

        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          <Typography
            variant="h6"
            sx={{ textAlign: "left", color: "black", fontWeight: "bold" }}
          >
            APT
          </Typography>
          <RadioGroup
            aria-label="bet"
            name="bet"
            value={bet}
            onChange={(e) => setBet(e.target.value)}
            row
            sx={{ justifyContent: "space-between" }}
          >
            <CustomFormControlLabel
              value="5"
              label="5"
              selectedValue={bet}
              onChange={setBet}
            />
            <CustomFormControlLabel
              value="10"
              label="10"
              selectedValue={bet}
              onChange={setBet}
            />
            <CustomFormControlLabel
              value="15"
              label="15"
              selectedValue={bet}
              onChange={setBet}
            />
          </RadioGroup>
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
          <TextField
            label="Your mate"
            variant="outlined"
            sx={{ width: "400px" }}
            value={mate}
            onChange={(e)=>{setMate(e.target.value)}}
            disabled={!isMateEnabled}
          />
        </div>
        <Button
          variant="contained"
          onClick={allFieldsFilled}
          sx={{
            width: "75%",
          }}
        >
          Create
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateForm;
