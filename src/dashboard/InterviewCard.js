import React, { useState } from 'react';
import { Box, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ViewInterviewPopup from './ViewInterviewPopup'; // Import the popup

const InterviewCard = ({ interview, onEdit }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // const handleOpenPopup = () => {
    //     setIsPopupOpen(true);
    // };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleTogglePopup = () => {
        setIsPopupOpen((prev) => !prev);
      };

    return (
        <>
            <ListItem
                sx={{ paddingLeft: 0, paddingRight: 0, margin: 0 }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#424B52',
                        color: '#ffffff',
                        borderRadius: 5,
                        width: '100%',
                        p: "0px 20px",
                        '&:hover': {
                            backgroundColor: '#5A676D',
                            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                            transform: "translateY(-2px)",
                        },
                        cursor: 'pointer', 
                    }}
                >
                    <ListItemText
                        button
                        onClick={handleTogglePopup}
                        primaryTypographyProps={{
                            sx: { fontSize: '0.9rem', margin: 0 },
                        }}
                        secondaryTypographyProps={{
                            sx: { fontSize: '0.8rem', margin: 0 },
                        }}
                        primary={`${interview.role} at ${interview.company}`}
                        secondary={`Candidate: ${interview.candidateId.firstName} ${interview.candidateId.lastName}`}
                    />
                    <IconButton onClick={() => onEdit(interview)}>
                        <EditIcon sx={{ color: '#ffffff' }} />
                    </IconButton>
                </Box>
            </ListItem>
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
