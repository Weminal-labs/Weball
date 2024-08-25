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
import { useAlert } from "../../contexts/AlertProvider";
import CustomButton from "../buttons/CustomButton";

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
        (parseInt(bet) * 1000000).toString(),
        isMateEnabled,
        mate,
      );
    } else {
      setAlert("Fields are not filled", "error");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-room-modal-title"
      aria-describedby="create-room-modal-description"
      sx={{
        backdropFilter: "blur(8px)",

      }}
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
          border: "2px solid white",
          borderRadius: "8px",
           background: 'linear-gradient(180deg, #44616C 0%, #2A484A 100%)',
        backdropFilter: "blur(1.5rem)",          boxShadow: "4px 4px 20px rgba(0, 0, 0.1, 0.2)",
          color:"white"
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

        <h1 id="create-room-modal-title" className="text-[40px]">
          Create a Room
        </h1>
        {/* <Typography
          id="create-room-modal-description"
          variant={isMobile ? "body2" : "body1"}
          align="center"
          gutterBottom
          sx={{ opacity: 0.7 }}
        >
          Create a room for friends to compete in a soccer match. Enjoy the game
          and have fun!
        </Typography> */}

        <Autocomplete
          sx={{ width: "100%", maxWidth: "400px",'& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white', // Default border color
      },
      '&:hover fieldset': {
        borderColor: 'white', // Border color on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white', // Border color when focused
      },
    },
    '& .MuiInputLabel-root': {
      color: 'white', // Label color
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white', // Label color when focused
    },
    '& .MuiOutlinedInput-input': {
      color: 'white', // Input text color
    }, }}
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
            sx={{ textAlign: "left", fontWeight: "bold" }}
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
            sx={{ width: "400px",'& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white', // Default border color
      },
      '&:hover fieldset': {
        borderColor: 'white', // Border color on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white', // Border color when focused
      },
    },
    '& .MuiInputLabel-root': {
      color: 'white', // Label color
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white', // Label color when focused
    },
    '& .MuiOutlinedInput-input': {
      color: 'white', // Input text color
    }, }}
            value={mate}
            onChange={(e) => {
              setMate(e.target.value);
            }}
            disabled={!isMateEnabled}
          />
        </div>
        <div className="w-[75%]">
          <CustomButton
            onClick={allFieldsFilled}
            content="Create"
            disabled={false}
            isMain={true}
          ></CustomButton>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateForm;
