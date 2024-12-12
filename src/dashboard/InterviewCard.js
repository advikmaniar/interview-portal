import React, { useState } from 'react';
import {
    Box,
    ListItem,
    ListItemText,
    Tooltip,
    Select,
    MenuItem,
    CircularProgress,
    Typography,
    Button
} from '@mui/material';
import ViewInterviewPopup from './ViewInterviewPopup';
import DeleteIcon from '@mui/icons-material/Delete';
import { alpha, styled, useTheme } from "@mui/material/styles";
import axios from 'axios';

const InterviewCard = ({ interview, isPastInterview, onDelete, onStatusUpdate }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState(interview.status);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    // Format date and time
    const interviewDate = new Date(interview.date);
    const dateFormat = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit' });
    const timeFormat = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const formattedDate = dateFormat.format(interviewDate);
    const formattedTime = timeFormat.format(interviewDate);

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleTogglePopup = () => {
        setIsPopupOpen((prev) => !prev);
    };

    const handleStatusChange = async (newStatus) => {
        setLoading(true);
        try {
            await axios.put(`http://localhost:5000/api/interviews/${interview._id}`, {
                status: newStatus,
            });
            setStatus(newStatus);
            if (onStatusUpdate) onStatusUpdate(interview._id, newStatus);
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setLoading(false);
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(interview._id);
        }
    };

    return (
        <>
            <ListItem sx={{ paddingLeft: 0, paddingRight: 0, margin: 0 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: alpha(theme.palette.background.default, 0.5),
                        color: theme.palette.mode === "dark" ? "white" : "black",
                        borderRadius: '50px 50px 50px 50px',
                        width: "100%",
                        p: '0px 20px 0px 0px',
                        title: 'View Interview Details',
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.background.default, 1),
                            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                            transform: 'translateY(-2px)',


                        },
                        cursor: 'pointer',
                    }}
                >
                    {/* Date and Time Bubble */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: theme.palette.mode === "dark" ? "#333333" : "white",
                            color: theme.palette.mode === "dark" ? "white" : "black",
                            borderRadius: '50%',
                            width: 65,
                            height: 65,
                            marginRight: 2,
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="body2">{`${formattedDate} ${formattedTime} PM`}</Typography>
                    </Box>
                    {/* Popup trigger */}
                    <ListItemText
                        onClick={handleTogglePopup}
                        primaryTypographyProps={{
                            sx: {
                                fontSize: '0.9rem',
                                margin: 0,
                                color: theme.palette.mode === "dark" ? "white" : "black",
                            },
                        }}
                        secondaryTypographyProps={{
                            sx: {
                                fontSize: '0.8rem',
                                margin: 0,
                                color: theme.palette.mode === "dark" ? "#999999" : "#222222",
                            },
                        }}
                        primary={`${interview.role} at ${interview.company}`}
                        secondary={`Candidate: ${interview.candidateId.firstName} ${interview.candidateId.lastName}`}
                    />

                    {/* Dropdown for status */}
                    <Tooltip arrow>
                        <Box>
                            {isEditing ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Select
                                        value={status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        size="small"
                                        sx={{
                                            color: '#ffffff',
                                            backgroundColor: '#5A676D',
                                            borderRadius: '4px',
                                            '& .MuiSvgIcon-root': {
                                                color: '#ffffff',
                                            },
                                        }}
                                    >
                                        <MenuItem value="Scheduled">Scheduled</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                        <MenuItem value="Overdue">Overdue</MenuItem>
                                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                                    </Select>
                                    {loading && (
                                        <CircularProgress
                                            size={20}
                                            sx={{ color: '#ffffff', marginLeft: '10px' }}
                                        />
                                    )}
                                </Box>
                            ) : (
                                <Tooltip title={status} arrow>
                                    <Box
                                        onClick={() => setIsEditing(true)}
                                        sx={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            boxShadow: 5,
                                            backgroundColor:
                                                status === 'Scheduled'
                                                    ? '#FFC107' // Yellow
                                                    : status === 'Completed'
                                                        ? '#4CAF50' // Green
                                                        : status === 'Overdue'
                                                            ? '#F44336' // Red
                                                            : status === 'Cancelled'
                                                                ? '#B0BEC5' // Gray
                                                                : '#B0BEC5', // Default Gray
                                            '&:hover': {
                                                boxShadow: 7,
                                                transform: 'translateY(-2px)',
                                            },
                                            cursor: 'pointer',
                                            marginLeft: 'auto',
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Box>
                    </Tooltip>
                </Box>

                {/* Delete Button for Past Interviews */}
                <Box>
                    {isPastInterview && (
                        <Tooltip title="Delete Interview" arrow>
                            <Button
                                onClick={handleDelete}
                                sx={{
                                    minWidth: '30px',
                                    color: '#ffffff',
                                    borderRadius: "50%",
                                    '&:hover': {
                                        backgroundColor: '#ff5252',
                                    },
                                }}
                            >
                                <DeleteIcon />
                            </Button>
                        </Tooltip>
                    )}
                </Box>
            </ListItem>


            {/* Popup for viewing interview */}
            {isPopupOpen && (
                <ViewInterviewPopup
                    interviewId={interview._id}
                    onClose={handleClosePopup}
                />
            )}
        </>
    );
};

export default InterviewCard;
