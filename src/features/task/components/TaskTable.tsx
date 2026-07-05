import {
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { EmptyState, ErrorState, LoadingState } from '../../../components/FeedbackState';
import { TaskTableSkeleton } from '../../../components/Skeletons';
import type { SortDirection, TaskListResponse } from '../../../types/task';
import { formatDateTime } from '../../../utils/date';
import { assigneeChipSx, getDueDateVisual, getPriorityVisual, getStatusVisual } from '../utils/taskVisuals';

type TaskSortableColumn = 'title' | 'assignee' | 'requester' | 'priority' | 'status' | 'dueDate' | 'createdAt';

type TaskTableProps = {
  data: TaskListResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage: string;
  sortBy: TaskSortableColumn;
  sortDirection: SortDirection;
  onSortChange: (column: TaskSortableColumn) => void;
  onRefresh: () => void;
  onTaskClick: (taskId: string) => void;
};

const columns: Array<{ key: TaskSortableColumn; label: string }> = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
  { key: 'assignee', label: 'Assignees' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'requester', label: 'Requester' },
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
    <Paper sx={{ overflow: 'hidden', borderRadius: 2.5, bgcolor: '#ffffff' }}>
      <Box
        sx={{
          px: 2.5,
          py: 1.85,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1" fontWeight={800}>
          Task Queue
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
        <Table size="small" sx={{ '& .MuiTableCell-root': { py: 1.25 } }}>
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
            {data.items.map((task) => {
              const statusVisual = getStatusVisual(task.status);
              const priorityVisual = getPriorityVisual(task.priority);
              const dueDateVisual = getDueDateVisual(task.dueDate);

              return (
                <TableRow
                  key={task.id}
                  hover
                  sx={{
                    cursor: 'pointer',
                    '&:last-child td': { borderBottom: 0 },
                    '&:hover': {
                      bgcolor: 'rgba(15, 118, 110, 0.04)',
                    },
                  }}
                  onClick={() => onTaskClick(task.id)}
                >
                  <TableCell sx={{ minWidth: 260 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight={800} color="text.primary">
                        {task.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created {formatDate(task.createdAt)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip variant="outlined" size="small" label={statusVisual.label} sx={statusVisual.sx} />
                  </TableCell>
                  <TableCell>
                    <Chip variant="outlined" size="small" label={priorityVisual.label} sx={priorityVisual.sx} />
                  </TableCell>
                  <TableCell sx={{ minWidth: 180 }}>
                    {task.assignees.length > 0 ? (
                      <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.75}>
                        {task.assignees.slice(0, 3).map((assignee) => (
                          <Chip key={assignee} variant="outlined" size="small" label={assignee} sx={assigneeChipSx} />
                        ))}
                        {task.assignees.length > 3 ? (
                          <Chip variant="outlined" size="small" label={`+${task.assignees.length - 3}`} sx={assigneeChipSx} />
                        ) : null}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Unassigned
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: 150 }}>
                    <Stack spacing={0.5} alignItems="flex-start">
                      <Chip variant="outlined" size="small" label={dueDateVisual.label} sx={dueDateVisual.sx} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(task.dueDate)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{task.requester ?? '-'}</TableCell>
                  <TableCell>{formatDate(task.createdAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
