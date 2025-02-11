import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box,
  CircularProgress,
  Paper,
  Avatar,
  Chip,
  Alert
} from '@mui/material';
import { fetcher } from '../../api/fetcher';
import { useNavigate } from 'react-router';

interface Character {
  id: number;
  name: string;
  ilvl: number;
  class_id: string;
  role_id: string;
  player_id: number;
}

const Characters: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const data = await fetcher('/characters');
        setCharacters(data);
      } catch (err) {
        setError('Failed to load characters');
        console.error('Error fetching characters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Characters
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2}>
            {characters.map((character) => (
              <Grid item xs={12} sm={6} md={4} key={character.id}>
                <Paper 
                  sx={{ 
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                  onClick={() => navigate(`/characters/${character.id}`)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {character.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">
                        {character.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip 
                          size="small" 
                          label={`iLvl ${character.ilvl}`}
                        />
                        <Chip 
                          size="small" 
                          label={`Class ${character.class_id}`}
                        />
                        <Chip 
                          size="small" 
                          label={`Role ${character.role_id}`}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Characters;
