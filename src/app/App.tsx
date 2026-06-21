import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ToastProvider } from '../components/ToastProvider';
import { queryClient } from './queryClient';
import { router } from './router';
import { taskzTheme } from './theme';

export function App() {
  return (
    <ThemeProvider theme={taskzTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ErrorBoundary>
            <RouterProvider router={router} />
          </ErrorBoundary>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
