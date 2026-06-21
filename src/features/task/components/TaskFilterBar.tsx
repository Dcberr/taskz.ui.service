import {
  Box,
  Button,
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

export function TaskFilterBar({ filters, onChange, onClear }: TaskFilterBarProps) {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
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
            label="Assignee"
            value={filters.assignee}
            onChange={(event) => onChange({ ...filters, assignee: event.target.value })}
            placeholder="Search assignee"
          />
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onClear} disabled={!filters.status && !filters.priority && !filters.assignee}>
            Clear Filters
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
