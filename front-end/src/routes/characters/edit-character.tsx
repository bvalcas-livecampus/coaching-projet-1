import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box,
  CircularProgress,
  Paper
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { fetcher } from '../../api/fetcher';

interface Character {
  id: number;
  name: string;
  ilvl: number;
  class_id: string;
  role_id: string;
}

const EditCharacter: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const data = await fetcher(`/characters/${characterId}`);
        setCharacter(data);
        setNewName(data.name);
      } catch (err) {
        setError('Failed to load character');
        console.error('Error fetching character:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetcher(`/characters/${characterId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: newName }),
      });
      navigate('/characters');

    } catch (err) {
      setError('Failed to update character');
      console.error('Error updating character:', err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !character) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error" variant="h6">{error || 'Character not found'}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Character
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Character Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!newName.trim() || newName === character.name}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditCharacter;
