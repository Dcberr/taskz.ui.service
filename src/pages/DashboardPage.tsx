import { Box, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { DashboardCardGrid } from '../features/dashboard/components/DashboardCardGrid';
import { DashboardCharts } from '../features/dashboard/components/DashboardCharts';
import { DashboardTaskList } from '../features/dashboard/components/DashboardTaskList';
import { useDashboardTasks } from '../features/dashboard/hooks/useDashboardTasks';
import type { DashboardSummary } from '../types/dashboard';
import type { Task } from '../types/task';
import { useAppTitle } from '../hooks/useAppTitle';
import { getApiErrorMessage } from '../api/errors';

export function DashboardPage() {
  useAppTitle('Task | Dashboard');

  const openTasksQuery = useDashboardTasks('open');
  const completedTasksQuery = useDashboardTasks('completed');

  const summary = useMemo<DashboardSummary>(
    () => ({
      openTasks: openTasksQuery.data?.length ?? 0,
      completedTasks: completedTasksQuery.data?.length ?? 0,
      blockedTasks: (openTasksQuery.data ?? []).filter((task) => task.status === 'BLOCKED').length,
      urgentTasks: (openTasksQuery.data ?? []).filter((task) => task.priority === 'URGENT').length,
    }),
    [completedTasksQuery.data, openTasksQuery.data],
  );

  const recentTasks: Task[] = useMemo(() => {
    const source = [...(openTasksQuery.data ?? []), ...(completedTasksQuery.data ?? [])];
    return source
      .slice()
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .slice(0, 5);
  }, [completedTasksQuery.data, openTasksQuery.data]);

  const upcomingDeadlines: Task[] = useMemo(() => {
    return (openTasksQuery.data ?? [])
      .filter((task) => task.dueDate)
      .slice()
      .sort((left, right) => String(left.dueDate).localeCompare(String(right.dueDate)))
      .slice(0, 5);
  }, [openTasksQuery.data]);

  const allTasks = useMemo(() => [...(openTasksQuery.data ?? []), ...(completedTasksQuery.data ?? [])], [
    completedTasksQuery.data,
    openTasksQuery.data,
  ]);

  const statusDistribution = useMemo(
    () => [
      { label: 'Open', value: allTasks.filter((task) => task.status === 'OPEN').length, color: '#0f766e' },
      { label: 'In Progress', value: allTasks.filter((task) => task.status === 'IN_PROGRESS').length, color: '#2563eb' },
      { label: 'Blocked', value: allTasks.filter((task) => task.status === 'BLOCKED').length, color: '#f97316' },
      { label: 'Completed', value: allTasks.filter((task) => task.status === 'COMPLETED').length, color: '#16a34a' },
      { label: 'Other', value: allTasks.filter((task) => !['OPEN', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED'].includes(task.status)).length, color: '#64748b' },
    ],
    [allTasks],
  );

  const priorityDistribution = useMemo(
    () => [
      { label: 'Urgent', value: allTasks.filter((task) => task.priority === 'URGENT').length, color: '#dc2626' },
      { label: 'High', value: allTasks.filter((task) => task.priority === 'HIGH').length, color: '#f97316' },
      { label: 'Medium', value: allTasks.filter((task) => task.priority === 'MEDIUM').length, color: '#0f766e' },
      { label: 'Low', value: allTasks.filter((task) => task.priority === 'LOW').length, color: '#64748b' },
    ],
    [allTasks],
  );

  const isLoading = openTasksQuery.isLoading || completedTasksQuery.isLoading;
  const isError = openTasksQuery.isError || completedTasksQuery.isError;
  const errorMessage =
    (openTasksQuery.error && getApiErrorMessage(openTasksQuery.error, 'Failed to load dashboard data.')) ||
    (completedTasksQuery.error && getApiErrorMessage(completedTasksQuery.error, 'Failed to load dashboard data.')) ||
    'Failed to load dashboard data.';

  return (
    <Stack spacing={3.25}>
      <Box
        sx={{
          p: { xs: 2.25, md: 2.75 },
          borderRadius: 3,
          bgcolor: '#ffffff',
          border: '1px solid',
          borderColor: 'rgba(15, 23, 42, 0.06)',
          boxShadow: '0 16px 38px rgba(15, 23, 42, 0.045)',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Workspace Dashboard
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
          A quick operating view of task volume, urgency, ownership, and upcoming work.
        </Typography>
      </Box>

      <DashboardCardGrid summary={summary} isLoading={isLoading} />

      <DashboardCharts
        statusDistribution={statusDistribution}
        priorityDistribution={priorityDistribution}
        isLoading={isLoading}
      />

      <Stack spacing={2.25} direction={{ xs: 'column', lg: 'row' }}>
        <Box sx={{ flex: 1 }}>
          <DashboardTaskList
            title="Recent Tasks"
            subtitle="Latest tasks created across open and completed queues."
            tasks={recentTasks}
            isLoading={isLoading}
            isError={isError}
            errorMessage={errorMessage}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <DashboardTaskList
            title="Upcoming Deadlines"
            subtitle="Open tasks with the nearest due dates."
            tasks={upcomingDeadlines}
            isLoading={isLoading}
            isError={isError}
            errorMessage={errorMessage}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
