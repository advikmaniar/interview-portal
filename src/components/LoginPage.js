import React, { useState } from 'react';
import { loginUser } from '../services/Authentication';
import { useNavigate } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Card, CardContent, Stack } from '@mui/material';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(username, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId) // Store JWT token in localStorage
      setErrorMessage('');
      console.log("Username: " + username)
      console.log('UserId:', response.userId);
      navigate('/dashboard');
    } catch (error) {
      const errorText = error?.message || error?.response?.data?.message || 'Something went wrong!';
      setErrorMessage(errorText);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
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
              Login
            </Typography>
            <form onSubmit={handleSubmit}>
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
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              {errorMessage && (
                <Typography
                  sx={{
                    marginTop: 2,
                    textAlign: 'center',
                    color: '#f44336',
                  }}
                >
                  {errorMessage}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#2196f3',
                  '&:hover': { backgroundColor: '#1976d2' },
                }}
              >
                Login
              </Button>
            </form>

            <Stack direction="row" justifyContent="center" spacing={2} sx={{ marginTop: 3 }}>
              <Button
                variant="text"
                onClick={handleRegisterRedirect}
                sx={{
                  color: '#90caf9',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1976d2',
                    color: 'white'
                  },
                }}
              >
                Forgot Password
              </Button>
              <Button
                variant="text"
                onClick={handleRegisterRedirect}
                sx={{
                  color: '#90caf9',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1976d2',
                    color: 'white'
                  },
                }}
              >
                Don't have an account? Register
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
