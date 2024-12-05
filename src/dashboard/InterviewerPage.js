// import React from 'react';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, List, ListItem, ListItemText, IconButton, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const InterviewerPage = (userData) => {

  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [pastInterviews, setPastInterviews] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token for authentication
        const response = await axios.get('http://localhost:5000/interviews', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const interviews = response.data;
        const currentDate = new Date();

        // Separate interviews into upcoming and past
        const upcoming = interviews.filter(
          (interview) => new Date(interview.date) > currentDate
        );
        const past = interviews.filter(
          (interview) => new Date(interview.date) <= currentDate
        );

        setUpcomingInterviews(upcoming);
        setPastInterviews(past);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };

    fetchInterviews();
  }, []);

  const handleMenuOpen = (event, interviewId) => {
    setAnchorEl(event.currentTarget);
    setSelectedInterview(interviewId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInterview(null);
  };

  const handleStatusChange = (status) => {
    console.log(`Status changed to: ${status} for interview ID: ${selectedInterview}`);
    handleMenuClose();
    // Add your status change logic here (e.g., API call)
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        color: '#ffffff',
        borderRadius: 5,
        padding: 3,
      }}
    >
      {/* Upcoming Interviews */}
      <Container
        sx={{
          fontWeight: 'bold',
          borderRadius: 5,
          boxShadow: 5,
          padding: '10px',
          backgroundColor: '#1e1e1e',
          width: 600,
          marginBottom: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Upcoming Interviews
        </Typography>
        <List>
          {upcomingInterviews.length > 0 ? (
            upcomingInterviews.map((interview) => (
              <ListItem key={interview._id}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'left',
                    justifyItems: 'left',
                    backgroundColor: 'red',
                    color: '#ffffff',
                    borderRadius: 5,
                    width:'100%',
                  }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'left',
                      justifyItems: 'left',
                      backgroundColor: 'green',
                      boxShadow: 3,
                      borderRadius: 2
                    }}>
                    <ListItemText
                      primary={`${interview.role} at ${interview.company} - > ${new Date(interview.date).toLocaleString()}`}
                      // secondary={` ${new Date(interview.date).toLocaleString()}`}
                    />
                  </Box>
                  <Box
                    sx={{
                      marginLeft: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyItems: 'center',
                      height: '100%',
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(event) => handleMenuOpen(event, interview._id)}
                      sx={{
                        backgroundColor: 'grey',
                        color: '#ffffff',
                        borderRadius: '50%',
                        padding: '5px',
                        boxShadow:5,
                        ':hover': { backgroundColor: 'lightgrey' },
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedInterview === interview._id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleStatusChange('Completed')}>Completed</MenuItem>
                      <MenuItem onClick={() => handleStatusChange('Rescheduled')}>Rescheduled</MenuItem>
                      <MenuItem onClick={() => handleStatusChange('Cancelled')}>Cancelled</MenuItem>
                    </Menu>
                  </Box>
                </Box>

              </ListItem>
            ))
          ) : (
            <Typography>No upcoming interviews</Typography>
          )}
        </List>
      </Container>

      {/* Past Interviews */}
      <Container
        sx={{
          fontWeight: 'bold',
          borderRadius: 5,
          boxShadow: 5,
          padding: '20px',
          backgroundColor: '#1e1e1e',
          width: 'fit-content',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Past Interviews
        </Typography>
        <List>
          {pastInterviews.length > 0 ? (
            pastInterviews.map((interview) => (
              <ListItem key={interview._id}>
                <ListItemText
                  primary={`${interview.role} at ${interview.company}`}
                  secondary={`Date: ${new Date(interview.date).toLocaleString()}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography>No past interviews</Typography>
          )}
        </List>
      </Container>
    </Box>
  );
}

export default InterviewerPage;