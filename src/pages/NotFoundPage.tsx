import { Button, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Stack alignItems="center" justifyContent="center" minHeight="60vh" spacing={2}>
      <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 480 }}>
        <Typography variant="h4" gutterBottom>
          Page not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The page you requested does not exist.
        </Typography>
        <Button component={RouterLink} to="/dashboard" variant="contained">
          Go to Dashboard
        </Button>
      </Paper>
    </Stack>
  );
}
