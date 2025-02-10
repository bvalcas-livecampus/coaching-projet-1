import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router';
import { fetcher } from '../../api/fetcher';

const CreateCharacter: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetcher('/characters', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      navigate('/characters');
    } catch (err) {
      setError('Failed to create character');
      console.error('Error creating character:', err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Character
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Character Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!name.trim()}
            >
              Create Character
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/characters')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateCharacter;
