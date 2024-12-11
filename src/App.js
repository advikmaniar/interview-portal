import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles'; 

import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegistrationPage';
import VideoCall from './components/VideoCall';
import Dashboard from './dashboard/Dashboard';
import InterviewRoom from './dashboard/InterviewRoom'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6200ea', 
    },
    background: {
      default: '#121212', 
    },
    text: {
      primary: '#ffffff',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Default route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interview-room" element={<InterviewRoom />} />
        <Route path="/video-call/:roomSid" element={<VideoCall />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
};

export default App;
