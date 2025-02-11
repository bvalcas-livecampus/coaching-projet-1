import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { fetcher } from '../../api/fetcher';

interface Character {
  id: number;
  name: string;
  ilvl: number;
  class_id: string;
  role_id: string;
}

interface FormData {
  name: string;
  captain_id: number | null;
}

const CreateTeam: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    captain_id: null
  });
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCaptain, setSelectedCaptain] = useState<Character | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const data = await fetcher('/characters');
        setCharacters(data);
      } catch (err) {
        setError('Failed to load characters. Please try again.');
      }
    };

    fetchCharacters();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.captain_id) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {

        console.log("formData", formData);
      await fetcher(`/teams`, {
        method: 'POST',
        body: JSON.stringify({
          tournament: {
            id: tournamentId
          },
          character: {
            id: formData.captain_id
          },
          team: {
            name: formData.name
          }
        })
      });

      navigate(`/tournament/${tournamentId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Team
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Team Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />

            <Autocomplete
              options={characters}
              getOptionLabel={(character) => 
                `${character.name} (Level ${character.ilvl})`
              }
              value={selectedCaptain}
              onChange={(_, newValue) => {
                setSelectedCaptain(newValue);
                setFormData({ ...formData, captain_id: newValue?.id || null });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Team Captain"
                  required
                  error={!formData.captain_id && Boolean(error)}
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/tournament/${tournamentId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                Create Team
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateTeam;
