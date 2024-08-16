import { Cancel, CheckCircle } from "@mui/icons-material";
import { Avatar, Box, Button, CircularProgress, Grid, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS } from "../../utils/Var";
import { AptimusNetwork } from "aptimus-sdk-test";
import { useAptimusFlow, useKeylessLogin } from "aptimus-sdk-test/react";

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

  const existingImages = [
    // `${auth?.picture}`,
    "https://i.pinimg.com/564x/08/13/41/08134115f47ccd166886b40f36485721.jpg",
    "https://i.pinimg.com/564x/92/ab/3f/92ab3fa97e04a9eedc3a73daa634aa84.jpg",
    "https://i.pinimg.com/564x/1a/cd/42/1acd42b4e937c727350954d0df62177d.jpg",
    "https://i.pinimg.com/564x/0b/2d/d4/0b2dd46969ebcec7433a030e5e19b624.jpg",
    "https://i.pinimg.com/564x/4c/53/a8/4c53a88106cf101590c53ddc421c5c56.jpg",
  ];

  useEffect(() => {
    const fetchData = async () => {
        console.log(address)
      if (address) {
        try {
            setLoadingFetch(true)
          const aptosConfig = new AptosConfig({ network: Network.TESTNET });
          const aptos = new Aptos(aptosConfig);
          const payload: InputViewFunctionData = {
            function: `${MODULE_ADDRESS}::gamev3::get_player_info`,
            functionArguments: [address],
          };
          const response = await aptos.view({ payload });
          // Handle the response as needed (e.g., set user data)
          window.location.href = "/";
        } catch (error) {
            setLoadingFetch(false)

        //   console.error("Error fetching player info:", error);
        //   window.location.href = "/auth/login";
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

  const handleImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setEditingImageLink(link);
  };

  const handleUpdate = async () => {
    if (usernameTaken) {
      alert("Username is already taken. Please choose another one.");
      return;
    }

    try {
      setLoading(true);
      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);
      const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::update_account`;

      const transaction = await aptos.transaction.build.simple({
        sender: address ?? "",
        data: {
          function: FUNCTION_NAME,
          functionArguments: [editingName, editingUsername, editingImageLink],
        },
      });

      const committedTransaction = await flow.executeTransaction({
        aptos,
        transaction,
        network: AptimusNetwork.TESTNET,
      });

      if (committedTransaction?.success) {
        alert("Profile updated successfully!");
        window.location.href = "/";
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    } finally {
      setLoading(false);
    }
  };
  if(loadingFetch){
    <CircularProgress />

  }
  return (
    <Modal
      open={true}
      sx={{
        backdropFilter: "blur(20px)",
      }}
    >
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
          <Typography variant="h5" sx={{ mb: 2 }}>
            Create Your Account
          </Typography>

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
              endAdornment: usernameTaken ? (
                <Cancel color="error" />
              ) : (
                <CheckCircle color="action" />
              ),
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
                    border:
                      editingImageLink === imgUrl
                        ? "3px solid blue"
                        : "2px solid gray",
                    cursor: "pointer",
                  }}
                  onClick={() => handleExistingImageSelect(imgUrl)}
                />
              </Grid>
            ))}
          </Grid>

          <TextField
            label="Or enter image URL"
            variant="outlined"
            value={editingImageLink}
            onChange={handleImageLinkChange}
            fullWidth
            sx={{ mt: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleUpdate}
            disabled={loading} // Disable button during loading
          >
            {loading ? "Loading..." : "Create"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateAccount;
