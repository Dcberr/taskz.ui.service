import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import InsightsIcon from '@mui/icons-material/Insights';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ScienceIcon from '@mui/icons-material/Science';
import SearchIcon from '@mui/icons-material/Search';
import SyncIcon from '@mui/icons-material/Sync';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { memo, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Task } from '../../../types/task';
import type { WorkflowDependency, WorkflowImpactItem, WorkflowResponse, WorkflowSummary as WorkflowSummaryType } from '../../../types/workflow';
import { formatAssignees } from '../../../utils/assignees';
import { formatDateTime } from '../../../utils/date';
import { getPriorityVisual, getStatusVisual } from '../../task/utils/taskVisuals';

type TaskMap = Map<string, Task>;
type DependencyView = 'flow' | 'graph' | 'list';

const shellCardSx = {
  borderRadius: 4,
  border: '1px solid rgba(15, 23, 42, 0.07)',
  bgcolor: '#ffffff',
  boxShadow: '0 18px 48px rgba(15, 23, 42, 0.055)',
  transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 22px 54px rgba(15, 23, 42, 0.085)',
    borderColor: 'rgba(37, 99, 235, 0.16)',
  },
} as const;

function titleCase(value: string | null | undefined): string {
  if (!value) {
    return '-';
  }

  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function initials(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function avatarColor(name: string): string {
  const palette = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];
  const total = Array.from(name).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palette[total % palette.length] ?? '#2563EB';
}

function AssigneeAvatar({ name, size = 28 }: { name: string; size?: number }) {
  return (
    <Tooltip title={name}>
      <Avatar
        sx={{
          width: size,
          height: size,
          bgcolor: avatarColor(name),
          color: '#ffffff',
          fontSize: size <= 24 ? 10 : 12,
          fontWeight: 850,
          border: '2px solid #ffffff',
        }}
      >
        {initials(name)}
      </Avatar>
    </Tooltip>
  );
}

function MetricLabel({ children }: { children: string }) {
  return (
    <Typography variant="caption" color="text.secondary" fontWeight={850} textTransform="uppercase">
      {children}
    </Typography>
  );
}

function RiskChip({ value }: { value: string | null }) {
  const normalized = value?.toUpperCase();
  const isHigh = normalized === 'HIGH' || normalized === 'CRITICAL';
  const isMedium = normalized === 'MEDIUM';

  return (
    <Chip
      size="small"
      label={`${titleCase(value)} Risk`}
      sx={{
        borderRadius: 1.5,
        fontWeight: 850,
        color: isHigh ? '#B91C1C' : isMedium ? '#B45309' : '#047857',
        bgcolor: isHigh ? 'rgba(239, 68, 68, 0.1)' : isMedium ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.11)',
        border: '1px solid',
        borderColor: isHigh ? 'rgba(239, 68, 68, 0.22)' : isMedium ? 'rgba(245, 158, 11, 0.24)' : 'rgba(16, 185, 129, 0.22)',
      }}
    />
  );
}

function PriorityChip({ value }: { value: string | null }) {
  const visual = getPriorityVisual(value ?? 'MEDIUM');

  return <Chip size="small" variant="outlined" label={visual.label} sx={visual.sx} />;
}

function StatusChip({ value }: { value: string }) {
  const visual = getStatusVisual(value || 'OPEN');

  return <Chip size="small" variant="outlined" label={visual.label} sx={visual.sx} />;
}

function TaskTitle({ task, fallbackId }: { task: Task | undefined; fallbackId: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" fontWeight={900} sx={{ color: '#0F172A', wordBreak: 'break-word' }}>
        {task?.title || fallbackId}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', wordBreak: 'break-word' }}>
        {task ? `${task.status || '-'} · ${task.priority || '-'} · ${task.assignees[0] ?? 'Unassigned'}` : 'Task details unavailable'}
      </Typography>
    </Box>
  );
}

