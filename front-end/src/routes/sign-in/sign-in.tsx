import { useState } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-in logic here
    navigate('/characters');
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
          Sign in to your account
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button
              onClick={() => navigate('/')}
              sx={{ textTransform: 'none' }}
            >
              Already have an account? Login
            </Button>
            <Button
              onClick={() => navigate('/forgot-password')}
              sx={{ textTransform: 'none' }}
            >
              Forgot password?
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;
