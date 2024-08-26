// ChatModal.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Avatar,
  Tooltip,
  Typography,
} from "@mui/material";
import { ClipLoader } from "react-spinners";
import { BsSend } from "react-icons/bs";
import { shortenAddress } from "../../../utils/Shorten";
import { modalStyles } from "./Header.style";

interface ChatModalProps {
    open: boolean;
    onClose: () => void;
    handlePlayerInfoOpen: () => void;
  }
  
const ChatModal = ({ open, onClose, handlePlayerInfoOpen }: ChatModalProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageListRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    setLoading(true);
    // Logic to fetch messages here
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchMessages();
      const intervalId = setInterval(fetchMessages, 1000);
      return () => clearInterval(intervalId);
    }
  }, [open]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      // Logic to send the message
      setMessage("");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyles }}>
        <Typography variant="h6">Global Chat</Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <ClipLoader color="#00f" size={150} />
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            {/* Messages display here */}
          </Box>
        )}
        <Box component="form" sx={{ display: "flex" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Send a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ pr: 5 }}
          />
          <Button type="submit" onClick={handleSendMessage} sx={{ position: "absolute", right: 8, top: "50%" }}>
            <BsSend />
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default React.memo(ChatModal);
