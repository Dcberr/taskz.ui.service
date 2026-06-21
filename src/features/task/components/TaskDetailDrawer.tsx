import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { EmptyState, ErrorState, LoadingState } from '../../../components/FeedbackState';
import { DrawerSkeleton } from '../../../components/Skeletons';
import type { TaskDetail } from '../../../types/task';
import { TaskActionForm } from './TaskActionForm';
import { useTaskEvents } from '../hooks/useTaskEvents';
import { TaskActivityTimeline } from './TaskActivityTimeline';
import { formatDateTime } from '../../../utils/date';

type TaskDetailDrawerProps = {
  open: boolean;
  taskId: string | null;
  task?: TaskDetail;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onClose: () => void;
};

function formatDate(value: string | null): string {
  return formatDateTime(value);
}

function formatConfidence(value: number | null): string {
  return value === null ? '-' : `${Math.round(value * 100)}%`;
}

function DetailGroup({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <List disablePadding dense>
        {items.map((item) => (
          <ListItem key={item.label} disableGutters sx={{ py: 0.25 }}>
            <ListItemText primary={item.label} secondary={item.value} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export function TaskDetailDrawer({
  open,
  taskId,
  task,
  isLoading,
  isError,
  errorMessage,
  onClose,
}: TaskDetailDrawerProps) {
  const taskEventsQuery = useTaskEvents(taskId);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 480, md: 560 } } }}>
      <Box sx={{ px: 2.5, pb: 2.5, pt: { xs: 2.5, md: 3 }, height: '100%', overflowY: 'auto' }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Task Detail
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {taskId ? `Task ID: ${taskId}` : 'No task selected'}
              </Typography>
            </Box>
            <IconButton onClick={onClose} aria-label="Close drawer">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {!taskId ? (
            <EmptyState title="No task selected" description="Select a task to inspect its full details." />
          ) : isLoading ? (
            <Stack spacing={2}>
              <LoadingState title="Loading task details" description="Fetching task metadata and lifecycle information." />
              <DrawerSkeleton />
            </Stack>
          ) : isError ? (
            <ErrorState title="Unable to load task details" description={errorMessage} />
          ) : task ? (
            <Stack spacing={3}>
              <TaskActionForm task={task} />
              <DetailGroup
                title="General Information"
                items={[
                  { label: 'Title', value: task.title || '-' },
                  { label: 'Description', value: task.description || '-' },
                  { label: 'Requester', value: task.requester ?? '-' },
                  { label: 'Assignee', value: task.assignee ?? '-' },
                  { label: 'Priority', value: task.priority },
                  { label: 'Status', value: task.status },
                  { label: 'Due Date', value: formatDate(task.dueDate) },
                ]}
              />

              <DetailGroup
                title="AI Metadata"
                items={[
                  { label: 'AI Confidence', value: formatConfidence(task.aiConfidence) },
                  { label: 'Completed At', value: formatDate(task.completedAt) },
                ]}
              />

              <DetailGroup
                title="Source Information"
                items={[
                  { label: 'Source', value: task.source ?? '-' },
                  { label: 'Source Message Id', value: task.sourceMessageId ?? '-' },
                ]}
              />

              <DetailGroup
                title="Task Lifecycle"
                items={[
                  { label: 'Created At', value: formatDate(task.createdAt) },
                  { label: 'Updated At', value: formatDate(task.updatedAt) },
                ]}
              />

              <TaskActivityTimeline
                taskId={taskId}
                events={taskEventsQuery.data}
                isLoading={taskEventsQuery.isLoading}
                isError={taskEventsQuery.isError}
                errorMessage={
                  taskEventsQuery.error instanceof Error ? taskEventsQuery.error.message : 'Failed to load task activity.'
                }
              />
            </Stack>
          ) : null}
        </Stack>
      </Box>
    </Drawer>
  );
}
