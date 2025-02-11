import React from 'react';
import { useNavigate } from 'react-router';
import { 
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              '&:hover': {
                transform: 'scale(1.02)',
                transition: 'transform 0.2s ease-in-out'
              }
            }}
          >
            <CardActionArea onClick={() => navigate('/tournament')}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <EmojiEventsIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Tournaments
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  View and manage tournaments
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              '&:hover': {
                transform: 'scale(1.02)',
                transition: 'transform 0.2s ease-in-out'
              }
            }}
          >
            <CardActionArea onClick={() => navigate('/characters')}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <PersonIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Characters
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Browse and manage characters
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
