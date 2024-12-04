import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Container, styled } from '@mui/system';
import VideoChat from './VideoChat';
import AppAppBar from './Header'
import ScheduleInterviewPopup from './ScheduleInterviewPopup';


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
                const response = await axios.get('http://localhost:5000/profile/dashboard', {
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

    if (!userData) return <div>Loading...</div>;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#121212',
                color: '#ffffff',
            }}
        >
            <AppAppBar />
            <Container
                sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    gap: { xs: 2, sm: 1 },
                    bgcolor: "blue",
                    p: { xs: "30px 10px", sm: "50px 20px 50px 20px" },
                    alignItems: "center",
                }}
            >
                {/* <Container sx={{
                    flex: { xs: 4, sm: 2 },
                    fontSize: 40,
                    width: "fit-content",
                    fontWeight: "bold",
                    borderRadius: 5,
                    boxShadow: 5,
                    padding: "100px 20px 100px 20px",
                    backgroundColor: '#1e1e1e',

                }}>
                    Welcome, {userData?.firstName}
                </Container> */}
                <Container sx={{
                    display: 'flex',
                    height: '100%',
                    backgroundColor: "white",
                    flex: { xs: 1, sm: 3 },
                    flexDirection: "row",
                    borderRadius: 10
                    // width: "100%"
                }}>
                    {/* Candidate Section */}
                    {userData.role === 'Candidate' && (
                        <Container sx={{
                            fontWeight: "bold",
                            borderRadius: 5,
                            boxShadow: 5,
                            padding: "10px 20px 100px 20px",
                            backgroundColor: '#1e1e1e',
                            width: "fit-content"
                        }}>
                            <Typography variant="h5" gutterBottom>
                                Your Scheduled Interviews
                            </Typography>
                            <ul>
                                {userData.scheduledInterviews?.map((interview) => (
                                    <li key={interview._id}>
                                        {new Date(interview.dateTime).toLocaleString()} with {interview.interviewerName}
                                    </li>
                                ))}
                            </ul>
                        </Container>
                    )}
                    {/* Interviewer Section*/}
                    {userData.role === 'Interviewer' && (
                        <Container sx={{
                            fontWeight: "bold",
                            borderRadius: 5,
                            boxShadow: 5,
                            padding: "10px 20px 100px 20px",
                            backgroundColor: '#1e1e1e',
                            width: "fit-content"
                        }}>
                            <Typography variant="h5" gutterBottom>
                                Upcoming Interviews
                            </Typography>
                            <ul>
                                {userData.scheduledInterviews?.map((interview) => (
                                    <li key={interview._id}>
                                        {new Date(interview.dateTime).toLocaleString()} with {interview.candidateName}
                                    </li>
                                ))}
                            </ul>
                        </Container>
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
