import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import type { TaskFilters } from '../hooks/useTaskFilters';

type TaskFilterBarProps = {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  onClear: () => void;
};

function formatFilterValue(value: string): string {
  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function TaskFilterBar({ filters, onChange, onClear }: TaskFilterBarProps) {
  const activeFilters = [
    filters.status ? { key: 'status', label: `Status: ${formatFilterValue(filters.status)}` } : null,
    filters.priority ? { key: 'priority', label: `Priority: ${formatFilterValue(filters.priority)}` } : null,
    filters.assignee ? { key: 'assignee', label: `Assignees: ${filters.assignee}` } : null,
  ].filter((item): item is { key: keyof TaskFilters; label: string } => Boolean(item));

  return (
    <Paper sx={{ p: 2.25, borderRadius: 2.5, bgcolor: '#ffffff' }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }}>
          <FormControl fullWidth>
            <InputLabel id="task-filter-status-label">Status</InputLabel>
            <Select
              labelId="task-filter-status-label"
              label="Status"
              value={filters.status}
              onChange={(event) => onChange({ ...filters, status: event.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="OPEN">Open</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="BLOCKED">Blocked</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="task-filter-priority-label">Priority</InputLabel>
            <Select
              labelId="task-filter-priority-label"
              label="Priority"
              value={filters.priority}
              onChange={(event) => onChange({ ...filters, priority: event.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="URGENT">Urgent</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Assignees"
            value={filters.assignee}
            onChange={(event) => onChange({ ...filters, assignee: event.target.value })}
            placeholder="Search assignees"
          />
          <Button
            variant="outlined"
            onClick={onClear}
            disabled={!filters.status && !filters.priority && !filters.assignee}
            sx={{ minWidth: { xs: '100%', md: 112 }, height: 56 }}
          >
            Clear
          </Button>
        </Stack>
        {activeFilters.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {activeFilters.map((filter) => (
              <Chip
                key={filter.key}
                label={filter.label}
                onDelete={() => onChange({ ...filters, [filter.key]: '' })}
                size="small"
                sx={{
                  borderRadius: 1.5,
                  bgcolor: 'rgba(15, 118, 110, 0.1)',
                  color: 'primary.dark',
                  fontWeight: 700,
                }}
              />
            ))}
          </Box>
        ) : null}
      </Stack>
    </Paper>
  );
}
