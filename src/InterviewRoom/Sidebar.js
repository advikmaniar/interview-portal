import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import axios from 'axios';

const Sidebar = ({ candidateId }) => {
    console.log("CandidateID: "+candidateId);
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);  // Track loading state
    const [error, setError] = useState(null);      // Track error state

    useEffect(() => {
        const fetchCandidateDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/candidate/${candidateId}`);
                setCandidate(response.data);
                setLoading(false);  // Set loading to false when data is fetched
            } catch (error) {
                setError('Error fetching candidate details.'); // Handle error
                setLoading(false);
            }
        };

        fetchCandidateDetails();
    }, [candidateId]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>;  // Display a loading spinner
    }

    if (error) {
        return <Typography sx={{ color: 'red' }}>{error}</Typography>; // Display error message
    }

    if (!candidate) {
        return <Typography>No candidate data available.</Typography>; // In case there's no candidate data
    }

    return (
        <Box sx={{ width: '300px', padding: 2, boxShadow: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6">Candidate Profile</Typography>
            <Divider sx={{ marginY: 1 }} />
            <Typography variant="subtitle1">
                {candidate.firstName} {candidate.lastName}
            </Typography>
            <List>
                <Typography variant="body1">Education:</Typography>
                {candidate.education && candidate.education.length > 0 ? (
                    candidate.education.map((edu, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={`${edu.degree}, ${edu.institution}`} secondary={`Year: ${edu.year}`} />
                        </ListItem>
                    ))
                ) : (
                    <Typography>No education details available.</Typography>
                )}
                <Typography variant="body1">Experience:</Typography>
                {candidate.experience && candidate.experience.length > 0 ? (
                    candidate.experience.map((exp, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={`${exp.role}, ${exp.company}`} secondary={`Years: ${exp.years}`} />
                        </ListItem>
                    ))
                ) : (
                    <Typography>No experience details available.</Typography>
                )}
                <Typography variant="body1">Skills:</Typography>
                {candidate.skills && candidate.skills.length > 0 ? (
                    candidate.skills.map((skill, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={skill} />
                        </ListItem>
                    ))
                ) : (
                    <Typography>No skills listed.</Typography>
                )}
                <Typography variant="body1">Certifications:</Typography>
                {candidate.certifications && candidate.certifications.length > 0 ? (
                    candidate.certifications.map((cert, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={cert.title} secondary={`${cert.issuedBy}, ${cert.year}`} />
                        </ListItem>
                    ))
                ) : (
                    <Typography>No certifications available.</Typography>
                )}
                <Typography variant="body1">Projects:</Typography>
                {candidate.projects && candidate.projects.length > 0 ? (
                    candidate.projects.map((proj, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={proj.title} secondary={proj.description} />
                        </ListItem>
                    ))
                ) : (
                    <Typography>No projects listed.</Typography>
                )}
            </List>
        </Box>
    );
};

export default Sidebar;
