import { Chip, Stack } from '@mui/material';
import type { WorkflowSummary } from '../../../types/workflow';
import { getPriorityVisual } from '../../task/utils/taskVisuals';

function getRiskSx(risk: string | null) {
  const normalized = risk?.toUpperCase();

  if (normalized === 'HIGH' || normalized === 'CRITICAL') {
    return {
      color: '#b91c1c',
      bgcolor: 'rgba(220, 38, 38, 0.1)',
      borderColor: 'rgba(185, 28, 28, 0.24)',
    };
  }

  if (normalized === 'MEDIUM') {
    return {
      color: '#c2410c',
      bgcolor: 'rgba(249, 115, 22, 0.12)',
      borderColor: 'rgba(194, 65, 12, 0.22)',
    };
  }

  return {
    color: '#0f766e',
    bgcolor: 'rgba(15, 118, 110, 0.1)',
    borderColor: 'rgba(15, 118, 110, 0.22)',
  };
}

export function WorkflowBadges({ summary }: { summary: WorkflowSummary }) {
  const priorityVisual = getPriorityVisual(summary.overallPriority ?? 'MEDIUM');

  return (
    <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
      <Chip
        variant="outlined"
        size="small"
        label={`Risk ${summary.workflowRisk ?? '-'}`}
        sx={{ borderRadius: 1.5, fontWeight: 800, ...getRiskSx(summary.workflowRisk) }}
      />
      <Chip
        variant="outlined"
        size="small"
        label={`Priority ${priorityVisual.label}`}
        sx={priorityVisual.sx}
      />
      <Chip
        variant="outlined"
        size="small"
        label={summary.isActionable ? 'Actionable' : 'Not Actionable'}
        sx={{
          borderRadius: 1.5,
          fontWeight: 700,
          color: summary.isActionable ? '#166534' : '#64748b',
          bgcolor: summary.isActionable ? 'rgba(22, 101, 52, 0.1)' : 'rgba(100, 116, 139, 0.1)',
          borderColor: summary.isActionable ? 'rgba(22, 101, 52, 0.22)' : 'rgba(100, 116, 139, 0.18)',
        }}
      />
      <Chip
        variant="outlined"
        size="small"
        label={`${summary.taskCount} tasks`}
        sx={{
          borderRadius: 1.5,
          fontWeight: 700,
          color: '#334155',
          bgcolor: '#f8fafc',
          borderColor: 'rgba(15, 23, 42, 0.14)',
        }}
      />
    </Stack>
  );
}
