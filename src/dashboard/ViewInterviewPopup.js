import React, { useEffect, useState } from 'react';
import {
    Box,
    Modal,
    Paper,
    Typography,
    IconButton,
    Divider,
    CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';

const ViewInterviewPopup = ({ interviewId, onClose }) => {
    const [interviewDetails, setInterviewDetails] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviewDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/interviews/${interviewId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setInterviewDetails(response.data);
            } catch (err) {
                setError('Failed to fetch interview details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (interviewId) {
            fetchInterviewDetails();
        }
    }, [interviewId]);

    return (
        <Modal
            open={!!interviewId}
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: { xs: '90%', sm: '60%', md: '40%' },
                    maxHeight: '80%',
                    overflowY: 'auto',
                    p: 3,
                    position: 'relative',
                }}
            >
                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <IconButton
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                color: 'gray',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: 'black',
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                            Interview Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {error ? (
                            <Typography color="error" gutterBottom>
                                {error}
                            </Typography>
                        ) : (
                            <>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                        Candidate:
                                    </Typography>
                                    <Typography>{`${interviewDetails.candidateId.firstName} ${interviewDetails.candidateId.lastName}`}</Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                        Company:
                                    </Typography>
                                    <Typography>{interviewDetails.company}</Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                        Role:
                                    </Typography>
                                    <Typography>{interviewDetails.role}</Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                        Date and Time:
                                    </Typography>
                                    <Typography>
                                        {new Date(interviewDetails.date).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                        Description:
                                    </Typography>
                                    <Typography>
                                        {interviewDetails.description || 'No description provided.'}
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </>
                )}
            </Paper>
        </Modal>
    );
};

export default ViewInterviewPopup;
