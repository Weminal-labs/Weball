import { Autocomplete, Box, Button, FormControlLabel, IconButton, RadioGroup, TextField, Typography, Theme } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { useAptimusFlow, useKeylessLogin } from "aptimus-sdk-test/react";

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
  createRoomContract: (ROOM_NAME: string, BET_AMOUNT: string) => Promise<void>;
}

const CustomButton = styled("div")<CustomButtonProps>(({ theme, selected }) => ({
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
}));

const CustomFormControlLabel: React.FC<CustomFormControlLabelProps> = ({
  value,
  label,
  selectedValue,
  onChange,
}) => (
  <FormControlLabel
    control={
      <CustomButton selected={selectedValue === value} onClick={() => onChange(value)}>
        {label}
      </CustomButton>
    }
    label=""
    style={{ margin: 0 }}
  />
);

const CreateForm: React.FC<Props> = ({ createRoomContract }) => {
  const [roomName, setRoomName] = useState("");
  const [openWaitRoom, setOpenWaitRoom] = useState(false);
  const [bet, setBet] = useState("");
  const { address } = useKeylessLogin();
  const flow = useAptimusFlow();

  return (
    <Box
      sx={{
        position: "relative",
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
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          color: "primary",
        }}
      >
        <CloseIcon />
      </IconButton>

      <div>
        <Typography variant="h4" align="center">
          Create a room
        </Typography>
        <h3 className="text-center opacity-70">
          Create a room for friends to compete in a soccer match. Enjoy the game and have fun!
        </h3>
      </div>

      <Autocomplete
        sx={{ width: "75%" }}
        options={stadiums}
        value={roomName}
        onChange={(event, newValue) => setRoomName(newValue ?? "")}
        renderInput={(params) => (
          <TextField {...params} label="Stadium" variant="outlined" />
        )}
      />

      <div className="w-[75%]">
        <h2
          className="text-left"
          style={{ color: "black", fontSize: "24px", fontWeight: "bold" }}
        >
          APT
        </h2>
        <RadioGroup
          aria-label="bet"
          name="bet"
          value={bet}
          onChange={(e) => setBet(e.target.value)}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
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
      </div>
      <Button
        disabled
        variant="contained"
        sx={{
          width: "75%",
          "&:hover": {
            backgroundColor: "initial",
            cursor: "not-allowed",
          },
        }}
      >
        Password
      </Button>

      <Button
        variant="contained"
        onClick={() => createRoomContract(roomName, bet)}
        sx={{
          width: "75%",
        }}
      >
        Create
      </Button>
    </Box>
  );
};

export default CreateForm;
