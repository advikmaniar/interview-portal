import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Container } from '@mui/system';
import AppAppBar from '../header/Header';
import { alpha, styled, useTheme } from "@mui/material/styles";

import InterviewerPage from './InterviewerPage';
import CandidatePage from './CandidatePage';


const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/users/dashboard', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
                navigate('/login');
            }
        };
        fetchData();
    }, [navigate]);

    if (!userData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#696969',
                paddingTop: '64px',
                color: '#ffffff',
            }}
        >
            <AppAppBar />
            <Container
                sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    gap: { xs: 2, sm: 1 },
                    bgcolor: "transparent",
                    alignItems: "center",
                }}
            >
                <Container sx={{
                    display: 'flex',
                    flexDirection: "row",
                    height: 'auto',
                    maxHeight: 'auto',
                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                    color: theme.palette.mode === "dark" ? "white" : "#333333",
                    flex: { xs: 1, sm: 3 },
                    borderRadius: 5,
                    boxShadow: 5,
                    py: '20px',
                }}
                >
                    {/* Candidate Section */}
                    {userData.role === 'Candidate' && (
                        <CandidatePage />
                    )}
                    {/* Interviewer Section*/}
                    {userData.role === 'Interviewer' && (
                        <InterviewerPage />
                    )}
                    {/* Feedback Section */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: "column",
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            backgroundColor: alpha(theme.palette.background.default, 0.5),
                            color: theme.palette.mode === "dark" ? "white" : "#333333",
                        }}>
                        <Container sx={{
                            fontWeight: "bold",
                            borderRadius: 5,
                            boxShadow: 5,
                            padding: "10px 20px 100px 20px",
                            backgroundColor: alpha(theme.palette.background.default, 0.5),
                            color: theme.palette.mode === "dark" ? "white" : "#333333",
                            width: "fit-content"
                        }}>
                            <Typography variant="h5" gutterBottom>
                                Recent Feedback
                            </Typography>
                            <Typography variant="body1">
                                {userData.role === 'interviewer'
                                    ? 'Provide feedback for candidates here.'
                                    : 'Your feedback from recent interviews will appear here.'}
                            </Typography>
                        </Container>
                        {/* Statistics */}
                        <Container sx={{
                            fontWeight: "bold",
                            borderRadius: 5,
                            boxShadow: 5,
                            padding: "10px 20px 100px 20px",
                            backgroundColor: alpha(theme.palette.background.default, 0.5),
                            color: theme.palette.mode === "dark" ? "white" : "#333333",
                            width: "fit-content"
                        }}>
                            <Typography variant="h5" gutterBottom>
                                Statistics
                            </Typography>
                            <Typography variant="body1">
                                {userData.role === 'interviewer'
                                    ? 'Provide feedback for candidates here.'
                                    : 'Your feedback from recent interviews will appear here.'}
                            </Typography>
                        </Container>
                    </Box>
                </Container>
            </Container>
        </Box>
    );
};

export default Dashboard;
