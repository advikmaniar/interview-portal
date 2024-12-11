import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Button, Container } from '@mui/material';
import AppAppBar from './Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '../utils/utils';

const InterviewRoomPage = () => {
    const [upcomingInterviews, setUpcomingInterviews] = useState([]);
    const [pastInterviews, setPastInterviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/interviews/interviews', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const interviews = response.data;
                const currentDate = new Date();

                // Update statuses for overdue interviews
                const updatedInterviews = interviews.map((interview) => {
                    const interviewDate = new Date(interview.date);
                    if (
                        interviewDate < currentDate &&
                        interview.status !== 'Completed' &&
                        interview.status !== 'Cancelled'
                    ) {
                        interview.status = 'Overdue';
                    }
                    return interview;
                });

                const upcoming = updatedInterviews
                    .filter(
                        (interview) =>
                            new Date(interview.date) > currentDate &&
                            !['Completed', 'Cancelled'].includes(interview.status)
                    )
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                const past = updatedInterviews
                    .filter(
                        (interview) =>
                            new Date(interview.date) <= currentDate ||
                            ['Completed', 'Cancelled'].includes(interview.status)
                    )
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                setUpcomingInterviews(upcoming);
                setPastInterviews(past);
            } catch (error) {
                console.error('Error fetching interviews:', error);
            }
        };

        fetchInterviews();
    }, []);

    const getStatusStyles = (status) => {
        let color;
        switch (status) {
            case 'Completed':
                color = 'rgba(56, 142, 60, 0.7)'; // Green
                break;
            case 'Overdue':
                color = 'rgba(244, 67, 54, 0.7)'; // Red
                break;
            case 'Scheduled':
                color = 'rgba(255, 193, 7, 0.7)'; // Yellow
                break;
            default:
                color = 'rgba(33, 150, 243, 0.7)'; // Blue
        }
        return {
            backgroundColor: color,
            color: '#000',
            padding: '4px 8px',
            borderRadius: 5,
            fontSize: '12px',
            fontWeight: 'bold',
            textAlign: 'center',
            display: 'inline-block',
            boxShadow: 5,
        };
    };

    const handleInitiateVideoCall = async () => {
        const roomName = `Room-${new Date().getTime()}`;

        try {
            const response = await axios.post('http://localhost:5000/api/interviews/create-room', { roomName });

            if (response.data && response.data.roomSid && response.data.roomName) {
                const { roomSid, roomName } = response.data;
                console.log(`Room created: ${roomSid}, ${roomName}`);

                navigate(`/video-call/${roomSid}`, { state: { roomName } });
            } else {
                console.error('Invalid response data', response.data);
            }
        } catch (error) {
            console.error('Error creating video room:', error.response ? error.response.data : error.message);
        }
    };

    const renderInterviews = (interviews) =>
        interviews.map((interview, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        backgroundColor: '#24272B',
                        borderRadius: 5,
                        boxShadow: 5,
                        padding: 0,
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#6D757D',
                            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                            transform: 'translateY(-2px)',
                        },
                        cursor: 'pointer',
                    }}
                >
                    <CardContent
                        sx={{
                            flexGrow: 1,
                            backgroundColor: "red",
                            borderRadius: 5,
                            p: "10px 10px 5px 10px"
                        }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: "center",
                                gap: 1,
                                backgroundColor: '#4A525A',
                                borderRadius: 10,
                                boxShadow: 5,
                                color: '#ffffff',
                            }}>
                            <Box
                                sx={{
                                    flexShrink: 0,
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    borderRadius: 10,
                                    marginRight: 'auto',
                                    padding: '4px 8px',
                                    borderRadius: 10,
                                }}
                            >
                                <Typography variant="h6">
                                    {interview.role}
                                </Typography>
                            </Box>
                            <Box>Edit Icon</Box>
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: 'transparent',
                                color: 'white',
                                borderRadius: 10,
                                marginRight: 'auto',
                                padding: '5px 8px',
                                borderRadius: 10,
                            }}>
                            <Typography variant="body1">
                                <strong>Candidate:</strong> {interview.candidateId.firstName} {interview.candidateId.lastName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Date:</strong> {new Date(interview.date).toLocaleString()}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Level:</strong> {interview.level}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Type:</strong> {interview.type}
                            </Typography>
                            <Box>
                                <Box sx={getStatusStyles(interview.status)}>{interview.status}</Box>
                            </Box>
                        </Box>
                    </CardContent>
                    <Box
                        sx={{
                            justifyContent: 'center',
                            alignItems: "center",
                            p: '0px 0px 10px 10px',
                        }}>
                        <CustomButton
                            onClick={handleInitiateVideoCall}
                            text="Start Meeting"
                        >
                        </CustomButton>
                    </Box>
                </Box>
            </Grid>
        ));

    return (
        <Box
            sx={{
                backgroundColor: '#696969',
                color: '#ffffff',
                minHeight: '100vh',
                paddingTop: '64px',
                paddingBottom: '32px',
            }}
        >
            <AppAppBar />
            <Container
                sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    gap: { xs: 2, sm: 1 },
                    bgcolor: "green",
                    marginTop: 7,
                    alignItems: "center",
                }}
            >
                <Box sx={{ padding: '16px' }}>
                    <Typography variant="h5" gutterBottom>
                        Upcoming Interviews
                    </Typography>
                    <Grid container spacing={3}>
                        {upcomingInterviews.length > 0 ? (
                            renderInterviews(upcomingInterviews)
                        ) : (
                            <Typography variant="body1">No upcoming interviews.</Typography>
                        )}
                    </Grid>
                    <Box sx={{ marginTop: '32px' }}>
                        <Typography variant="h5" gutterBottom>
                            Past Interviews
                        </Typography>
                        <Grid container spacing={3}>
                            {pastInterviews.length > 0 ? (
                                renderInterviews(pastInterviews)
                            ) : (
                                <Typography variant="body1">No past interviews.</Typography>
                            )}
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default InterviewRoomPage;
