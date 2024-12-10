import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Modal,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ScheduleInterviewPopup = ({ onClose }) => {
  const [candidates, setCandidates] = useState([]);
  const [date, setDate] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [interviewerId, setInterviewerId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
      });
        const candidates = response.data.filter(user => user.role === 'Candidate');
        console.log("Candidates: "+ candidates);
        setCandidates(candidates);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Get user ID from the token
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setInterviewerId(decodedToken.id);
    }

    fetchUsers();
    setLoading(false);
  }, []);

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

      const response = await axios.post('http://localhost:5000/api/interviews/interviews/schedule', interviewData, {
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
    <Modal
      open={true} 
      onClose={onClose}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        outline: 'none',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          width: { xs: '90%', sm: '60%', md: '40%' },
          maxHeight: '80%',
          overflowY: 'auto',
          p: 4,
        }}
      >
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
        <Typography variant="h5" gutterBottom align="center">
          Schedule an Interview
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
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
                type="submit"
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
            </Box>
          </form>
        )}
      </Paper>
    </Modal>
  );
};

export default ScheduleInterviewPopup;