function MiniTaskCard({
  taskId,
  task,
  critical = false,
  selected = false,
}: {
  taskId: string;
  task: Task | undefined;
  critical?: boolean;
  selected?: boolean;
}) {
  return (
    <Box
      sx={{
        minWidth: 176,
        maxWidth: 230,
        p: 1.35,
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: selected ? '#2563EB' : critical ? 'rgba(239, 68, 68, 0.34)' : 'rgba(15, 23, 42, 0.1)',
        bgcolor: selected ? 'rgba(37, 99, 235, 0.07)' : critical ? 'rgba(254, 242, 242, 0.82)' : '#ffffff',
        boxShadow: selected ? '0 0 0 4px rgba(37, 99, 235, 0.12), 0 16px 34px rgba(37, 99, 235, 0.12)' : '0 12px 28px rgba(15, 23, 42, 0.045)',
        transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: selected ? '0 0 0 4px rgba(37, 99, 235, 0.16), 0 18px 36px rgba(37, 99, 235, 0.14)' : '0 16px 34px rgba(15, 23, 42, 0.08)',
        },
      }}
    >
      <Stack spacing={0.85}>
        <Typography variant="body2" fontWeight={900} sx={{ color: critical ? '#B91C1C' : '#0F172A', wordBreak: 'break-word' }}>
          {task?.title || taskId}
        </Typography>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          <StatusChip value={task?.status ?? 'OPEN'} />
          <PriorityChip value={task?.priority ?? 'MEDIUM'} />
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {task?.assignees[0] ?? 'Unassigned'}
        </Typography>
      </Stack>
    </Box>
  );
}

export const WorkflowHeader = memo(function WorkflowHeader({ workflow }: { workflow: WorkflowResponse }) {
  return (
    <Box sx={{ pt: 0.5, pb: 0.5 }}>
      <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', lg: 'center' }} spacing={3}>
        <Stack spacing={1.4} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
            <Typography variant="caption" fontWeight={850}>
              Workflows
            </Typography>
            <Typography variant="caption">/</Typography>
            <Typography variant="caption" fontWeight={850} noWrap sx={{ maxWidth: { xs: 220, sm: 360 } }}>
              {workflow.workflowId}
            </Typography>
          </Stack>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0F172A', wordBreak: 'break-word' }}>
            Workflow {workflow.workflowId}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="body2" color="text.secondary">
              Created {formatDateTime(workflow.createdAt)}
            </Typography>
            <RiskChip value={workflow.summary.workflowRisk} />
            <PriorityChip value={workflow.summary.overallPriority} />
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" useFlexGap>
          <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: 12, fontWeight: 850 } }}>
            {workflow.summary.primaryAssignees.map((assignee) => (
              <AssigneeAvatar key={assignee} name={assignee} />
            ))}
          </AvatarGroup>
          <Button variant="outlined" startIcon={<EditIcon />} sx={{ borderRadius: 2, bgcolor: '#ffffff' }}>
            Edit Workflow
          </Button>
          <IconButton aria-label="More workflow actions" sx={{ bgcolor: '#ffffff', border: '1px solid rgba(15, 23, 42, 0.1)' }}>
            <MoreHorizIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
});

