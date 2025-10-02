import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import {
  ArrowBack,
  Person as PersonIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  TipsAndUpdates as TipsIcon,
  Article as ArticleIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../services/api';
import Chatbot from '../components/Chatbot';

const EventDetails = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const event = location.state?.event;

  useEffect(() => {
    if (eventId) {
      fetchOrGenerateReport();
    }
  }, [eventId]);

  const fetchOrGenerateReport = async () => {
    try {
      setLoading(true);
      setGenerating(true);
      
      const queryParams = new URLSearchParams({
        title: event?.summary || '',
        description: event?.description || '',
        startTime: event?.start?.dateTime || '',
        endTime: event?.end?.dateTime || '',
        attendees: JSON.stringify(event?.attendees?.map(a => a.email) || [])
      });

      const response = await api.get(`/api/reports/event/${eventId}?${queryParams}`);
      setReport(response.data);
    } catch (err) {
      setError('Failed to generate report');
      console.error('Error generating report:', err);
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  const getEventTime = () => {
    if (event?.start?.dateTime) {
      return format(new Date(event.start.dateTime), 'EEEE, MMMM dd, yyyy - HH:mm');
    }
    return 'Time not specified';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          {generating ? 'Generating Intelligence Report...' : 'Loading...'}
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
          This may take a few moments while we research the attendees and company.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      {/* Event Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            {event?.summary || 'Meeting Details'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6" color="text.secondary">
              {getEventTime()}
            </Typography>
          </Box>
          {report?.extractedInfo && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<PersonIcon />}
                label={report.extractedInfo.personName}
                color="secondary"
                variant="outlined"
              />
              <Chip 
                icon={<BusinessIcon />}
                label={report.extractedInfo.companyName}
                color="primary"
                variant="outlined"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {report && (
        <Grid container spacing={3}>
          {/* Meeting Summary */}
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                  Meeting Intelligence Summary
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  {report.generatedSummary}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Person Intelligence */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main', display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Person Intelligence
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Job Title
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {report.personIntelligence?.jobTitle || 'Not specified'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Background
                  </Typography>
                  <Typography variant="body2">
                    {report.personIntelligence?.background || 'No background information available'}
                  </Typography>
                </Box>

                {report.personIntelligence?.recentNews?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Recent News
                    </Typography>
                    <List dense>
                      {report.personIntelligence.recentNews.slice(0, 3).map((news, index) => (
                        <ListItem key={index} sx={{ pl: 0 }}>
                          <ListItemIcon>
                            <ArticleIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={news} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Company Intelligence */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon sx={{ mr: 1 }} />
                  Company Intelligence
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Industry
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {report.companyIntelligence?.industry || 'Not specified'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2">
                    {report.companyIntelligence?.description || 'No description available'}
                  </Typography>
                </Box>

                {report.companyIntelligence?.recentNews?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Recent Company News
                    </Typography>
                    <List dense>
                      {report.companyIntelligence.recentNews.slice(0, 3).map((news, index) => (
                        <ListItem key={index} sx={{ pl: 0 }}>
                          <ListItemIcon>
                            <ArticleIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={news} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Preparation Tips */}
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                  <TipsIcon sx={{ mr: 1 }} />
                  Meeting Preparation Tips
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {report.preparationTips?.map((tip, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <CheckIcon sx={{ color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={tip}
                        primaryTypographyProps={{ variant: 'body1' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Chatbot */}
      <Chatbot
        eventId={eventId}
        context={{
          personName: report?.extractedInfo?.personName,
          companyName: report?.extractedInfo?.companyName,
          eventSummary: event?.summary
        }}
        open={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
      />
    </Box>
  );
};

export default EventDetails;