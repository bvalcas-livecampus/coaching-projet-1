import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { format } from 'date-fns';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { CalendarToday, EventAvailable, Edit as EditIcon, Delete as DeleteIcon, GroupAdd as GroupAddIcon } from '@mui/icons-material';
import { fetcher } from '../../api/fetcher';

interface Tournament {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  cost_to_registry: number;
  description: string;
}

interface Team {
  id: number;
  name: string;
  captain_id: number;
  registered_id: number;
}

interface Captain {
  id: number;
  name: string;
}

const TournamentDetails: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [teamsError, setTeamsError] = useState<string | null>(null);
  const [captains, setCaptains] = useState<Record<number, Captain>>({});
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tournamentData = await fetcher(`/tournament/${tournamentId}`);
        setTournament(tournamentData);
        
        const teamsData = await fetcher(`/tournament/${tournamentId}/teams`);
        setTeams(teamsData);

        // Fetch captain details and create a mapping
        const captainsMap: Record<number, Captain> = {};
        await Promise.all(
          teamsData.map(async (team: Team) => {
            const captainData = await fetcher(`/characters/${team.captain_id}`);
            captainsMap[team.captain_id] = captainData;
          })
        );
        setCaptains(captainsMap);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        setTeamsError(errorMessage);
      } finally {
        setLoading(false);
        setTeamsLoading(false);
      }
    };

    fetchData();
  }, [tournamentId]);

  const handleDelete = async () => {
    try {
      await fetcher(`/tournament/${tournamentId}`, {
        method: 'DELETE',
      });
      navigate('/tournament');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the tournament');
    }
    setDeleteDialogOpen(false);
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

  if (!tournament) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Tournament not found</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            {tournament.name || `Tournament #${tournament.id}`}
          </Typography>
          <Box>
            {new Date(tournament.end_date) > new Date() && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/tournament/${tournamentId}/team/create`}
                  startIcon={<GroupAddIcon />}
                  sx={{ mr: 2 }}
                >
                  Create Team
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/tournament/${tournamentId}/edit`}
                  startIcon={<EditIcon />}
                  sx={{ mr: 2 }}
                >
                  Edit Tournament
                </Button>
              </>
            )}
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Tournament
            </Button>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarToday sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body1">
                  {format(new Date(tournament.start_date), 'MMMM d, yyyy')}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EventAvailable sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  End Date
                </Typography>
                <Typography variant="body1">
                  {format(new Date(tournament.end_date), 'MMMM d, yyyy')}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Registration Cost
                </Typography>
                <Typography variant="body1">
                  ${tournament.cost_to_registry.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {tournament.description}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Registered Teams
              </Typography>
              {teamsLoading ? (
                <CircularProgress size={24} />
              ) : teamsError ? (
                <Alert severity="error">Error loading teams: {teamsError}</Alert>
              ) : teams.length === 0 ? (
                <Typography color="text.secondary">No teams registered yet</Typography>
              ) : (
                <Box>
                  {teams.map((team) => (
                    <Paper
                      key={team.id}
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
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box>
                        <Typography variant="h6" component="h3">
                          {team.name || `Team #${team.id}`}
                        </Typography>
                        {captains[team.captain_id] && (
                          <Typography variant="body2" color="text.secondary">
                            Captain: {captains[team.captain_id].name}
                          </Typography>
                        )}
                      </Box>
                      <Button 
                        color="primary"
                        variant="contained"
                        component={Link}
                        to={`/tournament/${tournamentId}/team/${team.id}`}
                        sx={{ minWidth: 100 }}
                      >
                        View Team
                      </Button>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Tournament</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this tournament? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default TournamentDetails; 