import { useEffect, useState } from "react";
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
import { Avatar, Box, CircularProgress, Grid, Modal, Typography } from "@mui/material";

import { MODULE_ADDRESS } from "../../../utils/Var";
import { SendButton } from "../../SendButton/SendButton";
import { useAlert } from "../../../contexts/AlertProvider";
import useContract from "../../../hooks/useContract";
import CustomButton from "../../buttons/CustomButton";
import CustomInput from "../../input/CustomInput";

const CreateAccount = () => {
  const [editingImageLink, setEditingImageLink] = useState<string>("");
  const [editingName, setEditingName] = useState<string>("");
  const [editingUsername, setEditingUsername] = useState<string>("");
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingFetch, setLoadingFetch] = useState<boolean>(true);
  const address = localStorage.getItem("address")
  const { callContract } = useContract();
  const { setAlert } = useAlert();
  const existingImages = [
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
          console.log(address)

          console.log(error)

          // Handle the error as needed
        }
      } else {
        window.location.href = "/auth/login";
      }
    };
    fetchData();
  }, []);

  const handleExistingImageSelect = (imageUrl: string) => {
    setEditingImageLink(imageUrl);
  };

  const handleUpdate = async () => {
    if (usernameTaken) {
      setAlert("Username is already taken. Please choose another one.", "info");
      return;
    }

    if (!(editingName && editingUsername)) {
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
        if (error.status === 404)
          setAlert("You need to faucet your account!", "info");
        else
          setAlert(
            "Username is already taken. Please choose another one.",
            "info",
          );
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

  // const handleLogout = () => {
  //   localStorage.clear();
  //   flow.logout();
  //   window.location.href = "/";
  // };

  return (
    <Modal open={true} >
      <Box sx={{
        width: '100vw', maxWidth: '550px', margin: 'auto', marginTop: '3%', background: 'linear-gradient(180deg, rgba(68, 97, 108, 0.6) 0%, rgba(42, 72, 74, 0.6) 100%)',
        borderRadius: '8px', boxShadow: 24, padding: 3, position: 'relative', textTransform: 'uppercase', border: "2px solid rgba(255, 222, 100, 0.2)"
      }}>
        <Box display="flex" flexDirection="column" gap={2} width="100%" >
          <Typography variant="h6" fontWeight="bold" mb={1} mt={1.5} align="center" fontSize="1.8rem" letterSpacing="0.2rem" color="white">
            Create your account
          </Typography>
          <Box mb={1} width="450px" margin="0 auto">
            <CustomInput
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              placeholder="Name"
              isMain={true} 
              disabled={false} 
            />
          </Box>
          <Box width="450px" margin="0 auto">
            <CustomInput
              value={editingUsername}
              onChange={(e) => setEditingUsername(e.target.value)}
              placeholder="username"
              isMain={true} 
              disabled={false} 
            />
          </Box>

          <Box display="flex" justifyContent="center" flexDirection="column" margin="0 25px 0 30px" gap={1.5}>
            <Typography variant="subtitle1" fontSize="0.7rem" color="white" letterSpacing="0.1rem">
              Select your Avatar
            </Typography>
            <Grid container spacing={2} >
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

            <Typography variant="subtitle1" fontSize="0.7rem" color="white" letterSpacing="0.1rem" mt={1}>
              Or enter image URL
            </Typography>
            <Box display="flex" justifyContent="center" >
              <CustomInput
                value={editingImageLink}
                onChange={(e) => setEditingImageLink(e.target.value)}
                placeholder="Paste url here"
                isMain={true}
                disabled={false}
              /></Box>
          </Box>


          <Box display="flex" justifyContent="center" mt={1} margin="10px 25px 0 30px" >
            <SendButton walletAddress={address || ""} type={Network.TESTNET}>
              Faucet
            </SendButton>
          </Box>
          <Box display="flex" justifyContent="center" margin="10px 25px 25px 30px">
            <CustomButton content={loading ? "Loading..." : "Create"} isMain={true} onClick={handleUpdate} disabled={loading} />
          </Box>

        </Box>
      </Box>
    </Modal>
  );
};

export default CreateAccount;
