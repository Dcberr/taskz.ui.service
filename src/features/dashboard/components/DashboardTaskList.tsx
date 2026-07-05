import { Box, Chip, List, ListItem, Paper, Stack, Typography } from '@mui/material';
import type { Task } from '../../../types/task';
import { EmptyState, ErrorState, LoadingState } from '../../../components/FeedbackState';
import { formatDateOnly } from '../../../utils/date';
import { getDueDateVisual, getPriorityVisual, getStatusVisual } from '../../task/utils/taskVisuals';

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
    <Paper sx={{ p: 2.75, borderRadius: 2.5, bgcolor: '#ffffff' }}>
      <Stack spacing={1.75}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
        <List dense disablePadding>
          {tasks.slice(0, 5).map((task) => {
            const statusVisual = getStatusVisual(task.status);
            const priorityVisual = getPriorityVisual(task.priority);
            const dueDateVisual = getDueDateVisual(task.dueDate);

            return (
              <ListItem
                key={task.id}
                disableGutters
                sx={{
                  py: 1.15,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 0 },
                }}
              >
                <Stack spacing={1} sx={{ width: '100%', minWidth: 0 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                    <Typography variant="body2" fontWeight={700} sx={{ minWidth: 0, lineHeight: 1.45 }}>
                      {task.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                      {formatDueDate(task.dueDate)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                    <Chip variant="outlined" size="small" label={statusVisual.label} sx={statusVisual.sx} />
                    <Chip variant="outlined" size="small" label={priorityVisual.label} sx={priorityVisual.sx} />
                    <Chip variant="outlined" size="small" label={dueDateVisual.label} sx={dueDateVisual.sx} />
                  </Stack>
                </Stack>
              </ListItem>
            );
          })}
        </List>
      </Stack>
    </Paper>
  );
}
