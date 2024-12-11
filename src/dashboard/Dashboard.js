import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Container, styled } from '@mui/system';
import AppAppBar from './Header'
import ScheduleInterviewPopup from './ScheduleInterviewPopup';
import InterviewerPage from './InterviewerPage';
import CandidatePage from './CandidatePage';


const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const handleOpenPopup = () => setIsPopupOpen(true);
    const handleClosePopup = () => setIsPopupOpen(false);

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
                    bgcolor: "green",
                    // height: 'auto', // Use auto or set a fixed height if needed
                    // maxHeight: 'calc(100vh - 64px)',
                    alignItems: "center",
                }}
            >
                <Container sx={{
                    display: 'flex',
                    flexDirection: "row",
                    height: 'auto',
                    maxHeight: 'auto',
                    backgroundColor: "white",
                    flex: { xs: 1, sm: 3 },
                    borderRadius: 5,
                    // boxShadow: 5,
                    py: '20px',
                }}>
                    {/* Candidate Section */}
                    {userData.role === 'Candidate' && (
                        <CandidatePage />
                    )}
                    {/* Interviewer Section*/}
                    {userData.role === 'Interviewer' && (
                        <InterviewerPage />
                    )}
                    {/* Feedback Section */}
                    <Container sx={{
                        fontWeight: "bold",
                        borderRadius: 5,
                        boxShadow: 5,
                        padding: "10px 20px 100px 20px",
                        backgroundColor: '#1e1e1e',
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
                </Container>
                <Button
                    onClick={handleOpenPopup}
                    variant="contained"
                    color="primary"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#2196f3',
                        ':hover': {
                            backgroundColor: '#1976d2',
                            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                        },
                    }}
                >
                    <Typography variant="button" color="inherit">
                        Schedule Interview
                    </Typography>
                </Button>
                {isPopupOpen && <ScheduleInterviewPopup onClose={handleClosePopup} />}
            </Container>
        </Box>
    );
};

export default Dashboard;
