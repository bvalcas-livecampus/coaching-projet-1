import { useState } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    // Usually sends a reset link to the user's email
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Link
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
              onClick={() => navigate('/')}
              sx={{ textTransform: 'none' }}
            >
              Back to Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default ForgotPassword;
