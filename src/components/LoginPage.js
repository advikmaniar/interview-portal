import React, { useState } from 'react';
import { loginUser } from '../services/Authentication'; 
import { useNavigate } from 'react-router-dom'; 
import { Container, Box, TextField, Button, Grid, Typography, Paper } from '@mui/material'; 
import { styled } from '@mui/system'; 

const PaperContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
}));

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      console.log("Response: "+response.data)
      localStorage.setItem('token', response.token); // Store JWT token in localStorage
      setErrorMessage('');
      console.log("Email: "+email)
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
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <PaperContainer>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            {errorMessage && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2" align="center">
                  {errorMessage}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1 }}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
        <Button
          onClick={handleRegisterRedirect}
          fullWidth
          variant="text"
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </PaperContainer>
    </Container>
  );
};

export default LoginPage;
