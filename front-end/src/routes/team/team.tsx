import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { Star as StarIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetcher } from '../../api/fetcher';

interface Character {
  id: number;
  name: string;
  role_id: number;
  class_id: number;
  ilvl: number;
  rio: number;
}

interface Team {
  id: number;
  name: string;
  captain_id: number;
  registered_id: number;
}

interface Tournament {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  cost_to_registry: number;
  description: string;
}

const Team: React.FC = () => {
  const { tournamentId, teamId } = useParams<{ tournamentId: string; teamId: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, charactersData, tournamentData] = await Promise.all([
          fetcher(`/teams/${teamId}`),
          fetcher(`/teams/${teamId}/characters`),
          fetcher(`/tournament/${tournamentId}`)
        ]);
        setTeam(teamData);
        setCharacters(charactersData);
        setTournament(tournamentData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tournamentId, teamId]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetcher(`/teams/${teamId}`, {
        method: 'DELETE',
      });
      navigate(`/tournament/${tournamentId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete team';
      setError(errorMessage);
    }
    setOpenDeleteDialog(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );
  }

  if (!team) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Team not found</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            {team.name || `Team #${team.id}`}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              component={Link}
              to={`/tournament/${tournamentId}/team/${teamId}/edit`}
            >
              Edit Team
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
            >
              Remove Team
            </Button>
          </Box>
        </Box>

        {tournament && (
          <Typography variant="body1" color="text.secondary">
            {tournament.name}
          </Typography>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Team Members
          </Typography>
          <Box>
            {characters.map((character) => (
              <Paper
                key={character.id}
                sx={{
                  mb: 2,
                  p: 2,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateX(8px)',
                    boxShadow: 3,
                    bgcolor: 'action.hover'
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  border: character.id === team.captain_id ? 2 : 0,
                  borderColor: 'primary.main'
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {character.name.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3">
                    {character.name}
                    {character.id === team.captain_id && (
                      <StarIcon 
                        sx={{ 
                          ml: 1, 
                          color: 'primary.main',
                          verticalAlign: 'middle'
                        }} 
                      />
                    )}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip 
                      size="small" 
                      label={`iLvl ${character.ilvl}`}
                    />
                    <Chip 
                      size="small" 
                      label={`RIO ${character.rio}`}
                    />
                  </Box>
                </Box>
                <Button 
                  color="primary"
                  variant="contained"
                  onClick={() => navigate(`/characters/${character.id}`)}
                  sx={{ minWidth: 100 }}
                >
                  View Details
                </Button>
              </Paper>
            ))}
          </Box>
        </Box>

        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Delete Team</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this team? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Team;