function SummaryMetricCard({
  label,
  children,
  description,
  icon,
}: {
  label: string;
  children: ReactNode;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        border: '1px solid rgba(15, 23, 42, 0.08)',
        bgcolor: '#ffffff',
        minHeight: 118,
        transition: 'transform 160ms ease, box-shadow 160ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 14px 30px rgba(15, 23, 42, 0.065)',
        },
      }}
    >
      <Stack spacing={1.2}>
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <MetricLabel>{label}</MetricLabel>
        </Stack>
        <Box>{children}</Box>
        {description ? (
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}

export const WorkflowSummary = memo(function WorkflowSummary({ summary }: { summary: WorkflowSummaryType }) {
  const advice = [
    'Protect the critical path by completing tasks in dependency order.',
    'Resolve blocker tasks before starting downstream execution.',
  ];

  return (
    <Card sx={{ ...shellCardSx, p: 3 }}>
      <Stack spacing={2.4}>
        <Typography variant="h6" fontWeight={900}>
          Workflow Summary
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(6, minmax(0, 1fr))' },
            gap: 1.5,
          }}
        >
          <SummaryMetricCard label="Actionable" description="This workflow is actionable" icon={<CheckCircleIcon sx={{ color: '#10B981', fontSize: 18 }} />}>
            <Typography variant="h5" color={summary.isActionable ? '#047857' : '#64748B'} fontWeight={950}>
              {summary.isActionable ? 'Yes' : 'No'}
            </Typography>
          </SummaryMetricCard>
          <SummaryMetricCard label="Total Tasks" description="Tasks identified" icon={<ChecklistIcon sx={{ color: '#2563EB', fontSize: 18 }} />}>
            <Typography variant="h5" color="#0F172A" fontWeight={950}>
              {summary.taskCount}
            </Typography>
          </SummaryMetricCard>
          <SummaryMetricCard label="Overall Priority" description="Requires attention" icon={<BoltIcon sx={{ color: '#F59E0B', fontSize: 18 }} />}>
            <PriorityChip value={summary.overallPriority} />
          </SummaryMetricCard>
          <SummaryMetricCard label="Workflow Risk" description="Risk level detected" icon={<WarningAmberIcon sx={{ color: '#EF4444', fontSize: 18 }} />}>
            <RiskChip value={summary.workflowRisk} />
          </SummaryMetricCard>
          <SummaryMetricCard label="Primary Assignees" description={`${summary.primaryAssignees.length} members`} icon={<AccountTreeIcon sx={{ color: '#2563EB', fontSize: 18 }} />}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: 12, fontWeight: 850 } }}>
                {summary.primaryAssignees.map((assignee) => (
                  <AssigneeAvatar key={assignee} name={assignee} />
                ))}
              </AvatarGroup>
              {summary.primaryAssignees.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  None
                </Typography>
              ) : null}
            </Stack>
          </SummaryMetricCard>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              minHeight: 118,
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(16, 185, 129, 0.08))',
              border: '1px solid rgba(37, 99, 235, 0.12)',
            }}
          >
            <Stack spacing={1.25}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LightbulbIcon sx={{ color: '#2563EB', fontSize: 18 }} />
                <MetricLabel>AI Execution Advice</MetricLabel>
              </Stack>
              {advice.map((item) => (
                <Stack key={item} direction="row" spacing={1} alignItems="flex-start">
                  <CheckCircleIcon sx={{ color: '#10B981', fontSize: 15, mt: 0.2 }} />
                  <Typography variant="caption" color="#334155">
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Card>
  );
});

function getTaskStage(task: Task | undefined): 'completed' | 'active' | 'pending' {
  const status = task?.status.toUpperCase();

  if (status === 'COMPLETED') {
    return 'completed';
  }

  if (status === 'IN_PROGRESS' || status === 'OPEN') {
    return 'active';
  }

  return 'pending';
}

function getStageChip(task: Task | undefined) {
  const stage = getTaskStage(task);

  if (stage === 'completed') {
    return {
      label: 'Completed',
      color: '#047857',
      bgcolor: 'rgba(16, 185, 129, 0.12)',
      borderColor: 'rgba(16, 185, 129, 0.28)',
    };
  }

  if (stage === 'active') {
    return {
      label: task?.status.toUpperCase() === 'IN_PROGRESS' ? 'In Progress' : 'Open',
      color: '#2563EB',
      bgcolor: 'rgba(37, 99, 235, 0.1)',
      borderColor: 'rgba(37, 99, 235, 0.22)',
    };
  }

  return {
    label: 'Pending',
    color: '#64748B',
    bgcolor: 'rgba(100, 116, 139, 0.1)',
    borderColor: 'rgba(100, 116, 139, 0.18)',
  };
}

function getStepColor(task: Task | undefined): string {
  const stage = getTaskStage(task);

  if (stage === 'completed') {
    return '#10B981';
  }

  if (stage === 'active') {
    return '#2563EB';
  }

  return '#94A3B8';
}

