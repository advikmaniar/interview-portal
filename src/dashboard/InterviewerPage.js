import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, List, Divider, Button } from '@mui/material';
import axios from 'axios';
import InterviewCard from './InterviewCard';
import { CustomButton } from '../utils/utils';
import { alpha, styled, useTheme } from "@mui/material/styles";

const InterviewerPage = () => {
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [pastInterviews, setPastInterviews] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/interviews/interviews', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const interviews = response.data;
        const currentDate = new Date();

        const updatedInterviews = interviews.map((interview) => {
          const interviewDate = new Date(interview.date);
          if (interviewDate < currentDate && interview.status !== 'Completed' && interview.status !== 'Cancelled') {
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

        const past = interviews
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

  const handleEditButtonClick = (interview) => {
    console.log("Edit Button Clicked for interview:", interview);
  };

  const handleDeleteInterview = (interviewId) => {
    setPastInterviews((prevPastInterviews) =>
      prevPastInterviews.filter((interview) => interview._id !== interviewId)
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        color: '#ffffff',
        borderRadius: 5,
        padding: 0,
      }}
    >
      {/* Upcoming Interviews */}
      <Container
        sx={{
          fontWeight: 'bold',
          borderRadius: 5,
          boxShadow: 5,
          // backgroundColor: '#24272B',
          backgroundColor: alpha(theme.palette.background.default, 0.5),
          color: theme.palette.mode === "dark" ? "white" : "black",
          marginBottom: 0.5,
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',

          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: 'transparent',
            alignItems: 'center',
            width: '100%',
            borderRadius: 5,
            position: 'relative',
            zIndex: 1000,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1000,
              padding: '10px',
            }}
          >
            Upcoming Interviews
          </Typography>
          <CustomButton
            onClick={() => console.log('View All Clicked')}
            text={'View All'}
          >
          </CustomButton>

        </Box>
        <Divider sx={{ marginTop: 0, marginBottom: 0 }} />
        <List
          sx={{
            maxHeight: upcomingInterviews.length >= 4 ? 300 : 'none',
            overflowY: upcomingInterviews.length >= 4 ? 'auto' : 'visible',
            '&::-webkit-scrollbar': {
              width: '6px',
              backgroundColor: '#1e1e1e',
              borderRadius: '30%',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#555',
              borderRadius: '50%',
              border: '2px solid #333',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#222',
              borderRadius: '50%',
            },
            maxHeight: 'calc(300px - 40px)',
            padding: "0px 0px 10px 0px"
          }}
        >
          {upcomingInterviews.length > 0 ? (
            upcomingInterviews.map((interview) => (
              <InterviewCard
                key={interview._id}
                interview={interview}
                onEdit={handleEditButtonClick}
                isPastInterview={false}
              />
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
          // backgroundColor: '#24272B',
          backgroundColor: alpha(theme.palette.background.default, 0.5),
          color: theme.palette.mode === "dark" ? "white" : "black",
          marginBottom: 0.5,
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',

          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            position: 'relative',
            zIndex: 1000,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1000,
              padding: '10px',
            }}
          >
            Past Interviews
          </Typography>
          <CustomButton
            onClick={() => console.log('View All Clicked')}
            text={'View All'}
          >
          </CustomButton>
        </Box>
        <Divider sx={{ marginTop: 0, marginBottom: 0 }} />
        <List
          disablePadding
          sx={{
            maxHeight: pastInterviews.length >= 4 ? 300 : 'none',
            overflowY: pastInterviews.length >= 4 ? 'auto' : 'visible',
            '&::-webkit-scrollbar': {
              width: '6px',
              backgroundColor: '#1e1e1e',
              borderRadius: '30%',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#555',
              borderRadius: '50%',
              border: '2px solid #333',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#222',
            },
            maxHeight: 'calc(300px - 40px)',
          }}
        >
          {pastInterviews.length > 0 ? (
            pastInterviews.map((interview) => (
              <InterviewCard
                key={interview._id}
                interview={interview}
                onEdit={handleEditButtonClick}
                isPastInterview={true}
                onDelete={handleDeleteInterview}
              />
            ))
          ) : (
            <Typography>No past interviews</Typography>
          )}
        </List>
      </Container>
    </Box>
  );
};

export default InterviewerPage;
