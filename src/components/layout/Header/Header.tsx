import React, { useState, useRef, useEffect } from "react";
import { AttachMoney } from "@mui/icons-material";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
import useAuth from "../../../hooks/useAuth";
import { Menu, MenuItem, Modal, Box, TextField, Button, Avatar, Tooltip, Typography } from "@mui/material";
import { HeaderContainer, LeftHeader, TitleContainer, Logo, Title, RightHeader, WelcomeText, ChatModalBox, MessageList, MessageItem, MessageInfo, MessageText, MessageMeta, MessageUsername } from "./Header.style";
import ProfileModal from "../../ProfileModal/ProfileModal";
import PlayerInfoModal from "./PlayerInfoModal";
import { ClipLoader } from "react-spinners";
import { shortenAddress } from "../../../utils/Shorten";
import { MODULE_ADDRESS } from "../../../utils/Var";
import { PlayerInfo } from "../../../type/type";
import useGetPlayer from "../../../hooks/useGetPlayer";
import useContract from "../../../hooks/useContract";
import { BsSend } from 'react-icons/bs';

interface CoinStoreResource {
  data: {
    coin: {
      value: string;
    };
  };
}

const Header: React.FC = () => {
  const address = localStorage.getItem("address");
  const { auth } = useAuth();
  const flow = useAptimusFlow();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [playerInfoModalOpen, setPlayerInfoModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<{ message: string; sender: string; timestamp: string; username: string }>>([]);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [playerAddress, setPlayerAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("");
  const open = Boolean(anchorEl);

  const { fetchPlayer } = useGetPlayer();
  const { callContract } = useContract();

  const fetchPlayerInfo = async (address: string) => {
    setLoading(true);
    const player = await fetchPlayer(address);
    if (player) setPlayerInfo(player);
    setLoading(false);
  };

  
  const fetchBalance = async (address: string) => {
    setLoading(true);
    const player = await fetchPlayer(address);
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);
    const resource =await aptos.getAccountResource<Coin>({
      accountAddress: address,
      resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
    });
     
    // Now you have access to the response type property
    const value = resource.coin.value;
    setBalance(value)
    setLoading(false);
  };

  useEffect(() => {
    if (address) {
      fetchBalance(address);
    }
  }, [address]);

  useEffect(() => {
    if (chatModalOpen) {
      setLoading(true);
      fetchMessages();
      const intervalId = setInterval(fetchMessages, 1000);
      return () => clearInterval(intervalId);
    }
  }, [chatModalOpen]);

  useEffect(() => {
    if (messageListRef.current) messageListRef.current.scrollTop = messageListRef.current.scrollHeight; 
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::gamev3::get_global_chat_messages`,
        functionArguments: [],
      };

      const data = await aptos.view({ payload });

      const flattenedData = data.flat();
      const formattedMessages = flattenedData.map((msg) => {
        const messageObj = msg as { message: string; sender: string; timestamp: string; username: string };
        return {
          message: messageObj.message,
          sender: messageObj.sender,
          timestamp: messageObj.timestamp,
          username: messageObj.username,
        };
      });
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    flow.logout();
    window.location.reload();
  };

  const handleProfileOpen = () => {
    setProfileModalOpen(true);
    handleClose();
  };

  const handlePlayerInfoOpen = async (playerAddress: string) => {
    await fetchPlayerInfo(playerAddress);
    setPlayerInfoModalOpen(true);
    setPlayerAddress(playerAddress);
  };

  const handlePlayerInfoClose = () => {
    setPlayerInfoModalOpen(false);
    setPlayerInfo(null);
  };

  const sendMessage = async (message: string) => {
    await callContract({
      functionName: "send_global_chat_message",
      functionArgs: [message],
      onSuccess: () => {
        fetchMessages();
      },
    });
  };

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      setLoading(true);
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const newMessage = {
        message,
        sender: address ?? "unknown",
        timestamp,
        username: auth?.name ?? "unknown",
      };
      setMessages([...messages, newMessage]);
      setMessage("");

      await sendMessage(message);
      fetchMessages();
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <HeaderContainer>
      <LeftHeader>
        <TitleContainer>
          <Logo>
            <img
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "50px",
              }}
              src={"/logo.png"}
              alt="logo"
            />
          </Logo>
          <Title>WEBALL</Title>
        </TitleContainer>
      </LeftHeader>
      <RightHeader>
        <Button onClick={() => setChatModalOpen(true)} sx={{ color: "white" }}>Chat</Button>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <AttachMoney color="action" />
          <Typography variant="body2" sx={{ color: 'white' }}>
            {parseFloat(balance) / 100000000} APT
          </Typography>
        </Box>
        <WelcomeText onClick={() => navigator.clipboard.writeText(address ?? "")}>{shortenAddress(address ?? "", 5)}</WelcomeText>
        <Avatar
          component="div"
          src={auth?.picture}
          onClick={handleClick}
          sx={{ cursor: "pointer" }}
        />
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleProfileOpen}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </RightHeader>
      <ProfileModal
        open={profileModalOpen}
        handleOpen={handleProfileOpen}
        handleClose={() => setProfileModalOpen(false)}
      />
            <Modal open={chatModalOpen} onClose={() => setChatModalOpen(false)}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
            }}>
              <h2>Global Chat</h2>
              {loading ? (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}>
                  <ClipLoader color="#00f" loading={loading} size={150} />
                </Box>
              ) : (
                <>
                  <Box sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    {messages.map((msg, index) => (
                      <Box key={index} sx={{
                        display: 'flex',
                        justifyContent: msg.sender === address ? 'flex-end' : 'flex-start',
                        mb: 1,
                      }}>
                        <Box sx={{
                          display: 'flex',
                          flexDirection: msg.sender === address ? 'row-reverse' : 'row',
                          alignItems: 'flex-start',
                        }}>
                          <Avatar src={msg.sender === address ? auth?.picture : ''} sx={{ width: 32, height: 32, mr: msg.sender === address ? 0 : 1, ml: msg.sender === address ? 1 : 0 }} />
                          <Box sx={{
                            bgcolor: msg.sender === address ? 'primary.main' : 'grey.300',
                            color: msg.sender === address ? 'white' : 'black',
                            p: 1,
                            borderRadius: 2,
                            maxWidth: '70%',
                          }}>
                            <Tooltip title={msg.sender}>
                              <Box component="span" sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handlePlayerInfoOpen(msg.sender)}>
                                {msg.username}
                              </Box>
                            </Tooltip>
                            <Box>{msg.message}</Box>
                            <Box sx={{ fontSize: '0.8rem', opacity: 0.7 }}>{new Date(parseInt(msg.timestamp) * 1000).toLocaleString()}</Box>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} sx={{ display: 'flex', position: 'relative' }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Send a message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      sx={{ 
                        pr: 5,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                    <Button 
                      type="submit" 
                      sx={{ 
                        position: 'absolute', 
                        right: 8, 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        minWidth: 'auto',
                        padding: '6px',
                        borderRadius: '50%',
                      }}
                    >
                      <BsSend />
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Modal>
      <PlayerInfoModal
        open={playerInfoModalOpen}
        handleClose={handlePlayerInfoClose}
        playerInfo={playerInfo}
        playerAddress={playerAddress}
      />
    </HeaderContainer>
  );
};

export default Header;