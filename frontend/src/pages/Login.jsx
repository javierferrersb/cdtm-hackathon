import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { Business, Person, Login as LoginIcon } from '@mui/icons-material';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3001/auth/google';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
          ConsultIQ Dashboard
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Intelligent Meeting Preparation for Consultants
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
          Automatically analyze your upcoming meetings, research attendees and companies, 
          and get AI-powered insights to make every consultation more effective.
        </Typography>
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 6, 
          textAlign: 'center',
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'primary.light',
          borderRadius: 4
        }}
      >
        <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 3 }} />
        
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
          Get Started
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Sign in with your Google account to access your calendar and start generating meeting insights.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleGoogleLogin}
          sx={{ 
            py: 2, 
            px: 4, 
            fontSize: '1.1rem',
            borderRadius: 2,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            }
          }}
        >
          Sign in with Google
        </Button>
      </Paper>

      <Box sx={{ mt: 6, display: 'flex', gap: 3, justifyContent: 'center' }}>
        <Card sx={{ flex: 1, maxWidth: 300 }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Person sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              People Intelligence
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get insights about meeting attendees including their background, role, and recent activities.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, maxWidth: 300 }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Business sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Company Research
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Automatic company analysis with industry insights, recent news, and key information.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;