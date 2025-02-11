import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fetcher } from '../../api/fetcher';

const CreateTournament: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [costToRegistry, setCostToRegistry] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !startDate || !endDate || costToRegistry === undefined || !description) {
      setError('Please fill in all fields');
      return;
    }

    if (endDate <= startDate) {
      setError('End date must be after start date');
      return;
    }

    if (costToRegistry < 0) {
      setError('Registration cost cannot be negative');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const tournamentData = {
        name,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        cost_to_registry: costToRegistry,
        description
      };

      const response = await fetcher('/tournament', {
        method: 'POST',
        body: JSON.stringify(tournamentData),
      });

      navigate('/tournament');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the tournament');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Tournament
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Tournament Name"
            name="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Tournament Description"
            name="description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="costToRegistry"
            label="Registration Cost"
            name="costToRegistry"
            type="number"
            inputProps={{ min: 0 }}
            value={costToRegistry}
            onChange={(e) => setCostToRegistry(Number(e.target.value))}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              sx={{ mt: 2, width: '100%' }}
              minDate={new Date()}
            />

            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              sx={{ mt: 2, width: '100%' }}
              minDate={startDate || new Date()}
            />
          </LocalizationProvider>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Tournament'}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/tournament')}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateTournament;
