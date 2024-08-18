import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useAptimusFlow } from "aptimus-sdk-test/react";
import useAuth from "../../hooks/useAuth";
import { Menu, MenuItem, Modal, Box, TextField, Button, Avatar, Tooltip, IconButton } from "@mui/material";
import { shortenAddress } from "../../utils/Shorten";
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
import ProfileModal from "../../components/ProfileModal";
import { ClipLoader } from "react-spinners";
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { MODULE_ADDRESS } from "../../utils/Var";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { AptimusNetwork } from "aptimus-sdk-test";
import { PlayerInfo } from "../../type/type";

const HeaderContainer = styled.div`
  height: 60px;
  padding: 20px;
  text-align: left;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #181733;
`;

const LeftHeader = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  flex: 1;
`;

const TitleContainer = styled.header`
  background: linear-gradient(180deg, #885bff 0%, #5977d6 100%);
  width: 160px;
  background-color: #0e235e;
  padding: 4px 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  cursor: pointer;
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50px;
  margin-right: 5px;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 3px;
`;

const RightHeader = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  flex: 1;
`;

const WelcomeText = styled.p`
  color: white;
  font-size: 14px;
  margin-right: 20px;
  cursor: pointer;
`;

const ChatModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1000px;
  height: 85vh;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
`;

const MessageItem = styled.div`
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.4);
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
`;

const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const MessageText = styled.span`
  font-size: 16px;
`;

const MessageMeta = styled.span`
  font-size: 12px;
  color: #555;
`;

const MessageUsername = styled.span`
  font-size: 12px;
  color: #555;
  cursor: pointer;
`;

const PlayerInfoModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: #181733;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
`;
interface PlayerModalPros{
  open: boolean,
  handleClose: () => void,
  playerInfo: null|PlayerInfo
}
const PlayerInfoModal = ({ open, handleClose, playerInfo }:PlayerModalPros) => {
  if (!playerInfo) return null;

  const { username, name, points, games_played, winning_games, likes_received, dislikes_received, user_image } = playerInfo;
  const winRate = (Number(games_played) > 0) ? (Number(winning_games) / Number(games_played)) * 100 : 0;

  return (
    <Modal open={open} onClose={handleClose}>
      <PlayerInfoModalBox>
  
        <img src={user_image} alt={`${username}'s avatar`} style={{ width: '100px', borderRadius: '50%', marginBottom: '20px' }} />
        <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PersonAddIcon />}
            style={{ marginBottom: '20px' }}
          >
            Add friend
        </Button>
        <div style={{ width: '100%', textAlign: 'left' }}>
          <h2>{name}</h2>
          <h4>{username}</h4>
          <InfoItem>
          <span>Points:</span> <span>{points}</span>
        </InfoItem>
        <InfoItem>
          <span>Games Played:</span> <span>{games_played}</span>
        </InfoItem>
        <InfoItem>
          <span>Winning Games:</span> <span>{winning_games}</span>
        </InfoItem>
        <InfoItem>
          <span>Win Rate:</span> <span>{winRate.toFixed(2)}%</span>
        </InfoItem>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '10px' }}>
          <Button startIcon={<ThumbUpIcon />} variant="outlined" color="primary">
            Like ({likes_received})
          </Button>
          <Button startIcon={<ThumbDownIcon />} variant="outlined" color="secondary">
            Dislike ({dislikes_received})
          </Button>
        </div>
      </PlayerInfoModalBox>
    </Modal>
  );
};

const fetchPlayerInfo = async (address: string) => {
  try {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);

    const payload: InputViewFunctionData = {
      function: `${MODULE_ADDRESS}::gamev3::get_player_info`,
      functionArguments: [address],
    };

    const data = await aptos.view({ payload });
    // @ts-ignore

    const info: PlayerInfo = data[0];
    // Assuming the data returned matches the structure [username, name, points, games_played, winning_games, _, likes_received, dislikes_received, user_image]
    return info;
  } catch (error) {
    console.error("Failed to fetch player info:", error);
    return null;
  }
};

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
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo|null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  const open = Boolean(anchorEl);

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
      const payload : InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::gamev3::get_global_chat_messages`,
        functionArguments: [],
      };

      const data = await aptos.view({ payload });

      const flattenedData = data.flat();
                  // @ts-ignore

      setMessages(flattenedData);
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
    const info = await fetchPlayerInfo(playerAddress);
    setPlayerInfo(info);
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
        username: auth?.email ?? "unknown",
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