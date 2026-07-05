import { Alert, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type StateShellProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: StateShellProps) {
  return (
    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2.5, bgcolor: '#ffffff' }}>
      <Stack spacing={2.25} alignItems="flex-start">
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
        {action}
      </Stack>
    </Paper>
  );
}

export function ErrorState({ title, description, action }: StateShellProps) {
  return (
    <Alert severity="error" action={action}>
      <Typography variant="subtitle1" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="body2">{description}</Typography>
    </Alert>
  );
}

export function LoadingState({ title, description }: StateShellProps) {
  return (
    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2.5, bgcolor: '#ffffff' }}>
      <Stack spacing={2.25} alignItems="center">
        <CircularProgress />
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary" textAlign="center">
          {description}
        </Typography>
      </Stack>
    </Paper>
  );
}
