import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import DebugAuth from './pages/DebugAuth';
import { useAuth } from './services/auth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading application...
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/event/:eventId" 
            element={user ? <EventDetails /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/debug" 
            element={<DebugAuth />} 
          />
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
          />
        </Routes>
      </Container>
    </div>
  );
}

export default App;