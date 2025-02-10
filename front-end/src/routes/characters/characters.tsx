import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  CircularProgress,
  Button,
  CardActions
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

  const handleEditCharacter = (characterId: number) => {
    navigate(`/characters/${characterId}/edit`);
  };

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
      <Typography variant="h3" component="h1" gutterBottom>
        Characters
      </Typography>
      
      <Grid container spacing={4}>
        {characters.map((character) => (
          <Grid item key={character.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {character.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    Class: {character.class_id}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Role: {character.role_id}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Level: {character.ilvl}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Player ID: {character.player_id}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => handleEditCharacter(character.id)}
                >
                  Edit Character
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Characters;
