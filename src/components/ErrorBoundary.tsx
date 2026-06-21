import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import type { ErrorInfo, ReactNode } from 'react';
import React from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error boundary caught an error.', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3, bgcolor: 'background.default' }}>
          <Paper sx={{ p: 4, maxWidth: 560, width: '100%' }}>
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight={800}>
                Something went wrong
              </Typography>
              <Alert severity="error">{this.state.error?.message ?? 'An unexpected error occurred.'}</Alert>
              <Button variant="contained" onClick={() => window.location.reload()}>
                Reload app
              </Button>
            </Stack>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
