import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { EmptyState, ErrorState, LoadingState } from '../../../components/FeedbackState';
import { DrawerSkeleton } from '../../../components/Skeletons';
import type { TaskDetail } from '../../../types/task';
import { formatAssignees } from '../../../utils/assignees';
import { formatDateTime } from '../../../utils/date';
import { TaskActivityTimeline } from './TaskActivityTimeline';
import { TaskActionForm } from './TaskActionForm';
import { useTaskEvents } from '../hooks/useTaskEvents';
import { assigneeChipSx, getDueDateVisual, getPriorityVisual, getStatusVisual } from '../utils/taskVisuals';
import { TaskWorkflowPanel } from '../../workflow/components/TaskWorkflowPanel';

type TaskDetailDialogProps = {
  open: boolean;
  taskId: string | null;
  task: TaskDetail | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onClose: () => void;
};

type DetailItem = {
  label: string;
  value: string;
};

const tabs = ['Overview', 'Workflow', 'Update', 'Activity', 'Metadata'] as const;

function formatDate(value: string | null): string {
  return formatDateTime(value);
}

function formatConfidence(value: number | null): string {
  return value === null ? '-' : `${Math.round(value * 100)}%`;
}

function DetailTile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box
      sx={{
        p: 1.85,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2.5,
        bgcolor: '#ffffff',
        minHeight: 82,
      }}
    >
      <Typography variant="caption" color="text.secondary" fontWeight={800} textTransform="uppercase">
        {label}
      </Typography>
      <Box sx={{ mt: 1 }}>{children}</Box>
    </Box>
  );
}

