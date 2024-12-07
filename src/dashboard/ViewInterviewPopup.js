import React, { useEffect, useState } from 'react';
import {
    Box,
    Modal,
    Paper,
    Typography,
    IconButton,
    Divider,
    TextField,
    Select,
    MenuItem,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import { CustomButton } from '../utils/utils';

const ViewInterviewPopup = ({ interviewId, onClose }) => {
    const [interviewDetails, setInterviewDetails] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [updatedDetails, setUpdatedDetails] = useState({});
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
                setUpdatedDetails(response.data);
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

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleInputChange = (field, value) => {
        setUpdatedDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveChanges = async () => {
        try {
            const response = await axios.put(
                `http://localhost:5000/interviews/${interviewId}`,
                updatedDetails,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.status === 200) {
                setInterviewDetails(updatedDetails);
                setEditMode(false);
            }
        } catch (err) {
            setError('Failed to update interview details.');
            console.error(err);
        }
    };

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
                            {editMode ? 'Edit Interview Details' : 'Interview Details'}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {error && (
                            <Typography color="error" gutterBottom>
                                {error}
                            </Typography>
                        )}
                        {editMode ? (
                            <>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Candidate"
                                        value={`${updatedDetails.candidateId.firstName} ${updatedDetails.candidateId.lastName}`}
                                        disabled
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Date and Time"
                                        type="datetime-local"
                                        value={new Date(updatedDetails.date).toISOString().slice(0, 16)}
                                        onChange={(e) => handleInputChange('date', e.target.value)}
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Company"
                                        value={updatedDetails.company}
                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Role"
                                        value={updatedDetails.role}
                                        onChange={(e) => handleInputChange('role', e.target.value)}
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Tooltip title="Select the interview level">
                                        <TextField
                                            fullWidth
                                            label="Level"
                                            value={updatedDetails.level || 'Initial'}
                                            onChange={(e) => handleInputChange('level', e.target.value)}
                                            select
                                            variant="outlined"
                                        >
                                            <MenuItem value="Initial">Initial</MenuItem>
                                            <MenuItem value="Intermediate">Intermediate</MenuItem>
                                            <MenuItem value="Final">Final</MenuItem>
                                        </TextField>
                                    </Tooltip>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Tooltip title="Select the type of interview">
                                        <TextField
                                            fullWidth
                                            label="Type"
                                            value={updatedDetails.type || 'Behavioural Round'}
                                            onChange={(e) => handleInputChange('type', e.target.value)}
                                            select
                                            variant="outlined"
                                        >
                                            <MenuItem value="Behavioural Round">Behavioural Round</MenuItem>
                                            <MenuItem value="Technical Round">Technical Round</MenuItem>
                                            <MenuItem value="Resume Review">Resume Review</MenuItem>
                                        </TextField>
                                    </Tooltip>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Tooltip title="Select the current status of the interview (Scheduled, Completed, Canceled, Overdue)">
                                        <TextField
                                            fullWidth
                                            label="Status"
                                            value={updatedDetails.status || 'Scheduled'}
                                            onChange={(e) => handleInputChange('status', e.target.value)}
                                            select
                                            variant="outlined"
                                        >
                                            <MenuItem value="Scheduled">Scheduled</MenuItem>
                                            <MenuItem value="Completed">Completed</MenuItem>
                                            <MenuItem value="Canceled">Canceled</MenuItem>
                                            <MenuItem value="Overdue">Overdue</MenuItem>
                                        </TextField>
                                    </Tooltip>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Add notes for the candidate"
                                        multiline
                                        rows={4}
                                        value={updatedDetails.notes}
                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <CustomButton onClick={handleSaveChanges} text={"Save Changes"} />
                                    <CustomButton onClick={handleEditToggle} text={"Cancel"} />
                                </Box>
                            </>
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
                                        Date and Time:
                                    </Typography>
                                    <Typography>
                                        {new Date(interviewDetails.date).toLocaleString()}
                                    </Typography>
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
                                        Level:
                                    </Typography>
                                    <Typography>{interviewDetails.level}</Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                        Type:
                                    </Typography>
                                    <Typography>{interviewDetails.type}</Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                        Status:
                                    </Typography>
                                    <Typography>{interviewDetails.status}</Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                        Notes:
                                    </Typography>
                                    <Typography>
                                        {interviewDetails.notes || 'No notes provided.'}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <CustomButton onClick={handleEditToggle} text={"Edit"} />
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
