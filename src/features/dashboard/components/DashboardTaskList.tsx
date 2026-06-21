import { Box, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material';
import type { Task } from '../../../types/task';
import { EmptyState, ErrorState, LoadingState } from '../../../components/FeedbackState';
import { formatDateOnly } from '../../../utils/date';

type DashboardTaskListProps = {
  title: string;
  subtitle: string;
  tasks?: Task[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
};

function formatDueDate(value: string | null): string {
  return value ? formatDateOnly(value) : 'No due date';
}

export function DashboardTaskList({
  title,
  subtitle,
  tasks,
  isLoading,
  isError,
  errorMessage,
}: DashboardTaskListProps) {
  if (isLoading) {
    return <LoadingState title={title} description={subtitle} />;
  }

  if (isError) {
    return <ErrorState title={title} description={errorMessage} />;
  }

  if (!tasks || tasks.length === 0) {
    return <EmptyState title={title} description="No tasks match this dashboard section yet." />;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
        <List dense disablePadding>
          {tasks.slice(0, 5).map((task) => (
            <ListItem key={task.id} disableGutters sx={{ py: 0.5 }}>
              <ListItemText
                primary={task.title}
                secondary={`${task.priority} · ${task.status} · ${formatDueDate(task.dueDate)}`}
              />
            </ListItem>
          ))}
        </List>
      </Stack>
    </Paper>
  );
}