function DetailList({ items }: { items: DetailItem[] }) {
  return (
    <Stack
      divider={<Divider flexItem />}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2.5,
        bgcolor: '#ffffff',
      }}
    >
      {items.map((item) => (
        <Stack
          key={item.label}
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1}
          sx={{ px: 1.85, py: 1.4 }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={700}>
            {item.label}
          </Typography>
          <Typography variant="body2" color="text.primary" textAlign={{ xs: 'left', sm: 'right' }}>
            {item.value}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

function TabPanel({ active, index, children }: { active: number; index: number; children: ReactNode }) {
  if (active !== index) {
    return null;
  }

  return <Box sx={{ pt: 2.5 }}>{children}</Box>;
}

export function TaskDetailDialog({
  open,
  taskId,
  task,
  isLoading,
  isError,
  errorMessage,
  onClose,
}: TaskDetailDialogProps) {
  const [activeTab, setActiveTab] = useState(0);
  const taskEventsQuery = useTaskEvents(taskId);

  useEffect(() => {
    setActiveTab(0);
  }, [taskId, open]);

  const statusVisual = task ? getStatusVisual(task.status) : null;
  const priorityVisual = task ? getPriorityVisual(task.priority) : null;
  const dueDateVisual = task ? getDueDateVisual(task.dueDate) : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '85vh',
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 2,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Stack spacing={1.25} sx={{ minWidth: 0 }}>
            <Box>
              <Typography variant="h5" sx={{ wordBreak: 'break-word' }}>
                {task?.title || 'Task Detail'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {taskId ? `Task ID: ${taskId}` : 'No task selected'}
              </Typography>
            </Box>
            {task ? (
              <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
                {statusVisual ? <Chip variant="outlined" size="small" label={statusVisual.label} sx={statusVisual.sx} /> : null}
                {priorityVisual ? (
                  <Chip variant="outlined" size="small" label={priorityVisual.label} sx={priorityVisual.sx} />
                ) : null}
                {dueDateVisual ? <Chip variant="outlined" size="small" label={dueDateVisual.label} sx={dueDateVisual.sx} /> : null}
                {task.assignees.length > 0 ? (
                  task.assignees.slice(0, 4).map((assignee) => (
                    <Chip key={assignee} variant="outlined" size="small" label={assignee} sx={assigneeChipSx} />
                  ))
                ) : (
                  <Chip variant="outlined" size="small" label="Unassigned" sx={assigneeChipSx} />
                )}
                <Chip
                  variant="outlined"
                  size="small"
                  label={`AI ${formatConfidence(task.aiConfidence)}`}
                  sx={{
                    borderRadius: 1.5,
                    fontWeight: 700,
                    color: '#1d4ed8',
                    bgcolor: 'rgba(29, 78, 216, 0.08)',
                    borderColor: 'rgba(29, 78, 216, 0.2)',
                  }}
                />
                {task.workflowDetails?.taskType ? (
                  <Chip
                    variant="outlined"
                    size="small"
                    label={task.workflowDetails.taskType}
                    sx={{
                      borderRadius: 1.5,
                      fontWeight: 700,
                      color: '#115e59',
                      bgcolor: 'rgba(15, 118, 110, 0.09)',
                      borderColor: 'rgba(15, 118, 110, 0.22)',
                    }}
                  />
                ) : null}
                {task.workflowDetails?.isCritical ? (
                  <Chip
                    variant="outlined"
                    size="small"
                    label="Critical"
                    sx={{
                      borderRadius: 1.5,
                      fontWeight: 800,
                      color: '#b91c1c',
                      bgcolor: 'rgba(220, 38, 38, 0.1)',
                      borderColor: 'rgba(185, 28, 28, 0.24)',
                    }}
                  />
                ) : null}
                {task.workflowDetails ? (
                  <Chip
                    variant="outlined"
                    size="small"
                    label={`${task.workflowDetails.dependencyCount} deps`}
                    sx={{
                      borderRadius: 1.5,
                      fontWeight: 700,
                      color: '#334155',
                      bgcolor: '#f8fafc',
                      borderColor: 'rgba(15, 23, 42, 0.14)',
                    }}
                  />
                ) : null}
              </Stack>
            ) : null}
          </Stack>
          <IconButton onClick={onClose} aria-label="Close task detail" size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0, bgcolor: '#f8fafc' }}>
        {!taskId ? (
          <Box sx={{ p: 3 }}>
            <EmptyState title="No task selected" description="Select a task to inspect its full details." />
          </Box>
        ) : isLoading ? (
          <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
              <LoadingState title="Loading task details" description="Fetching task metadata and lifecycle information." />
              <DrawerSkeleton />
            </Stack>
          </Box>
        ) : isError ? (
          <Box sx={{ p: 3 }}>
            <ErrorState title="Unable to load task details" description={errorMessage} />
          </Box>
        ) : task ? (
          <Box>
            <Box sx={{ px: { xs: 2, md: 3 }, pt: 1.5, bgcolor: '#ffffff', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={(_event, nextValue: number) => setActiveTab(nextValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {tabs.map((tab) => (
                  <Tab key={tab} label={tab} sx={{ textTransform: 'none', fontWeight: 800 }} />
                ))}
              </Tabs>
            </Box>

            <Box sx={{ px: { xs: 2, md: 3 }, pb: 3 }}>
              <TabPanel active={activeTab} index={0}>
                <Stack spacing={2.5}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
                      gap: 1.5,
                    }}
                  >
                    <DetailTile label="Status">
                      <Chip variant="outlined" size="small" label={statusVisual?.label ?? task.status} sx={statusVisual?.sx ?? {}} />
                    </DetailTile>
                    <DetailTile label="Priority">
                      <Chip variant="outlined" size="small" label={priorityVisual?.label ?? task.priority} sx={priorityVisual?.sx ?? {}} />
                    </DetailTile>
                    <DetailTile label="Due Date">
                      <Stack spacing={0.75} alignItems="flex-start">
                        <Chip variant="outlined" size="small" label={dueDateVisual?.label ?? 'No due date'} sx={dueDateVisual?.sx ?? {}} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(task.dueDate)}
                        </Typography>
                      </Stack>
                    </DetailTile>
                    <DetailTile label="Requester">
                      <Typography variant="body2" fontWeight={800}>
                        {task.requester ?? '-'}
                      </Typography>
                    </DetailTile>
                  </Box>

                  <Box
                    sx={{
                      p: 2.25,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2.5,
                      bgcolor: '#ffffff',
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={800}>
                      Description
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                      {task.description || 'No description provided.'}
                    </Typography>
                  </Box>

                  <DetailList
                    items={[
                      { label: 'Assignees', value: formatAssignees(task.assignees) },
                      { label: 'Created At', value: formatDate(task.createdAt) },
                      { label: 'Updated At', value: formatDate(task.updatedAt) },
                    ]}
                  />
                </Stack>
              </TabPanel>

              <TabPanel active={activeTab} index={1}>
                <TaskWorkflowPanel workflowDetails={task.workflowDetails} aiConfidence={task.aiConfidence} />
              </TabPanel>

              <TabPanel active={activeTab} index={2}>
                <TaskActionForm task={task} />
              </TabPanel>

              <TabPanel active={activeTab} index={3}>
                <TaskActivityTimeline
                  taskId={taskId}
                  events={taskEventsQuery.data}
                  isLoading={taskEventsQuery.isLoading}
                  isError={taskEventsQuery.isError}
                  errorMessage={
                    taskEventsQuery.error instanceof Error ? taskEventsQuery.error.message : 'Failed to load task activity.'
                  }
                />
              </TabPanel>

              <TabPanel active={activeTab} index={4}>
                <Stack spacing={2}>
                  <DetailList
                    items={[
                      { label: 'AI Confidence', value: formatConfidence(task.aiConfidence) },
                      { label: 'Source', value: task.source ?? '-' },
                      { label: 'Source Message Id', value: task.sourceMessageId ?? '-' },
                      { label: 'Workflow Id', value: task.workflowDetails?.workflowId ?? '-' },
                    ]}
                  />
                  <DetailList
                    items={[
                      { label: 'Created At', value: formatDate(task.createdAt) },
                      { label: 'Updated At', value: formatDate(task.updatedAt) },
                      { label: 'Completed At', value: formatDate(task.completedAt) },
                    ]}
                  />
                </Stack>
              </TabPanel>
            </Box>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
