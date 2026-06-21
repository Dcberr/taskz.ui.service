import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  Stack,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { EmptyState, ErrorState, LoadingState } from '../../../components/FeedbackState';
import { TaskTableSkeleton } from '../../../components/Skeletons';
import type { SortDirection, Task, TaskListResponse } from '../../../types/task';
import { formatDateTime } from '../../../utils/date';

type SortableColumn = keyof Pick<Task, 'title' | 'assignee' | 'requester' | 'priority' | 'status' | 'dueDate' | 'createdAt'>;

type TaskTableProps = {
  data?: TaskListResponse;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage: string;
  sortBy: SortableColumn;
  sortDirection: SortDirection;
  onSortChange: (column: SortableColumn) => void;
  onRefresh: () => void;
  onTaskClick: (taskId: string) => void;
};

const columns: Array<{ key: SortableColumn; label: string }> = [
  { key: 'title', label: 'Title' },
  { key: 'assignee', label: 'Assignee' },
  { key: 'requester', label: 'Requester' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'createdAt', label: 'Created At' },
];

function formatDate(value: string | null): string {
  return formatDateTime(value);
}

export function TaskTable({
  data,
  isLoading,
  isFetching,
  isError,
  errorMessage,
  sortBy,
  sortDirection,
  onSortChange,
  onRefresh,
  onTaskClick,
}: TaskTableProps) {
  if (isLoading) {
    return (
      <Stack spacing={2}>
        <LoadingState title="Loading tasks" description="Fetching the latest tasks from the backend." />
        <TaskTableSkeleton />
      </Stack>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load tasks"
        description={errorMessage}
        action={
          <Tooltip title="Retry">
            <IconButton color="inherit" onClick={onRefresh} size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      />
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="There are no tasks to display for the current filters."
        action={
          <Tooltip title="Refresh">
            <IconButton onClick={onRefresh} size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      />
    );
  }

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Task List
        </Typography>
        <Tooltip title="Refresh">
          <span>
            <IconButton onClick={onRefresh} disabled={isFetching} size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <TableSortLabel
                    active={sortBy === column.key}
                    direction={sortBy === column.key ? sortDirection : 'asc'}
                    onClick={() => onSortChange(column.key)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items.map((task) => (
              <TableRow key={task.id} hover sx={{ cursor: 'pointer' }} onClick={() => onTaskClick(task.id)}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.assignee ?? '-'}</TableCell>
                <TableCell>{task.requester ?? '-'}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{formatDate(task.dueDate)}</TableCell>
                <TableCell>{formatDate(task.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