function TaskGlyph({ task, critical = false }: { task: Task | undefined; critical?: boolean }) {
  const title = `${task?.title ?? ''} ${task?.status ?? ''}`.toLowerCase();
  const iconColor = critical ? '#334155' : '#2563EB';
  const icon =
    title.includes('review') ? (
      <SyncIcon fontSize="small" />
    ) : title.includes('deploy') ? (
      <RocketLaunchIcon fontSize="small" />
    ) : title.includes('smoke') || title.includes('test') ? (
      <ScienceIcon fontSize="small" />
    ) : title.includes('notify') || title.includes('customer') ? (
      <NotificationsNoneIcon fontSize="small" />
    ) : (
      <Inventory2Icon fontSize="small" />
    );

  return (
    <Box
      sx={{
        width: 42,
        height: 42,
        borderRadius: 2.25,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        color: iconColor,
        bgcolor: critical ? '#F8FAFC' : 'rgba(37, 99, 235, 0.07)',
        border: '1px solid rgba(15, 23, 42, 0.08)',
      }}
    >
      {icon}
    </Box>
  );
}

function ExecutionSequenceItem({
  taskId,
  task,
  index,
  isLast,
  onTaskClick,
}: {
  taskId: string;
  task: Task | undefined;
  index: number;
  isLast: boolean;
  onTaskClick: (taskId: string) => void;
}) {
  const stepColor = getStepColor(task);
  const stageChip = getStageChip(task);

  return (
    <Box
      onClick={() => onTaskClick(taskId)}
      sx={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: { xs: '34px 1fr', sm: '34px 42px minmax(0, 1fr) auto 24px' },
        gap: { xs: 1.1, sm: 1.35 },
        alignItems: 'center',
        px: 1.2,
        py: 0.8,
        minHeight: 76,
        borderRadius: 2.25,
        borderBottom: isLast ? '0' : '1px solid rgba(15, 23, 42, 0.07)',
        bgcolor: '#ffffff',
        cursor: 'pointer',
        transition: 'background-color 160ms ease, transform 160ms ease, box-shadow 160ms ease',
        '&:hover': {
          bgcolor: '#F8FAFC',
          transform: 'translateX(2px)',
          boxShadow: '0 10px 24px rgba(15, 23, 42, 0.045)',
        },
      }}
    >
      <Box sx={{ position: 'relative', display: 'grid', placeItems: 'center', alignSelf: 'stretch' }}>
        {!isLast ? (
          <Box
            sx={{
              position: 'absolute',
              top: 37,
              bottom: -8,
              left: '50%',
              width: 2,
              borderRadius: 1,
              bgcolor: `${stepColor}38`,
              transform: 'translateX(-50%)',
            }}
          />
        ) : null}
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: stepColor,
            color: '#ffffff',
            fontSize: 11,
            fontWeight: 950,
            zIndex: 1,
            boxShadow: `0 6px 16px ${stepColor}30`,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </Box>
      </Box>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <TaskGlyph task={task} />
      </Box>
      <TaskTitle task={task} fallbackId={taskId} />
      <Chip
        size="small"
        label={stageChip.label}
        sx={{
          display: { xs: 'none', sm: 'inline-flex' },
          justifySelf: 'end',
          borderRadius: 1.5,
          fontWeight: 850,
          color: stageChip.color,
          bgcolor: stageChip.bgcolor,
          border: '1px solid',
          borderColor: stageChip.borderColor,
        }}
      />
      <ChevronRightIcon sx={{ display: { xs: 'none', sm: 'block' }, color: '#94A3B8', justifySelf: 'end' }} />
    </Box>
  );
}

