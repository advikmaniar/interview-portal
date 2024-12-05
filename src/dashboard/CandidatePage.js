import React from 'react';
import { Typography} from '@mui/material';
import { Container } from '@mui/system';


const CandidatePage = (userData) => {

    return (
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
    )
}

export default CandidatePage;