import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import socket from '../socket';
import TokenService from './token/tokenService';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import dayjs from 'dayjs';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const bottomRef = useRef(null);

  const logginUserId = TokenService.getRegistrationNo();
  const { userId: otherUserId } = useParams();

  useEffect(() => {
    socket.emit('join', logginUserId);

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat/messages`, {
          params: { user1: logginUserId, user2: otherUserId }
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    fetchMessages();

    return () => {
      socket.off('receiveMessage');
    };
  }, [logginUserId, otherUserId]);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      const { sender, recipient } = newMessage;
      if (
        (sender === logginUserId && recipient === otherUserId) ||
        (sender === otherUserId && recipient === logginUserId)
      ) {
        setMessages(prev => [...prev, newMessage]);
      }
    };

    socket.on('receiveMessage', handleNewMessage);

    return () => {
      socket.off('receiveMessage', handleNewMessage);
    };
  }, [logginUserId, otherUserId]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat/send-message`, {
        sender: logginUserId,
        recipient: otherUserId,
        message: messageText
      });

      setMessages(prev => [...prev, res.data]);
      socket.emit('sendMessage', res.data);
      setMessageText('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send message');
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: 600,
        height: '80vh',
        mx: 'auto',
        my: 3,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar>{otherUserId[0]?.toUpperCase()}</Avatar>
        <Typography variant="h6">Chat with {otherUserId}</Typography>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: 'auto',
          bgcolor: '#f0f2f5',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdbdbd',
            borderRadius: '3px',
          },
        }}
      >
        {messages.map((msg) => {
          const isOwn = msg.sender === logginUserId;
          return (
            <Box
              key={msg._id}
              sx={{
                display: 'flex',
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  px: 2,
                  maxWidth: '70%',
                  background: 'white',
                  color: '#000',
                  borderRadius: 3,
                  borderTopLeftRadius: isOwn ? 3 : 0,
                  borderTopRightRadius: isOwn ? 0 : 3,
                  boxShadow: 1,
                }}
              >
                <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                  {msg.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'right',
                    opacity: 0.7,
                    mt: 0.5,
                    fontSize: '0.75rem',
                  }}
                >
                  {dayjs(msg.sentAt).format('HH:mm')}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          gap: 2,
          borderTop: '1px solid #e0e0e0',
          bgcolor: 'white',
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          size="small"
        />
        <IconButton
          color="primary"
          onClick={sendMessage}
          disabled={!messageText.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default ChatBox;
