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
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Star as StarIcon } from '@mui/icons-material';
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
  members: Character[];
}

const CreateTeam: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    captain_id: null,
    members: []
  });
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCaptain, setSelectedCaptain] = useState<Character | null>(null);
  const [selectedMember, setSelectedMember] = useState<Character | null>(null);

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

  const handleAddMember = () => {
    if (selectedMember && !formData.members.some(member => member.id === selectedMember.id)) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, selectedMember]
      }));
      setSelectedMember(null);
    }
  };

  const handleRemoveMember = (characterId: number) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(member => member.id !== characterId),
      captain_id: prev.captain_id === characterId ? null : prev.captain_id
    }));
    if (selectedCaptain?.id === characterId) {
      setSelectedCaptain(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.captain_id) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const team = await fetcher(`/teams`, {
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

      const membersToAdd = formData.members.filter(member => member.id !== formData.captain_id);
      if (membersToAdd.length > 0) {
        await fetcher(`/teams/${team.id}/add-members`, {
          method: 'PUT',
          body: JSON.stringify({
            members: membersToAdd.map(member => ({ id: member.id }))
          })
        });
      }

      navigate(`/tournament/${tournamentId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const availableCharacters = characters.filter(
    char => !formData.members.some(member => member.id === char.id)
  );

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

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Autocomplete
                sx={{ flexGrow: 1 }}
                options={availableCharacters}
                value={selectedMember}
                onChange={(_, newValue) => setSelectedMember(newValue)}
                getOptionLabel={(character) => 
                  `${character.name} (Level ${character.ilvl})`
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Team Member"
                  />
                )}
              />
              <Button
                variant="contained"
                onClick={handleAddMember}
                disabled={!selectedMember}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Team Members
              </Typography>
              <List>
                {formData.members.map((member) => (
                  <React.Fragment key={member.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {member.name}
                            {member.id === formData.captain_id && (
                              <StarIcon sx={{ ml: 1, color: 'primary.main' }} />
                            )}
                          </Box>
                        }
                        secondary={`Level ${member.ilvl}`}
                      />
                      <ListItemSecondaryAction>
                        {member.id !== formData.captain_id && (
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedCaptain(member);
                              setFormData(prev => ({ ...prev, captain_id: member.id }));
                            }}
                          >
                            Make Captain
                          </Button>
                        )}
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Box>

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
                disabled={loading || !formData.captain_id}
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
