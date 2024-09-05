import React, { useState, useRef, useEffect } from "react";

import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
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
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface CoinStoreResource {
  data: {
    coin: {
      value: string;
    };
  };
}

interface Coin {
  coin: {
    value: string;
  };
}

const Header: React.FC = () => {
  const address = localStorage.getItem("address");
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
  const { disconnect }=useWallet()
  useEffect(()=>{},[])

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
    disconnect()
    window.location.reload();
  };

  const handleProfileOpen = () => {
    console.log("adsdad")
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
        username: address ?? "unknown",
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
       <RightHeader>

         <WelcomeText onClick={() => navigator.clipboard.writeText(address ?? "")}>{shortenAddress(address ?? "", 5)}</WelcomeText>
         <Avatar
           component="div"
           src={`https://i.pinimg.com/564x/08/13/41/08134115f47ccd166886b40f36485721.jpg`}
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