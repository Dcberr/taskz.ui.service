import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { CompletedPage } from '../pages/CompletedPage';
import { DashboardPage } from '../pages/DashboardPage';
import { MessageConsolePage } from '../pages/MessageConsolePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { TasksPage } from '../pages/TasksPage';
import { WorkflowDetailPage } from '../pages/WorkflowDetailPage';
import { WorkflowsPage } from '../pages/WorkflowsPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/tasks', element: <TasksPage /> },
      { path: '/workflows', element: <WorkflowsPage /> },
      { path: '/workflows/:workflowId', element: <WorkflowDetailPage /> },
      { path: '/messages/mock', element: <MessageConsolePage /> },
      { path: '/completed', element: <CompletedPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
