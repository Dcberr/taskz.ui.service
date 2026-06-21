import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { CompletedPage } from '../pages/CompletedPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { TasksPage } from '../pages/TasksPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/tasks', element: <TasksPage /> },
      { path: '/completed', element: <CompletedPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
