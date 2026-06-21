import { Box, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { DashboardCardGrid } from '../features/dashboard/components/DashboardCardGrid';
import { DashboardTaskList } from '../features/dashboard/components/DashboardTaskList';
import { useDashboardTasks } from '../features/dashboard/hooks/useDashboardTasks';
import type { DashboardSummary } from '../types/dashboard';
import type { Task } from '../types/task';
import { useAppTitle } from '../hooks/useAppTitle';

export function DashboardPage() {
  useAppTitle('Taskz | Dashboard');

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

  const isLoading = openTasksQuery.isLoading || completedTasksQuery.isLoading;
  const isError = openTasksQuery.isError || completedTasksQuery.isError;
  const errorMessage =
    (openTasksQuery.error instanceof Error && openTasksQuery.error.message) ||
    (completedTasksQuery.error instanceof Error && completedTasksQuery.error.message) ||
    'Failed to load dashboard data.';

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Overview of task volume, priority, and upcoming work.
        </Typography>
      </Box>

      <DashboardCardGrid summary={summary} isLoading={isLoading} />

      <Stack spacing={2} direction={{ xs: 'column', lg: 'row' }}>
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
