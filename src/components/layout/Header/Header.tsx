import React, { useState, useRef, useEffect } from "react";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
import useAuth from "../../../hooks/useAuth";
import { Menu, MenuItem, Modal, Box, TextField, Button, Avatar, Tooltip } from "@mui/material";
import { HeaderContainer, LeftHeader, TitleContainer, Logo, Title, RightHeader, WelcomeText, ChatModalBox, MessageList, MessageItem, MessageInfo, MessageText, MessageMeta, MessageUsername } from "./Header.style";
import ProfileModal from "../../ProfileModal/ProfileModal";
import PlayerInfoModal from "./PlayerInfoModal";
import { ClipLoader } from "react-spinners";
import { shortenAddress } from "../../../utils/Shorten";
import { MODULE_ADDRESS } from "../../../utils/Var";
import { PlayerInfo } from "../../../type/type";
import useGetPlayer from "../../../hooks/useGetPlayer";
import useContract from "../../../hooks/useContract";

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

  const open = Boolean(anchorEl);

  const { fetchPlayer } = useGetPlayer();
  const { callContract } = useContract();

  const fetchPlayerInfo = async (address: string) => {
    setLoading(true);
    const player = await fetchPlayer(address);
    if (player) setPlayerInfo(player);
    setLoading(false);
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
                onKeyDown={handleKeyPress}
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
        playerAddress={playerAddress}
      />
    </HeaderContainer>
  );
};

export default Header;