import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  CircularProgress,
  Button,
  Paper,
  Grid
} from '@mui/material';
import { useParams, useNavigate } from 'react-router';
import { fetcher } from '../../api/fetcher';

interface Character {
  id: number;
  name: string;
  ilvl: number;
  rio: number;
  class_id: string;
  role_id: string;
}

const CharacterDetails: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { characterId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const data = await fetcher(`/characters/${characterId}`);
        setCharacter(data);
      } catch (err) {
        setError('Failed to load character details');
        console.error('Error fetching character:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]);

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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" component="h1">
          {character.name}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate(`/characters/${character.id}/edit`)}
        >
          Edit Character
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Class
            </Typography>
            <Typography variant="body1">
              {character.class_id}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Role
            </Typography>
            <Typography variant="body1">
              {character.role_id}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Item Level
            </Typography>
            <Typography variant="body1">
              {character.ilvl}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Raider.IO Score
            </Typography>
            <Typography variant="body1">
              {character.rio}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CharacterDetails; 