import React, { useState } from 'react';
import { Box, Container, TextField, Typography, Button, Card, CardContent, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { registerUser } from '../services/Authentication';
import { useNavigate } from 'react-router-dom';


const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState({ month: '', day: '', year: '' });
  const handleDobChange = (field, value) => {
    setDob((prev) => ({ ...prev, [field]: value }));
  };
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    try {
      await registerUser(firstName, lastName, email, password, username, dob, role);
      setMessage('Registration successful! Redirecting to login page...');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setUsername('');
      setRole('');
      setDob('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage(error.message || 'Registration failed');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: '#ffffff',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            backgroundColor: '#1f1f1f',
            borderRadius: 4,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                textAlign: 'center',
                marginBottom: 3,
                fontWeight: 'bold',
                color: '#e0e0e0',
              }}
            >
              Register
            </Typography>
            <form onSubmit={handleRegister}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                type="email"
                label="Email"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                type="password"
                label="Choose a password"
                variant="outlined"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                type="password"
                label="Confirm your password"
                variant="outlined"
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <Typography sx={{ marginBottom: 1, color: '#e0e0e0' }} component="p">
                What is your date of birth?
              </Typography>
              <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#9e9e9e' }}>Month</InputLabel>
                  <Select
                    value={dob.month}
                    onChange={(e) => handleDobChange('month', e.target.value)}
                    fullWidth
                    sx={{
                      color: '#e0e0e0',
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2196f3' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2196f3' },
                    }}
                  >
                    {months.map((month, index) => (
                      <MenuItem key={index} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#9e9e9e' }}>Day</InputLabel>
                  <Select
                    value={dob.day}
                    onChange={(e) => handleDobChange('day', e.target.value)}
                    fullWidth
                    sx={{
                      color: '#e0e0e0',
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2196f3' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2196f3' },
                    }}
                  >
                    {days.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#9e9e9e' }}>Year</InputLabel>
                  <Select
                    value={dob.year}
                    onChange={(e) => handleDobChange('year', e.target.value)}
                    fullWidth
                    sx={{
                      color: '#e0e0e0',
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2196f3' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2196f3' },
                    }}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Typography
                sx={{ marginBottom: 1, color: '#e0e0e0' }}
                component="p"
              >
                Are you here to interview or get interviewed?
              </Typography>
              <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
                <Button
                  variant={role === 'Interviewer' ? 'contained' : 'outlined'}
                  onClick={() => setRole('Interviewer')}
                  sx={{
                    backgroundColor: role === 'Interviewer' ? '#2196f3' : 'transparent',
                    border: role === 'Interviewer' ? '2px solid #1976d2' : '2px solid #2196f3',
                    color: role === 'Interviewer' ? '#fff' : '#2196f3',
                    '&:hover': {
                      backgroundColor: role === 'Interviewer' ? '#1976d2' : 'rgba(33, 150, 243, 0.1)',
                      borderColor: role === 'Interviewer' ? '#1565c0' : '#1976d2',
                    },
                  }}
                >
                  Interviewer
                </Button>
                <Button
                  variant={role === 'Candidate' ? 'contained' : 'outlined'}
                  onClick={() => setRole('Candidate')}
                  sx={{
                    backgroundColor: role === 'Candidate' ? '#2196f3' : 'transparent',
                    border: role === 'Candidate' ? '2px solid #1976d2' : '2px solid #2196f3',
                    color: role === 'Candidate' ? '#fff' : '#2196f3',
                    '&:hover': {
                      backgroundColor: role === 'Candidate' ? '#1976d2' : 'rgba(33, 150, 243, 0.1)',
                      borderColor: role === 'Candidate' ? '#1565c0' : '#1976d2',
                    },
                  }}
                >
                  Candidate
                </Button>
              </Stack>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#2196f3',
                  '&:hover': { backgroundColor: '#1976d2' },
                }}
              >
                Register
              </Button>
            </form>

            {message && (
              <Typography
                sx={{
                  marginTop: 2,
                  textAlign: 'center',
                  color: message.includes('successful') ? '#4caf50' : '#f44336',
                }}
              >
                {message}
              </Typography>
            )}
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ marginTop: 3 }}>
              <Button
                variant="text"
                onClick={handleBackToLogin}
                sx={{
                  color: '#90caf9',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1976d2',
                    color: 'white',
                  },
                }}
              >
                Back to Login
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default RegistrationPage;
