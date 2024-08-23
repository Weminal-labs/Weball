import React, { useEffect, useState } from "react";
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
import { useAptimusFlow, useKeylessLogin } from "aptimus-sdk-test/react";
import { Avatar, Box, Button, CircularProgress, Grid, Modal, TextField, Typography } from "@mui/material";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { ButtonLogout } from "./UpdateAccount.styled";
import { MODULE_ADDRESS } from "../../../utils/Var";
import { SendButton } from "../../SendButton/SendButton";
import { useAlert } from "../../../contexts/AlertProvider";
import useAuth from "../../../hooks/useAuth";
import useContract from "../../../hooks/useContract";

const UpdateAccount = () => {
  const [editingImageLink, setEditingImageLink] = useState<string>("");
  const [editingName, setEditingName] = useState<string>("");
  const [editingUsername, setEditingUsername] = useState<string>("");
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingFetch, setLoadingFetch] = useState<boolean>(true);
  const { auth } = useAuth();
  const flow = useAptimusFlow();
  const { address } = useKeylessLogin();
  const { callContract } = useContract();
  const { setAlert } = useAlert();
  const existingImages = [
    `${auth?.picture}`,
    "https://i.pinimg.com/564x/08/13/41/08134115f47ccd166886b40f36485721.jpg",
    "https://i.pinimg.com/564x/92/ab/3f/92ab3fa97e04a9eedc3a73daa634aa84.jpg",
    "https://i.pinimg.com/564x/1a/cd/42/1acd42b4e937c727350954d0df62177d.jpg",
    "https://i.pinimg.com/564x/0b/2d/d4/0b2dd46969ebcec7433a030e5e19b624.jpg",
    "https://i.pinimg.com/564x/4c/53/a8/4c53a88106cf101590c53ddc421c5c56.jpg",
  ];

  useEffect(() => {
    const checkUsername = async () => {
      if (editingUsername) {
        const taken = await isUsernameTaken(editingUsername);
        setUsernameTaken(taken as boolean);
      } else setUsernameTaken(false);
    };
    checkUsername();
  }, [editingUsername]);

  const isUsernameTaken = async (username: string) => {
    try {
      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::gamev3::is_username_taken`,
        functionArguments: [username],
      };
      const response = await aptos.view({ payload });
      return response[0] as boolean;
    } catch (error) {
      console.error("Failed to check username exists:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (address) {
        try {
          setLoadingFetch(true);
          const aptosConfig = new AptosConfig({ network: Network.TESTNET });
          const aptos = new Aptos(aptosConfig);
          const payload: InputViewFunctionData = {
            function: `${MODULE_ADDRESS}::gamev3::get_player_info`,
            functionArguments: [address],
          };
          await aptos.view({ payload });

          // Handle the response as needed (e.g., set user data)
          window.location.href = "/";
        } catch (error) {
          setLoadingFetch(false);
          // Handle the error as needed
        }
      } else {
        window.location.href = "/auth/login";
      }
    };
    fetchData();
  }, [address]);

  const handleExistingImageSelect = (imageUrl: string) => {
    setEditingImageLink(imageUrl);
  };

  // const handleImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const link = e.target.value;
  //   setEditingImageLink(link);
  // };

  const allFieldsFilled = () => {
    return editingName && editingUsername;
  };

  const handleUpdate = async () => {
    if (usernameTaken) {
      setAlert("Username is already taken. Please choose another one.", "info");
      return;
    }

    if (!allFieldsFilled()) {
      setAlert("All fields must be filled.", "info");
      return;
    }

    setLoading(true);
    await callContract({
      functionName: "update_account",
      functionArgs: [editingName, editingUsername, editingImageLink],
      onSuccess(result) {
        window.location.href = "/";
        setAlert("Create account successfully!", "success");
      },
      onError(error) {
        if (error.status === 404) setAlert("You need to faucet your account!", "info");
        else setAlert("Username is already taken. Please choose another one.", "info");
        console.error("Error calling smart contract:", error);
      },
      onFinally() {
        setLoading(false);
      },
    });
  };

  if (loadingFetch) {
    return <CircularProgress />;
  }

  const handleLogout = () => {
    localStorage.clear();
    flow.logout();
    window.location.href = "/";
  };

  return (
    <Modal open={true} sx={{ backdropFilter: "blur(20px)" }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          position: "relative",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          width: 620,
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Box display="flex" flexDirection="column" gap={2} width="100%">
          <Box
            display="flex"
            flexDirection="row"
            gap={2}
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            textAlign="center"
          >
            <Typography variant="h5" sx={{ color: "Black" }}>
              Create Your Account
            </Typography>
            <ButtonLogout onClick={handleLogout}>Logout</ButtonLogout>
          </Box>

          <TextField
            label="Name"
            variant="outlined"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Username"
            variant="outlined"
            value={editingUsername}
            onChange={(e) => setEditingUsername(e.target.value)}
            error={usernameTaken}
            helperText={usernameTaken ? "Username is already taken" : ""}
            InputProps={{
              endAdornment: usernameTaken ? <Cancel color="error" /> : <CheckCircle color="action" />,
            }}
            fullWidth
          />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Select an Avatar:
          </Typography>
          <Grid container spacing={2}>
            {existingImages.map((imgUrl, index) => (
              <Grid item xs={4} sm={2} key={index}>
                <Avatar
                  src={imgUrl}
                  sx={{
                    width: 56,
                    height: 56,
                    border: editingImageLink === imgUrl ? "3px solid blue" : "2px solid gray",
                    cursor: "pointer",
                  }}
                  onClick={() => handleExistingImageSelect(imgUrl)}
                />
              </Grid>
            ))}
          </Grid>

          {/* <TextField
            label="Or enter image URL"
            variant="outlined"
            value={editingImageLink}
            onChange={handleImageLinkChange}
            fullWidth
            sx={{ mt: 2 }}
          /> */}

          <SendButton walletAddress={address || ""} type={Network.TESTNET}>
            Faucet
          </SendButton>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={loading || !allFieldsFilled()}
          >
            {loading ? "Loading..." : "Create"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateAccount;
