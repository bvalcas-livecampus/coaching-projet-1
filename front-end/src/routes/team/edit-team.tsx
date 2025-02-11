import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Container,
  Paper,
  Typography,
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
  Divider,
  TextField
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

interface Team {
  id: number;
  name: string;
  captain_id: number;
  registered_id: number;
}

const EditTeam: React.FC = () => {
  const { tournamentId, teamId } = useParams<{ tournamentId: string; teamId: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<Character[]>([]);
  const [availableCharacters, setAvailableCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Character | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, membersData, allCharacters] = await Promise.all([
          fetcher(`/teams/${teamId}`),
          fetcher(`/teams/${teamId}/characters`),
          fetcher('/characters')
        ]);
        
        setTeam(teamData);
        setTeamMembers(membersData);
        setAvailableCharacters(
          allCharacters.filter((char: Character) => 
            !membersData.some((member: Character) => member.id === char.id)
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load team data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId]);

  const handleAddMember = async () => {
    if (!selectedMember || !team) return;

    setSaving(true);
    try {
      await fetcher(`/teams/${team.id}/add-members`, {
        method: 'PUT',
        body: JSON.stringify({
          members: [{ id: selectedMember.id }]
        })
      });

      setTeamMembers(prev => [...prev, selectedMember]);
      setAvailableCharacters(prev => 
        prev.filter(char => char.id !== selectedMember.id)
      );
      setSelectedMember(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add team member');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (characterId: number) => {
    if (!team) return;

    // Don't allow removing the captain
    if (characterId === team.captain_id) {
      setError("Cannot remove the team captain");
      return;
    }

    setSaving(true);
    try {
      await fetcher(`/teams/${teamId}/remove-member`, {
        method: 'PUT',
        body: JSON.stringify({
          character_id: characterId
        })
      });

      const removedMember = teamMembers.find(member => member.id === characterId);
      if (removedMember) {
        setTeamMembers(prev => prev.filter(member => member.id !== characterId));
        setAvailableCharacters(prev => [...prev, removedMember]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove team member');
    } finally {
      setSaving(false);
    }
  };

  const handleMakeCaptain = async (characterId: number) => {
    if (!team) return;

    setSaving(true);
    try {
      await fetcher(`/teams/${teamId}`, {
        method: 'PUT',
        body: JSON.stringify({
          captain_id: characterId
        })
      });

      setTeam(prev => prev ? { ...prev, captain_id: characterId } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update team captain');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!team) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Team not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Team: {team.name}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
              disabled={!selectedMember || saving}
              startIcon={saving ? <CircularProgress size={20} /> : <AddIcon />}
            >
              Add
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Team Members
            </Typography>
            <List>
              {teamMembers.map((member) => (
                <React.Fragment key={member.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {member.name}
                          {member.id === team.captain_id && (
                            <StarIcon sx={{ ml: 1, color: 'primary.main' }} />
                          )}
                        </Box>
                      }
                      secondary={`Level ${member.ilvl}`}
                    />
                    <ListItemSecondaryAction>
                      {member.id !== team.captain_id && (
                        <>
                          <Button
                            size="small"
                            onClick={() => handleMakeCaptain(member.id)}
                            disabled={saving}
                          >
                            Make Captain
                          </Button>
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={saving}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
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
              onClick={() => navigate(`/tournament/${tournamentId}/team/${teamId}`)}
              disabled={saving}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditTeam; 