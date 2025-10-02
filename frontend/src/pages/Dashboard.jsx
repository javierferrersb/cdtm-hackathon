import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Event as EventIcon, 
  Person as PersonIcon, 
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Insights as InsightsIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching upcoming events...');
      const response = await api.get('/api/calendar/events');
      console.log('Calendar API response:', response.data);
      console.log('Number of events found:', response.data.length);
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      if (err.response?.status === 401) {
        setError('Please sign in with Google to access your calendar');
      } else {
        setError('Failed to fetch calendar events');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event) => {
    navigate(`/event/${event.id}`, { state: { event } });
  };

  const getEventTime = (event) => {
    if (event.start?.dateTime) {
      return format(new Date(event.start.dateTime), 'MMM dd, yyyy - HH:mm');
    }
    return 'Time not specified';
  };

  const extractPersonCompany = (description) => {
    const pattern = /([\p{L}]+\s+[\p{L}]+(?:\s+[\p{L}]+)*)\s*-\s*([\p{L}\p{N}\s&.,]+)/u;
    const match = description?.match(pattern);
    if (match) {
      return {
        person: match[1].trim(),
        company: match[2].trim()
      };
    }
    return null;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          Meeting Intelligence Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your upcoming meetings for the next 2 days
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {events.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <EventIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No upcoming meetings found
          </Typography>
          <Typography variant="body1" color="text.disabled" sx={{ mb: 2 }}>
            To see meetings here, make sure your calendar events have descriptions formatted like:
          </Typography>
          <Typography variant="body2" sx={{ 
            fontFamily: 'monospace', 
            backgroundColor: 'grey.100', 
            p: 1, 
            borderRadius: 1,
            mb: 2
          }}>
            John Smith - Acme Corporation
          </Typography>
          <Typography variant="body2" color="text.disabled">
            The system looks for events in the next 2 days with this format in the description.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => {
            const extracted = extractPersonCompany(event.description);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={event.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(21, 101, 192, 0.2)',
                    }
                  }}
                  onClick={() => handleEventClick(event)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <EventIcon sx={{ color: 'primary.main', mr: 1, mt: 0.5 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {event.summary || 'Untitled Meeting'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {getEventTime(event)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {extracted && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PersonIcon sx={{ fontSize: 16, color: 'secondary.main', mr: 0.5 }} />
                          <Chip 
                            label={extracted.person} 
                            variant="outlined" 
                            size="small"
                            sx={{ 
                              borderColor: 'secondary.main',
                              color: 'secondary.main'
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BusinessIcon sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
                          <Chip 
                            label={extracted.company} 
                            variant="outlined" 
                            size="small"
                            sx={{ 
                              borderColor: 'primary.main',
                              color: 'primary.main'
                            }}
                          />
                        </Box>
                      </Box>
                    )}

                    <Button
                      variant="contained"
                      startIcon={<InsightsIcon />}
                      fullWidth
                      sx={{ 
                        mt: 2,
                        backgroundColor: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      Generate Intelligence Report
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;