import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Button, Container } from '@mui/material';
import AppAppBar from './Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CustomButton, Tag } from '../utils/utils';
import EditIcon from '@mui/icons-material/Edit';
import ViewInterviewPopup from './ViewInterviewPopup';

const InterviewRoom = () => {
    const [upcomingInterviews, setUpcomingInterviews] = useState([]);
    const [pastInterviews, setPastInterviews] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);

    const handleEditClick = (interview) => {
        console.log("Edit button clicked");
        console.log("Selected Interview: ", interview);  // Make sure this is logging correctly
        setSelectedInterview(interview);  // Set the selected interview
        setIsPopupOpen(true);  // Open the popup
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
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

    const handleInitiateVideoCall = async (interviewId) => {
        const roomName = `Room-${new Date().getTime()}`;

        try {
            const response = await axios.post(
                'http://localhost:5000/api/interviews/create-room',
                {
                    roomName,
                    interviewId
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data && response.data.roomSid && response.data.roomName) {
                const { roomSid, roomName } = response.data;
                console.log(`Room created: ${roomSid}, ${roomName}`);

                navigate(`/video-call/${roomSid}`, {
                    state: {
                        roomName,
                        interviewId
                    }
                });
            } else {
                console.error('Invalid response data', response.data);
            }
        } catch (error) {
            console.error('Error creating video room:', error.response ? error.response.data : error.message);
        }
    };

    const renderInterviews = (interviews, isUpcoming) =>
        interviews.map((interview, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        backgroundColor: '#4A525A',
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
                            backgroundColor: "transparent",
                            borderRadius: 5,
                            p: "10px 10px 5px 10px"
                        }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: "center",
                                gap: 1,
                                backgroundColor: '#939396',
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
                            <Box
                                onClick={() => {
                                    handleEditClick(interview)
                                }}
                                sx={{ cursor: 'pointer' }}>
                                <EditIcon />
                            </Box>
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
                            <Box>
                                <Typography variant="body1">
                                    <strong>Candidate:</strong> {interview.candidateId.firstName} {interview.candidateId.lastName}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2">
                                    <strong>Date:</strong> {new Date(interview.date).toLocaleString()}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '5px 8px',
                                    gap: 1
                                }}>
                                <Box>
                                    <Tag value={interview.level} type="level" />
                                </Box>
                                <Box>
                                    <Tag value={interview.type} type="type" />
                                </Box>
                                <Box>
                                    <Tag value={interview.status} type="status" />
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                    {isUpcoming && (
                        <Box
                            sx={{
                                justifyContent: 'center',
                                alignItems: "center",
                                p: '0px 0px 10px 10px',
                            }}>
                            <CustomButton
                                onClick={
                                    () => {
                                        handleInitiateVideoCall(interview._id);
                                    }}
                                text="Start Meeting"
                            >
                            </CustomButton>
                        </Box>
                    )}
                </Box>
            </Grid>
        ));

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#696969',
                    color: '#ffffff',
                }}
            >
                <Box>
                    <AppAppBar />
                </Box>
                <Box>
                    <Container
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "row", sm: "column" },
                            gap: { xs: 2, sm: 1 },
                            width: "100%",
                            bgcolor: "#24272B",
                            borderRadius: 5,
                            marginTop: '150px',
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "row", sm: "column" },
                                gap: { xs: 2, sm: 1 },
                                width: "100%",
                                bgcolor: "transparent",
                                borderRadius: 5,
                                alignItems: "center",
                            }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: "row", sm: "column" },
                                    gap: { xs: 2, sm: 1 },
                                    width: "100%",
                                    bgcolor: "transparent",
                                    borderRadius: 5,
                                    alignItems: "center",
                                }}>
                                <Typography variant="h5" gutterBottom>
                                    Upcoming Interviews
                                </Typography>
                                <Grid container spacing={3}>
                                    {upcomingInterviews.length > 0 ? (
                                        renderInterviews(upcomingInterviews, true)
                                    ) : (
                                        <Typography variant="body1">No upcoming interviews.</Typography>
                                    )}
                                </Grid>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: "row", sm: "column" },
                                    gap: { xs: 2, sm: 1 },
                                    width: "100%",
                                    bgcolor: "transparent",
                                    borderRadius: 5,
                                    alignItems: "center",
                                }}
                            >
                                <Typography variant="h5" gutterBottom>
                                    Past Interviews
                                </Typography>
                                <Grid container spacing={3}>
                                    {pastInterviews.length > 0 ? (
                                        renderInterviews(pastInterviews, false)
                                    ) : (
                                        <Typography variant="body1">No past interviews.</Typography>
                                    )}
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </Box>
            {/* Render Popup */}
            {isPopupOpen && selectedInterview ? (
                console.log("InterviewId: "+selectedInterview._id),
                <ViewInterviewPopup
                    interviewId={selectedInterview._id}
                    onClose={handleClosePopup}
                />
            ) : (
                <Typography variant="h6">Popup is not open</Typography> // Fallback message
            )}
        </>
    );
};

export default InterviewRoom;
