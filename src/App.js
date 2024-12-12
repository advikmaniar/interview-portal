import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles'; 

import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegistrationPage';
import VideoCall from './components/VideoCall';
import Dashboard from './dashboard/Dashboard';
import InterviewRoom from './InterviewRoom/InterviewRoom';
import { useThemeMode, ThemeModeProvider } from './header/ThemeModeProvider';

const App = () => {
  const { mode } = useThemeMode(); 
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: "#6200ea", 
      },
      background: {
        default: mode === "dark" ? "#121212" : "#ffffff",
        paper: mode === "dark" ? "#424242" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#000000",
      },
    },
  });

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

const AppWrapper = () => (
  <ThemeModeProvider>
    <App />
  </ThemeModeProvider>
);

export default AppWrapper;
