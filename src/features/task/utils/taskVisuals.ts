import type { SxProps, Theme } from '@mui/material/styles';
import type { TaskPriority, TaskStatus } from '../../../types/task';

type ChipSxObject = {
  borderRadius?: number;
  fontWeight?: number;
  height?: number;
  color?: string;
  bgcolor?: string;
  borderColor?: string;
  '& .MuiChip-label'?: {
    px: number;
  };
};

type ChipVisual = {
  label: string;
  sx: SxProps<Theme>;
};

const baseChipSx: ChipSxObject = {
  borderRadius: 1.5,
  fontWeight: 650,
  height: 26,
  '& .MuiChip-label': {
    px: 1.25,
  },
};

function titleCase(value: string): string {
  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function getStatusVisual(status: TaskStatus): ChipVisual {
  const normalized = status.toUpperCase();
  const palette: Record<string, ChipSxObject> = {
    OPEN: {
      color: '#0f766e',
      bgcolor: 'rgba(15, 118, 110, 0.1)',
      borderColor: 'rgba(15, 118, 110, 0.24)',
    },
    IN_PROGRESS: {
      color: '#1d4ed8',
      bgcolor: 'rgba(29, 78, 216, 0.1)',
      borderColor: 'rgba(29, 78, 216, 0.22)',
    },
    COMPLETED: {
      color: '#166534',
      bgcolor: 'rgba(22, 101, 52, 0.1)',
      borderColor: 'rgba(22, 101, 52, 0.22)',
    },
    BLOCKED: {
      color: '#b45309',
      bgcolor: 'rgba(245, 158, 11, 0.14)',
      borderColor: 'rgba(180, 83, 9, 0.24)',
    },
    CANCELLED: {
      color: '#64748b',
      bgcolor: 'rgba(100, 116, 139, 0.12)',
      borderColor: 'rgba(100, 116, 139, 0.22)',
    },
  };

  const visualSx = palette[normalized] ?? palette.OPEN ?? {};

  return {
    label: titleCase(status),
    sx: { ...baseChipSx, ...visualSx },
  };
}

export function getPriorityVisual(priority: TaskPriority): ChipVisual {
  const normalized = priority.toUpperCase();
  const palette: Record<string, ChipSxObject> = {
    LOW: {
      color: '#475569',
      bgcolor: 'rgba(71, 85, 105, 0.08)',
      borderColor: 'rgba(71, 85, 105, 0.18)',
    },
    MEDIUM: {
      color: '#0f766e',
      bgcolor: 'rgba(15, 118, 110, 0.1)',
      borderColor: 'rgba(15, 118, 110, 0.22)',
    },
    HIGH: {
      color: '#c2410c',
      bgcolor: 'rgba(249, 115, 22, 0.12)',
      borderColor: 'rgba(194, 65, 12, 0.22)',
    },
    URGENT: {
      color: '#b91c1c',
      bgcolor: 'rgba(220, 38, 38, 0.12)',
      borderColor: 'rgba(185, 28, 28, 0.24)',
    },
  };

  const visualSx = palette[normalized] ?? palette.MEDIUM ?? {};

  return {
    label: titleCase(priority),
    sx: { ...baseChipSx, ...visualSx },
  };
}

export function getDueDateVisual(value: string | null): ChipVisual {
  if (!value) {
    return {
      label: 'No due date',
      sx: {
        ...baseChipSx,
        color: '#64748b',
        bgcolor: 'rgba(100, 116, 139, 0.08)',
        borderColor: 'rgba(100, 116, 139, 0.18)',
      },
    };
  }

  const dueDate = new Date(value);
  if (Number.isNaN(dueDate.getTime())) {
    return {
      label: value,
      sx: {
        ...baseChipSx,
        color: '#475569',
        bgcolor: 'rgba(71, 85, 105, 0.08)',
        borderColor: 'rgba(71, 85, 105, 0.18)',
      },
    };
  }

  const now = Date.now();
  const hoursUntilDue = (dueDate.getTime() - now) / (1000 * 60 * 60);

  if (hoursUntilDue < 0) {
    return {
      label: 'Overdue',
      sx: {
        ...baseChipSx,
        color: '#b91c1c',
        bgcolor: 'rgba(220, 38, 38, 0.12)',
        borderColor: 'rgba(185, 28, 28, 0.24)',
      },
    };
  }

  if (hoursUntilDue <= 48) {
    return {
      label: 'Due soon',
      sx: {
        ...baseChipSx,
        color: '#c2410c',
        bgcolor: 'rgba(249, 115, 22, 0.12)',
        borderColor: 'rgba(194, 65, 12, 0.22)',
      },
    };
  }

  return {
    label: 'Scheduled',
    sx: {
      ...baseChipSx,
      color: '#0f766e',
      bgcolor: 'rgba(15, 118, 110, 0.1)',
      borderColor: 'rgba(15, 118, 110, 0.22)',
    },
  };
}

export const assigneeChipSx: SxProps<Theme> = {
  height: 24,
  borderRadius: 1.5,
  fontWeight: 600,
  color: '#334155',
  bgcolor: '#f8fafc',
  borderColor: 'rgba(15, 23, 42, 0.12)',
  '& .MuiChip-label': {
    px: 1,
  },
};
