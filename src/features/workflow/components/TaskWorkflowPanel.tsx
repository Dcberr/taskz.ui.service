import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Task } from '../../../types/task';
import type { WorkflowDetails } from '../../../types/workflow';
import { formatAssignees } from '../../../utils/assignees';
import { formatDateTime } from '../../../utils/date';
import { getPriorityVisual, getStatusVisual } from '../../task/utils/taskVisuals';

type TaskWorkflowPanelProps = {
  workflowDetails: WorkflowDetails | null;
  aiConfidence: number | null;
};

function formatConfidence(value: number | null): string {
  return value === null ? '-' : `${Math.round(value * 100)}%`;
}

function IdChipList({ ids, emptyLabel }: { ids: string[]; emptyLabel: string }) {
  if (ids.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyLabel}
      </Typography>
    );
  }

  return (
    <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.75}>
      {ids.map((id) => (
        <Chip
          key={id}
          size="small"
          variant="outlined"
          label={id}
          sx={{
            borderRadius: 1.5,
            fontWeight: 700,
            bgcolor: '#ffffff',
            borderColor: 'rgba(15, 23, 42, 0.14)',
          }}
        />
      ))}
    </Stack>
  );
}

function ReferencedTaskCard({ task }: { task: Task }) {
  const statusVisual = getStatusVisual(task.status);
  const priorityVisual = getPriorityVisual(task.priority);

  return (
    <Box
      component={RouterLink}
      to={`/tasks?taskId=${encodeURIComponent(task.id)}`}
      sx={{
        display: 'block',
        p: 1.5,
        border: '1px solid',
        borderColor: 'rgba(15, 23, 42, 0.1)',
        borderRadius: 2,
        bgcolor: '#ffffff',
        color: 'inherit',
        textDecoration: 'none',
        transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
        '&:hover': {
          borderColor: 'rgba(15, 118, 110, 0.22)',
          boxShadow: '0 12px 28px rgba(15, 23, 42, 0.07)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      <Stack spacing={1}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={900} sx={{ wordBreak: 'break-word' }}>
            {task.title || task.id}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
            {task.id}
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          <Chip variant="outlined" size="small" label={statusVisual.label} sx={statusVisual.sx} />
          <Chip variant="outlined" size="small" label={priorityVisual.label} sx={priorityVisual.sx} />
        </Stack>
        <Stack spacing={0.35}>
          <Typography variant="caption" color="text.secondary">
            Requester: {task.requester ?? '-'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Assignees: {formatAssignees(task.assignees)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Due: {formatDateTime(task.dueDate)}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

function ReferencedTaskList({
  tasks,
  ids,
  emptyLabel,
}: {
  tasks: Task[];
  ids: string[];
  emptyLabel: string;
}) {
  if (tasks.length > 0) {
    return (
      <Stack spacing={1}>
        {tasks.map((task, index) => (
          <ReferencedTaskCard key={task.id || `${task.title}-${index}`} task={task} />
        ))}
      </Stack>
    );
  }

  return <IdChipList ids={ids} emptyLabel={emptyLabel} />;
}

function ReasoningRow({ label, value }: { label: string; value: string | null }) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.5}
      sx={{ py: 1.35 }}
      alignItems={{ xs: 'flex-start', md: 'flex-start' }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight={800} sx={{ minWidth: 150 }}>
        {label}
      </Typography>
      <Typography variant="body2" color={value ? 'text.primary' : 'text.secondary'} sx={{ whiteSpace: 'pre-wrap' }}>
        {value || 'No reasoning supplied.'}
      </Typography>
    </Stack>
  );
}

export function TaskWorkflowPanel({ workflowDetails, aiConfidence }: TaskWorkflowPanelProps) {
  if (!workflowDetails) {
    return (
      <Alert severity="info" sx={{ bgcolor: '#ffffff' }}>
        <Typography variant="subtitle1" fontWeight={800}>
          No workflow context
        </Typography>
        <Typography variant="body2">
          This task does not include workflow intelligence yet.
        </Typography>
      </Alert>
    );
  }

  return (
    <Stack spacing={2.25}>
      <Box
        sx={{
          p: 2.25,
          border: '1px solid',
          borderColor: workflowDetails.isCritical ? 'rgba(185, 28, 28, 0.22)' : 'divider',
          borderRadius: 2.5,
          bgcolor: workflowDetails.isCritical ? 'rgba(254, 242, 242, 0.72)' : '#ffffff',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
          <Stack spacing={1.25}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccountTreeIcon color={workflowDetails.isCritical ? 'error' : 'primary'} fontSize="small" />
              <Typography variant="h6">Workflow Context</Typography>
            </Stack>
            <Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {workflowDetails.workflowImpact || 'No workflow impact was provided.'}
            </Typography>
          </Stack>
          {workflowDetails.workflowId ? (
            <Button
              component={RouterLink}
              to={`/workflows/${workflowDetails.workflowId}`}
              variant="contained"
              endIcon={<OpenInNewIcon />}
              sx={{ alignSelf: { xs: 'flex-start', md: 'center' }, whiteSpace: 'nowrap' }}
            >
              Open Workflow
            </Button>
          ) : null}
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 1.25,
        }}
      >
        {[
          ['Task Type', workflowDetails.taskType ?? '-'],
          ['Critical', workflowDetails.isCritical ? 'Yes' : 'No'],
          ['Dependencies', String(workflowDetails.dependencyCount)],
          ['AI Confidence', formatConfidence(aiConfidence)],
        ].map(([label, value]) => (
          <Box
            key={label}
            sx={{
              p: 1.65,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2.5,
              bgcolor: '#ffffff',
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={800} textTransform="uppercase">
              {label}
            </Typography>
            <Typography variant="body1" fontWeight={850} sx={{ mt: 0.75 }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr auto 1fr' },
          gap: 1.5,
          alignItems: 'stretch',
        }}
      >
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#ffffff' }}>
          <Typography variant="subtitle1" fontWeight={850} gutterBottom>
            Blocked by
          </Typography>
          <ReferencedTaskList
            tasks={workflowDetails.blockedByTasks}
            ids={workflowDetails.blockedByTaskIds}
            emptyLabel="No upstream task blockers."
          />
        </Box>
        <Box
          sx={{
            display: { xs: 'none', lg: 'grid' },
            placeItems: 'center',
            color: 'text.secondary',
            px: 0.5,
          }}
        >
          <ArrowForwardIcon />
        </Box>
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#ffffff' }}>
          <Typography variant="subtitle1" fontWeight={850} gutterBottom>
            Blocks
          </Typography>
          <ReferencedTaskList
            tasks={workflowDetails.blocksTasks}
            ids={workflowDetails.blocksTaskIds}
            emptyLabel="No downstream tasks are blocked."
          />
        </Box>
      </Box>

      <Box sx={{ p: 2.25, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#ffffff' }}>
        <Typography variant="subtitle1" fontWeight={850}>
          Reasoning
        </Typography>
        <Divider sx={{ mt: 1.25 }} />
        <ReasoningRow label="Business Impact" value={workflowDetails.reasoning.businessImpact} />
        <Divider />
        <ReasoningRow label="Urgency" value={workflowDetails.reasoning.urgencyReason} />
        <Divider />
        <ReasoningRow label="Confidence" value={workflowDetails.reasoning.confidenceReason} />
      </Box>

      <Box sx={{ p: 2.25, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#ffffff' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <FormatQuoteIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" fontWeight={850}>
            Evidence
          </Typography>
        </Stack>
        {workflowDetails.evidence.length > 0 ? (
          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
            {workflowDetails.evidence.map((item) => (
              <Chip
                key={item}
                label={item}
                variant="outlined"
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 1.5,
                  bgcolor: '#f8fafc',
                  '& .MuiChip-label': {
                    display: 'block',
                    py: 0.65,
                    whiteSpace: 'normal',
                  },
                }}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No evidence snippets were provided.
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
