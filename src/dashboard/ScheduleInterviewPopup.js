import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  TextareaAutosize,
} from '@mui/material';

const ScheduleInterviewPopup = ({ onClose }) => {
  const [candidates, setCandidates] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [date, setDate] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [interviewerId, setInterviewerId] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        console.log(response.data);
        const candidates = response.data.filter(user => user.role === 'Candidate');
        // const interviewers = response.data.filter(user => user.role === 'Interviewer');
        setCandidates(candidates);
        // setInterviewers(interviewers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
     // Get user ID
     const token = localStorage.getItem('token');
     if (token) {
       const decodedToken = jwtDecode(token);
       console.log("UserId: "+ decodedToken.id);
       setInterviewerId(decodedToken.id);
     }

    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const interviewData = {
        date,
        candidateId,
        interviewerId,
        company,
        role,
        description,
      };

      const response = await axios.post('http://localhost:5000/interviews/schedule', interviewData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 201) {
        onClose();
      }
    } catch (error) {
      setError('Error scheduling interview. Please try again.');
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          position: 'relative',
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Schedule an Interview
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Date and Time"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth required>
              <InputLabel id="candidate-label">Candidate</InputLabel>
              <Select
                labelId="candidate-label"
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select Candidate</em>
                </MenuItem>
                {candidates.map((candidate) => (
                  <MenuItem key={candidate._id} value={candidate._id}>
                    {candidate.firstName} {candidate.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {/* <Box sx={{ mb: 3 }}>
            <FormControl fullWidth required>
              <InputLabel id="interviewer-label">Interviewer</InputLabel>
              <Select
                labelId="interviewer-label"
                value={interviewerId}
                onChange={(e) => setInterviewerId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select Interviewer</em>
                </MenuItem>
                {interviewers.map((interviewer) => (
                  <MenuItem key={interviewer._id} value={interviewer._id}>
                    {interviewer.firstName} {interviewer.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box> */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextareaAutosize
              minRows={3}
              placeholder="Description"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type='submit'
              variant="contained"
              color="primary"
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                borderRadius: '8px',
                padding: '10px 20px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#2196f3',
                ':hover': {
                  backgroundColor: '#1976d2',
                  boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <Typography variant="button" color="inherit">
                Schedule Interview
              </Typography>
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              sx={{ textTransform: 'none' }}
            >
              Close
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default ScheduleInterviewPopup;