function CriticalPathItem({
  taskId,
  task,
  index,
  isLast,
  onTaskClick,
}: {
  taskId: string;
  task: Task | undefined;
  index: number;
  isLast: boolean;
  onTaskClick: (taskId: string) => void;
}) {
  return (
    <Box
      onClick={() => onTaskClick(taskId)}
      sx={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: { xs: '34px 1fr', sm: '34px 42px minmax(0, 1fr) auto' },
        gap: 1.35,
        alignItems: 'center',
        py: 0.8,
        minHeight: 76,
        cursor: 'pointer',
      }}
    >
      <Box sx={{ position: 'relative', display: 'grid', placeItems: 'center', alignSelf: 'stretch' }}>
        {!isLast ? (
          <Box
            sx={{
              position: 'absolute',
              top: 37,
              bottom: -8,
              left: '50%',
              width: 2,
              borderRadius: 1,
              bgcolor: 'rgba(239, 68, 68, 0.34)',
              transform: 'translateX(-50%)',
            }}
          />
        ) : null}
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: '#EF4444',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 950,
            zIndex: 1,
            boxShadow: '0 6px 14px rgba(239, 68, 68, 0.24)',
          }}
        >
          {index + 1}
        </Box>
      </Box>
      <Box
        sx={{
          gridColumn: { xs: '2 / 3', sm: '2 / 5' },
          display: 'grid',
          gridTemplateColumns: { xs: '42px minmax(0, 1fr)', sm: '42px minmax(0, 1fr) auto' },
          gap: 1.35,
          alignItems: 'center',
          p: 1.05,
          minHeight: 60,
          borderRadius: 2.5,
          border: '1px solid rgba(239, 68, 68, 0.12)',
          bgcolor: 'rgba(254, 242, 242, 0.88)',
          transition: 'transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease',
          '&:hover': {
            transform: 'translateX(2px)',
            bgcolor: 'rgba(254, 226, 226, 0.9)',
            boxShadow: '0 12px 28px rgba(239, 68, 68, 0.12)',
          },
        }}
      >
        <TaskGlyph task={task} critical />
        <TaskTitle task={task} fallbackId={taskId} />
        <Chip
          size="small"
          label="High Risk"
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            justifySelf: 'end',
            borderRadius: 1.5,
            fontWeight: 900,
            color: '#EF4444',
            bgcolor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.22)',
          }}
        />
      </Box>
    </Box>
  );
}

