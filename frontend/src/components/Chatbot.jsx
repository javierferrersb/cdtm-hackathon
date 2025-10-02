import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Collapse,
  Alert,
  Chip,
  Fab
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import api from '../services/api';

const Chatbot = ({ eventId, context, open, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/api/chat/event/${eventId}`, {
        message: userMessage,
        context: context
      });

      // Add bot response to chat
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.message,
        searchResults: response.data.searchResults,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!open) {
    return (
      <Fab
        color="primary"
        aria-label="chat"
        onClick={onToggle}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <ChatIcon />
      </Fab>
    );
  }

  return (
    <Card 
      sx={{ 
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 400,
        height: 500,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3
      }}
    >
      {/* Chat Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'primary.main', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BotIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Meeting Assistant</Typography>
        </Box>
        <IconButton 
          size="small" 
          onClick={onToggle}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Context Info */}
      {context && (
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Current meeting context:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
            {context.personName && (
              <Chip 
                size="small" 
                icon={<PersonIcon />}
                label={context.personName}
                variant="outlined"
              />
            )}
            {context.companyName && (
              <Chip 
                size="small" 
                label={context.companyName}
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}

      {/* Messages Area */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {messages.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            <BotIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body2">
              Ask me anything about the meeting, attendees, or company!
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              I can search the web for additional information.
            </Typography>
          </Box>
        )}

        <List sx={{ flex: 1 }}>
          {messages.map((message) => (
            <ListItem 
              key={message.id}
              sx={{ 
                flexDirection: 'column',
                alignItems: message.type === 'user' ? 'flex-end' : 'flex-start',
                px: 1
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '85%',
                  bgcolor: message.type === 'user' ? 'primary.main' : 'grey.100',
                  color: message.type === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2,
                  position: 'relative'
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Typography>
                
                {/* Search Results for bot messages */}
                {message.type === 'bot' && message.searchResults && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Sources:
                    </Typography>
                    {message.searchResults.map((result, index) => (
                      <Chip
                        key={index}
                        icon={<LinkIcon />}
                        label={result.title}
                        size="small"
                        sx={{ mr: 1, mt: 0.5 }}
                        clickable
                        onClick={() => window.open(result.url, '_blank')}
                      />
                    ))}
                  </Box>
                )}
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mt: 1, 
                    opacity: 0.7,
                    textAlign: message.type === 'user' ? 'right' : 'left'
                  }}
                >
                  {formatTime(message.timestamp)}
                </Typography>
              </Paper>
            </ListItem>
          ))}
        </List>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={20} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ m: 1 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            multiline
            maxRows={3}
            placeholder="Ask about the meeting, company, or person..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                paddingRight: 0
              }
            }}
          />
          <IconButton 
            color="primary" 
            onClick={sendMessage}
            disabled={!inputMessage.trim() || loading}
            sx={{ ml: 1 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default Chatbot;