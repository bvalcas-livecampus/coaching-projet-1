import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { 
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import { CalendarToday, EventAvailable, Add as AddIcon } from '@mui/icons-material';
import { fetcher } from '../../api/fetcher';
import { useNavigate } from 'react-router';

interface Tournament {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

const TournamentList: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await fetcher('/tournament');
        setTournaments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

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

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Tournaments
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/tournament/create')}
        >
          Create Tournament
        </Button>
      </Box>
      <Grid container spacing={3}>
        {tournaments.map((tournament) => (
          <Grid item xs={12} sm={6} md={4} key={tournament.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {tournament.name || `Tournament #${tournament.id}`}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Start: {format(new Date(tournament.start_date), 'MMMM d, yyyy')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventAvailable sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    End: {format(new Date(tournament.end_date), 'MMMM d, yyyy')}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary"
                  variant="contained"
                  fullWidth
                  onClick={() => window.location.href = `/tournament/${tournament.id}`}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TournamentList;
