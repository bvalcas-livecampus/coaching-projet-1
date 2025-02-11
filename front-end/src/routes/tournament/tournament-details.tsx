import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { format } from 'date-fns';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Divider
} from '@mui/material';
import { CalendarToday, EventAvailable } from '@mui/icons-material';
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
        <Typography variant="h4" component="h1" gutterBottom>
          {tournament.name || `Tournament #${tournament.id}`}
        </Typography>
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
                <Grid container spacing={2}>
                  {teams.map((team) => (
                    <Grid item xs={12} sm={6} md={4} key={team.id}>
                      <Link 
                        to={`/tournament/${tournamentId}/team/${team.id}`} 
                        style={{ textDecoration: 'none' }}
                      >
                        <Paper 
                          sx={{ 
                            p: 2,
                            '&:hover': {
                              backgroundColor: 'action.hover',
                              cursor: 'pointer'
                            }
                          }}
                        >
                          <Typography variant="subtitle1">
                            Team: {team.name || `Team #${team.id}`}
                          </Typography>
                          {captains[team.captain_id] && (
                            <Typography variant="body2" color="text.secondary">
                              Captain: {captains[team.captain_id].name}
                            </Typography>
                          )}
                        </Paper>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TournamentDetails; 