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
  DialogContentText,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Star as StarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Castle as CastleIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
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

interface DonjonDone {
  id: number;
  name: string;
  timer: number;
  completion_time: number;
}

interface Donjon {
  id: number;
  name: string;
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
  const [donjonsDone, setDonjonsDone] = useState<DonjonDone[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [openAddDonjonDialog, setOpenAddDonjonDialog] = useState(false);
  const [availableDonjons, setAvailableDonjons] = useState<Donjon[]>([]);
  const [selectedDonjon, setSelectedDonjon] = useState<string>('');
  const [timer, setTimer] = useState<string>('');

  const isTournamentActive = tournament && new Date(tournament.end_date) > new Date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, charactersData, tournamentData, donjonsData, allDonjons] = await Promise.all([
          fetcher(`/teams/${teamId}`),
          fetcher(`/teams/${teamId}/characters`),
          fetcher(`/tournament/${tournamentId}`),
          fetcher(`/donjons/team/${teamId}`),
          fetcher('/donjons')
        ]);
        setTeam(teamData);
        setCharacters(charactersData);
        setTournament(tournamentData);
        setDonjonsDone(donjonsData);
        setAvailableDonjons(allDonjons);
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddDonjonClick = () => {
    setOpenAddDonjonDialog(true);
  };

  const handleAddDonjonClose = () => {
    setOpenAddDonjonDialog(false);
    setSelectedDonjon('');
    setTimer('');
  };

  const handleAddDonjonSubmit = async () => {
    try {
      await fetcher(`/donjons/${selectedDonjon}/complete`, {
        method: 'POST',
        body: JSON.stringify({
          team: { id: team?.id },
          donjon: { id: selectedDonjon, timer: Number(timer) }
        }),
      });
      
      const newDonjon = await fetcher(`/donjons/${selectedDonjon}`);
      setDonjonsDone([...donjonsDone, { 
        ...newDonjon,
        completion_time: Number(timer)
      }]);
      
      handleAddDonjonClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add dungeon';
      setError(errorMessage);
    }
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

  const renderTeamMembers = () => (
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
  );
  const renderDonjonsDone = () => (
    <Box>
      {isTournamentActive && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddDonjonClick}
          sx={{ mb: 2 }}
        >
          Add Dungeon Run
        </Button>
      )}
      {donjonsDone.map((donjon) => (
        <Paper
          key={donjon.id}
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
            gap: 2
          }}
        >
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <CastleIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3">
              {donjon.name}
              {donjon.completion_time < donjon.timer && (
                <CheckCircleIcon 
                  sx={{ 
                    ml: 1,
                    color: 'success.main',
                    verticalAlign: 'middle'
                  }}
                />
              )}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip 
                size="small" 
                label={`Time: ${donjon.timer} minutes`}
              />
              <Chip 
                size="small" 
                label={`Completion Time: ${donjon.completion_time} minutes`}
              />
            </Box>
          </Box>
        </Paper>
      ))}
      {donjonsDone.length === 0 && (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No dungeons completed yet
        </Typography>
      )}
    </Box>
  );

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            {team.name || `Team #${team.id}`}
          </Typography>
          {isTournamentActive ? (
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
          ) : (
            <Typography variant="body2" color="text.secondary">
              Tournament has ended - team can no longer be modified
            </Typography>
          )}
        </Box>

        {tournament && (
          <Typography variant="body1" color="text.secondary">
            {tournament.name}
          </Typography>
        )}

        <Box sx={{ mt: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            <Tab 
              icon={<PeopleIcon />} 
              label="Team Members" 
              iconPosition="start"
            />
            <Tab 
              icon={<CastleIcon />} 
              label="Dungeons Completed" 
              iconPosition="start"
            />
          </Tabs>

          {activeTab === 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Team Members
              </Typography>
              {renderTeamMembers()}
            </>
          )}
          
          {activeTab === 1 && (
            <>
              <Typography variant="h6" gutterBottom>
                Dungeons Completed
              </Typography>
              {renderDonjonsDone()}
            </>
          )}
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

        <Dialog open={openAddDonjonDialog} onClose={handleAddDonjonClose}>
          <DialogTitle>Add Dungeon Run</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Dungeon</InputLabel>
                <Select
                  value={selectedDonjon}
                  onChange={(e) => setSelectedDonjon(e.target.value)}
                  label="Dungeon"
                >
                  {availableDonjons.map((donjon) => (
                    <MenuItem key={donjon.id} value={donjon.id}>
                      {donjon.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Time (minutes)"
                type="number"
                value={timer}
                onChange={(e) => setTimer(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddDonjonClose}>Cancel</Button>
            <Button 
              onClick={handleAddDonjonSubmit}
              disabled={!selectedDonjon || !timer}
              variant="contained"
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Team;