export const ExecutionSequenceCard = memo(function ExecutionSequenceCard({
  taskIds,
  tasksById,
  criticalPathIds,
  onTaskClick,
}: {
  taskIds: string[];
  tasksById: TaskMap;
  criticalPathIds: Set<string>;
  onTaskClick: (taskId: string) => void;
}) {
  const completedCount = taskIds.filter((taskId) => tasksById.get(taskId)?.status.toUpperCase() === 'COMPLETED').length;
  const progress = taskIds.length > 0 ? (completedCount / taskIds.length) * 100 : 0;

  return (
    <Card sx={{ ...shellCardSx, p: 3, height: '100%' }}>
      <Stack spacing={2.1}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
          sx={{ minHeight: 32 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, display: 'grid', placeItems: 'center', bgcolor: 'rgba(37, 99, 235, 0.09)' }}>
              <PlayArrowIcon sx={{ color: '#2563EB', fontSize: 18 }} />
            </Box>
            <Typography variant="h6" fontWeight={950}>
              Execution Sequence
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Typography variant="caption" color="text.secondary" fontWeight={850}>
              {completedCount} of {taskIds.length} completed
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                width: 112,
                height: 6,
                borderRadius: 999,
                bgcolor: 'rgba(148, 163, 184, 0.18)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                  bgcolor: '#2563EB',
                },
              }}
            />
          </Stack>
        </Stack>
        <Stack spacing={0}>
          {taskIds.length > 0 ? (
            taskIds.map((taskId, index) => (
              <ExecutionSequenceItem
                key={`${taskId}-${index}`}
                taskId={taskId}
                task={tasksById.get(taskId)}
                index={index}
                isLast={index === taskIds.length - 1}
                onTaskClick={onTaskClick}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No execution sequence was provided.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
});

export const CriticalPathCard = memo(function CriticalPathCard({
  taskIds,
  tasksById,
  risk,
  onTaskClick,
}: {
  taskIds: string[];
  tasksById: TaskMap;
  risk?: string | null;
  onTaskClick: (taskId: string) => void;
}) {
  return (
    <Card sx={{ ...shellCardSx, p: 3, height: '100%' }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
          sx={{ minHeight: 32 }}
        >
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, display: 'grid', placeItems: 'center', bgcolor: 'rgba(239, 68, 68, 0.09)' }}>
              <WarningAmberIcon sx={{ color: '#EF4444', fontSize: 18 }} />
            </Box>
            <Typography variant="h6" fontWeight={950}>
              Critical Path
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={850}>
              {taskIds.length} critical tasks
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={850}>
              Total risk:
            </Typography>
            <Chip
              size="small"
              label={titleCase(risk ?? 'HIGH')}
              sx={{
                height: 22,
                borderRadius: 1.5,
                fontWeight: 900,
                color: '#EF4444',
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.22)',
              }}
            />
          </Stack>
        </Stack>
        <Stack spacing={0.1}>
          {taskIds.length > 0 ? (
            taskIds.map((taskId, index) => (
              <CriticalPathItem
                key={`${taskId}-${index}`}
                taskId={taskId}
                task={tasksById.get(taskId)}
                index={index}
                isLast={index === taskIds.length - 1}
                onTaskClick={onTaskClick}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No critical path was provided.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
});

function flowTaskIds(dependencies: WorkflowDependency[], fallbackIds: string[]) {
  const ordered: string[] = [];
  dependencies.forEach((dependency) => {
    if (!ordered.includes(dependency.fromTaskId)) {
      ordered.push(dependency.fromTaskId);
    }
    if (!ordered.includes(dependency.toTaskId)) {
      ordered.push(dependency.toTaskId);
    }
  });

  return ordered.length > 0 ? ordered : fallbackIds;
}

export const DependencyMap = memo(function DependencyMap({
  dependencies,
  tasksById,
  fallbackTaskIds,
  selectedTaskId,
  criticalPathIds,
}: {
  dependencies: WorkflowDependency[];
  tasksById: TaskMap;
  fallbackTaskIds: string[];
  selectedTaskId: string | null;
  criticalPathIds: Set<string>;
}) {
  const [view, setView] = useState<DependencyView>('flow');
  const taskIds = useMemo(() => flowTaskIds(dependencies, fallbackTaskIds), [dependencies, fallbackTaskIds]);

  return (
    <Card sx={{ ...shellCardSx, p: 3 }}>
      <Stack spacing={2.4}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h6" fontWeight={900}>
              Dependency Map
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Finish-to-start execution chain and task ownership.
            </Typography>
          </Box>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={view}
            onChange={(_event, nextView: DependencyView | null) => {
              if (nextView) {
                setView(nextView);
              }
            }}
            sx={{ bgcolor: '#F8FAFC', borderRadius: 2 }}
          >
            <ToggleButton value="flow">Flow</ToggleButton>
            <ToggleButton value="graph">Graph</ToggleButton>
            <ToggleButton value="list">List</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {view === 'flow' ? (
          <Box sx={{ overflowX: 'auto', pb: 1 }}>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 'max-content' }}>
              {taskIds.map((taskId, index) => {
                const edge = dependencies.find((dependency) => dependency.fromTaskId === taskId || dependency.toTaskId === taskId);

                return (
                  <Stack key={`${taskId}-${index}`} direction="row" spacing={1.25} alignItems="center">
                    <MiniTaskCard
                      taskId={taskId}
                      task={tasksById.get(taskId)}
                      critical={criticalPathIds.has(taskId)}
                      selected={selectedTaskId === taskId}
                    />
                    {index < taskIds.length - 1 ? (
                      <Stack spacing={0.4} alignItems="center" sx={{ color: 'text.secondary', minWidth: 92 }}>
                        <Typography variant="caption" fontWeight={900} textTransform="uppercase">
                          {edge?.dependencyType ?? 'FINISH_TO_START'}
                        </Typography>
                        <ArrowForwardIcon fontSize="small" />
                      </Stack>
                    ) : null}
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        ) : null}

        {view === 'graph' ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 1.5 }}>
            {dependencies.length > 0 ? (
              dependencies.map((dependency) => (
                <Box
                  key={`${dependency.fromTaskId}-${dependency.toTaskId}-${dependency.dependencyType}`}
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    bgcolor: '#F8FAFC',
                  }}
                >
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <MiniTaskCard taskId={dependency.fromTaskId} task={tasksById.get(dependency.fromTaskId)} selected={selectedTaskId === dependency.fromTaskId} />
                    <ArrowForwardIcon sx={{ color: '#64748B', flexShrink: 0 }} />
                    <MiniTaskCard taskId={dependency.toTaskId} task={tasksById.get(dependency.toTaskId)} selected={selectedTaskId === dependency.toTaskId} />
                  </Stack>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No dependency edges were provided for graph view.
              </Typography>
            )}
          </Box>
        ) : null}

        {view === 'list' ? (
          <Stack divider={<Divider flexItem />} spacing={0}>
            {dependencies.length > 0 ? (
              dependencies.map((dependency) => (
                <Stack key={`${dependency.fromTaskId}-${dependency.toTaskId}`} direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" sx={{ py: 1.25 }}>
                  <TaskTitle task={tasksById.get(dependency.fromTaskId)} fallbackId={dependency.fromTaskId} />
                  <Chip label={dependency.dependencyType} size="small" sx={{ alignSelf: 'flex-start', borderRadius: 1.5, fontWeight: 850 }} />
                  <TaskTitle task={tasksById.get(dependency.toTaskId)} fallbackId={dependency.toTaskId} />
                </Stack>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                No dependency edges were provided for list view.
              </Typography>
            )}
          </Stack>
        ) : null}

        {dependencies.length === 0 && taskIds.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No dependencies were provided.
          </Typography>
        ) : null}
      </Stack>
    </Card>
  );
});

export const BlockersCard = memo(function BlockersCard({ items, tasksById }: { items: WorkflowImpactItem[]; tasksById: TaskMap }) {
  return (
    <Card sx={{ ...shellCardSx, p: 3, height: '100%' }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <ReportProblemIcon sx={{ color: '#EF4444' }} />
            <Typography variant="h6" fontWeight={900}>
              Blockers
            </Typography>
          </Stack>
          <Button size="small">View all</Button>
        </Stack>
        <Stack spacing={1.25}>
          {items.length > 0 ? (
            items.map((item) => (
              <Stack key={item.taskId} direction="row" spacing={1.2} alignItems="flex-start">
                <Box sx={{ width: 30, height: 30, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: 'rgba(239, 68, 68, 0.08)', color: '#EF4444', flexShrink: 0 }}>
                  <ReportProblemIcon fontSize="small" />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={900}>
                    {tasksById.get(item.taskId)?.title ?? item.taskId}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    blocks {[...item.blockedTaskIds, ...item.downstreamTaskIds].map((taskId) => tasksById.get(taskId)?.title ?? taskId).join(', ') || 'no listed tasks'}
                  </Typography>
                </Box>
              </Stack>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No blockers were detected.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
});

export const DownstreamImpactCard = memo(function DownstreamImpactCard({ items, tasksById }: { items: WorkflowImpactItem[]; tasksById: TaskMap }) {
  return (
    <Card sx={{ ...shellCardSx, p: 3, height: '100%' }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <TrendingUpIcon sx={{ color: '#2563EB' }} />
            <Typography variant="h6" fontWeight={900}>
              Downstream Impact
            </Typography>
          </Stack>
          <Button size="small">View all</Button>
        </Stack>
        <Stack spacing={1.25}>
          {items.length > 0 ? (
            items.map((item) => {
              const count = new Set([...item.blockedTaskIds, ...item.downstreamTaskIds]).size;

              return (
                <Stack key={item.taskId} direction="row" spacing={1.2} alignItems="flex-start">
                  <Box sx={{ width: 30, height: 30, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: 'rgba(37, 99, 235, 0.08)', color: '#2563EB', flexShrink: 0 }}>
                    <TrendingUpIcon fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={900}>
                      {tasksById.get(item.taskId)?.title ?? item.taskId}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      impacts {count} downstream {count === 1 ? 'task' : 'tasks'}
                    </Typography>
                  </Box>
                </Stack>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              No downstream impact was detected.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
});

export const InsightsCard = memo(function InsightsCard({
  insights,
  risk,
  taskCount,
}: {
  insights: string[];
  risk: string | null;
  taskCount: number;
}) {
  const risks = insights.slice(0, 2);
  const optimization = insights.slice(2, 4);

  return (
    <Card sx={{ ...shellCardSx, p: 3, height: '100%', background: 'linear-gradient(180deg, #FFFFFF, rgba(37, 99, 235, 0.035))' }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <InsightsIcon sx={{ color: '#10B981' }} />
          <Typography variant="h6" fontWeight={900}>
            Insights
          </Typography>
        </Stack>
        <Box>
          <Typography variant="subtitle2" fontWeight={900} gutterBottom>
            Workflow Risks
          </Typography>
          {(risks.length > 0 ? risks : [`Workflow risk is ${titleCase(risk)} based on critical path signals.`]).map((item) => (
            <Typography key={item} variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
              • {item}
            </Typography>
          ))}
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={900} gutterBottom>
            Business Impact
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completing this workflow supports {taskCount} coordinated work {taskCount === 1 ? 'item' : 'items'}.
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={900} gutterBottom>
            Optimization Suggestions
          </Typography>
          {(optimization.length > 0 ? optimization : ['Reduce bottleneck pressure by assigning owners to downstream work early.']).map((item) => (
            <Typography key={item} variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
              • {item}
            </Typography>
          ))}
        </Box>
      </Stack>
    </Card>
  );
});

export const WorkflowTasksTable = memo(function WorkflowTasksTable({
  tasks,
  onTaskClick,
}: {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}) {
  const [search, setSearch] = useState('');
  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return tasks;
    }

    return tasks.filter((task) => {
      const haystack = [task.title, task.id, task.requester, task.priority, task.status, ...task.assignees].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [search, tasks]);

  return (
    <Card sx={{ ...shellCardSx, overflow: 'hidden' }}>
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', lg: 'center' }} spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ChecklistIcon sx={{ color: '#2563EB' }} />
            <Typography variant="h6" fontWeight={900}>
              Workflow Tasks
            </Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <TextField
              size="small"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: { xs: '100%', sm: 260 } }}
            />
            <Button variant="outlined" startIcon={<FilterListIcon />}>
              Filter
            </Button>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add Task
            </Button>
            <IconButton aria-label="More task actions" sx={{ border: '1px solid rgba(15, 23, 42, 0.1)' }}>
              <MoreHorizIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
      <TableContainer>
        <Table size="small" sx={{ '& .MuiTableCell-root': { py: 1.35 } }}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Requester</TableCell>
              <TableCell>Assignee(s)</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task, index) => {
              const primaryAssignee = task.assignees[0];

              return (
                <TableRow
                  key={task.id || `${task.title}-${index}`}
                  hover
                  onClick={() => {
                    if (task.id) {
                      onTaskClick(task.id);
                    }
                  }}
                  sx={{
                    cursor: task.id ? 'pointer' : 'default',
                    transition: 'background-color 160ms ease, transform 160ms ease',
                    '&:hover': {
                      bgcolor: 'rgba(37, 99, 235, 0.035)',
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="caption" color="text.secondary" fontWeight={850}>
                      {index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 300 }}>
                    <Typography variant="body2" fontWeight={900}>
                      {task.title || task.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <StatusChip value={task.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityChip value={task.priority} />
                  </TableCell>
                  <TableCell>{task.requester ?? '-'}</TableCell>
                  <TableCell>
                    {primaryAssignee ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AssigneeAvatar name={primaryAssignee} size={24} />
                        <Typography variant="body2">{primaryAssignee}</Typography>
                        {task.assignees.length > 1 ? <Chip size="small" label={`+${task.assignees.length - 1}`} sx={{ borderRadius: 1.5 }} /> : null}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{formatDateTime(task.dueDate)}</TableCell>
                  <TableCell>{formatDateTime(task.createdAt)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="Task actions"
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <MoreHorizIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <Typography variant="caption" color="text.secondary">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </Typography>
      </Box>
    </Card>
  );
});
