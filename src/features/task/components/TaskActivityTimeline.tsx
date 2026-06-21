import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { EmptyState, ErrorState, LoadingState } from '../../../components/FeedbackState';
import type { TaskEvent } from '../../../types/task';
import { formatTaskEventDescription, formatTaskEventTitle, formatTaskEventType } from '../utils/taskEventFormatting';
import { formatDateTime } from '../../../utils/date';

type TaskActivityTimelineProps = {
  taskId: string | null;
  events?: TaskEvent[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
};

function formatDate(value: string): string {
  return formatDateTime(value);
}

export function TaskActivityTimeline({
  taskId,
  events,
  isLoading,
  isError,
  errorMessage,
}: TaskActivityTimelineProps) {
  if (!taskId) {
    return <EmptyState title="No activity selected" description="Select a task to view its audit trail." />;
  }

  if (isLoading) {
    return <LoadingState title="Loading activity timeline" description="Fetching audit trail events for this task." />;
  }

  if (isError) {
    return <ErrorState title="Unable to load activity timeline" description={errorMessage} />;
  }

  if (!events || events.length === 0) {
    return <EmptyState title="No activity events" description="This task has no recorded audit trail entries yet." />;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Activity Timeline
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Audit trail events for this task.
          </Typography>
        </Box>

        <Stack spacing={2}>
          {events.map((event, index) => (
            <Box key={event.id}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mt: 0.75,
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {formatTaskEventTitle(event)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatTaskEventType(event.type)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {formatTaskEventDescription(event) ?? 'No additional details provided.'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {formatDate(event.createdAt)}
                  </Typography>
                </Box>
              </Stack>
              {index < events.length - 1 ? <Divider sx={{ mt: 2, ml: 1.5 }} /> : null}
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
