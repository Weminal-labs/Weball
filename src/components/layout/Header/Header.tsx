import React, { useState, useRef, useEffect } from "react";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import useAuth from "../../../hooks/useAuth";
import { Menu, MenuItem, Modal, Box, TextField, Button, Avatar, Tooltip } from "@mui/material";
import { shortenAddress } from "../../../utils/Shorten";
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
import ProfileModal from "../../ProfileModal/ProfileModal";
import { ClipLoader } from "react-spinners";
import { MODULE_ADDRESS } from "../../../utils/Var";
import { AptimusNetwork } from "aptimus-sdk-test";
import { HeaderContainer, LeftHeader, TitleContainer, Logo, Title, RightHeader, WelcomeText, ChatModalBox, MessageList, MessageItem, MessageInfo, MessageText, MessageMeta, MessageUsername } from "./Header.style";
import PlayerInfoModal from "./PlayerInfoModal";
import { PlayerInfo } from "../../../type/type";

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

  const open = Boolean(anchorEl);

  const fetchPlayerInfo = async (address: string) => {
    try {
      const aptosConfig = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(aptosConfig);
  
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::gamev3::get_player_info`,
        functionArguments: [address],
      };
  
      const response = await aptos.view({ payload });
  
        if (response && Array.isArray(response) && response.length > 0) {
          const playerData = response[0];
          const parsedPlayerData: PlayerInfo = typeof playerData === "string" ? JSON.parse(playerData) : playerData;
  
          setPlayerInfo(parsedPlayerData);
        } else {
          console.error("Unexpected response format or empty array:", response);
        }
    } catch (error) {
      console.error("Failed to fetch player info:", error);
    }
  };

  useEffect(() => {
    if (chatModalOpen) {
      setLoading(true);
      fetchMessages();
      const intervalId = setInterval(fetchMessages, 1000);
      return () => clearInterval(intervalId);
    }
  }, [chatModalOpen]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
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

  const handleCopy = () => {
    navigator.clipboard.writeText(address ?? "");
  };

  const handleProfileOpen = () => {
    setProfileModalOpen(true);
    handleClose();
  };

  const handleProfileClose = () => {
    setProfileModalOpen(false);
  };

  const handleChatOpen = () => {
    setChatModalOpen(true);
  };

  const handleChatClose = () => {
    setChatModalOpen(false);
  };

  const handlePlayerInfoOpen = async (playerAddress: string) => {
    await fetchPlayerInfo(playerAddress);

    setPlayerInfoModalOpen(true);
  };

  const handlePlayerInfoClose = () => {
    setPlayerInfoModalOpen(false);
    setPlayerInfo(null);
  };

  const sendMessage = async (message: string) => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);
    const FUNCTION_NAME = `${MODULE_ADDRESS}::gamev3::send_global_chat_message`;
    const transaction = await aptos.transaction.build.simple({
      sender: address ?? "",
      data: {
        function: FUNCTION_NAME,
        functionArguments: [message], // Ensure it's always an array
      },
    });
    const committedTransaction = await flow.executeTransaction({
      aptos,
      transaction,
      network: AptimusNetwork.TESTNET,
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

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
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
        <Button onClick={handleChatOpen} sx={{ color: "white" }}>Chat</Button>
        <WelcomeText onClick={handleCopy}>{shortenAddress(address ?? "", 5)}</WelcomeText>
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
        handleClose={handleProfileClose}
      />
      <Modal open={chatModalOpen} onClose={handleChatClose}>
        <ChatModalBox>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <ClipLoader color="#00f" loading={loading} size={150} />
            </Box>
          ) : (
            <>
              <h2>Chat</h2>
              <MessageList ref={messageListRef}>
                {messages.map((msg, index) => (
                  <MessageItem key={index}>
                    <MessageInfo>
                      <Tooltip title={msg.sender}>
                        <MessageUsername onClick={() => handlePlayerInfoOpen(msg.sender)}>
                          {msg.username}
                        </MessageUsername>
                      </Tooltip>
                      <MessageText>{msg.message}</MessageText>
                      <MessageMeta>{new Date(parseInt(msg.timestamp) * 1000).toLocaleString()}</MessageMeta>
                    </MessageInfo>
                  </MessageItem>
                ))}
              </MessageList>
              <TextField
                fullWidth
                variant="outlined"
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ mt: 2 }}>
                Send
              </Button>
            </>
          )}
        </ChatModalBox>
      </Modal>
      <PlayerInfoModal
        open={playerInfoModalOpen}
        handleClose={handlePlayerInfoClose}
        playerInfo={playerInfo}
      />
    </HeaderContainer>
  );
};

export default Header;