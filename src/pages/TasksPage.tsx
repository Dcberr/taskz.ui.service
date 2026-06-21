import { Box, Pagination, Paper, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TaskDetailDrawer } from '../features/task/components/TaskDetailDrawer';
import { TaskTable } from '../features/task/components/TaskTable';
import { useTasks } from '../features/task/hooks/useTasks';
import { useTaskDetail } from '../features/task/hooks/useTaskDetail';
import type { SortDirection, TaskListParams } from '../types/task';
import { useAppTitle } from '../hooks/useAppTitle';
import { TaskFilterBar } from '../features/task/components/TaskFilterBar';
import { useTaskFilters } from '../features/task/hooks/useTaskFilters';

const defaultSortBy: TaskListParams['sortBy'] = 'createdAt';
const defaultSortDirection: SortDirection = 'desc';
const pageSize = 10;

export function TasksPage() {
  useAppTitle('Taskz | Tasks');

  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<TaskListParams['sortBy']>(defaultSortBy);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const { filters, updateFilters, clearFilters } = useTaskFilters();
  const selectedTaskId = searchParams.get('taskId');

  const page = useMemo(() => {
    const parsedPage = Number(searchParams.get('page') ?? '1');
    return Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1;
  }, [searchParams]);

  const params = useMemo<TaskListParams>(
    () => ({
      page: page - 1,
      size: pageSize,
      sortBy,
      sortDirection,
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      assignee: filters.assignee || undefined,
    }),
    [filters.assignee, filters.priority, filters.status, page, sortBy, sortDirection],
  );

  const tasksQuery = useTasks(params);
  const taskDetailQuery = useTaskDetail(selectedTaskId);

  const handleSortChange = (column: TaskListParams['sortBy']) => {
    if (column === sortBy) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortBy(column);
    setSortDirection('asc');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', '1');
    setSearchParams(nextParams, { replace: true });
  };

  const handleRefresh = () => {
    void tasksQuery.refetch();
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(nextPage));
    setSearchParams(nextParams, { replace: true });
  };

  const handleTaskClick = (taskId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('taskId', taskId);
    setSearchParams(nextParams, { replace: true });
  };

  const handleDrawerClose = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('taskId');
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Tasks
        </Typography>
        <Typography color="text.secondary">
          Displaying tasks from the backend with pagination, sorting, and filters.
        </Typography>
      </Box>

      <TaskFilterBar
        filters={filters}
        onChange={(nextFilters) => {
          updateFilters(nextFilters);
        }}
        onClear={() => {
          clearFilters();
        }}
      />

      <TaskTable
        data={tasksQuery.data}
        isLoading={tasksQuery.isLoading}
        isFetching={tasksQuery.isFetching}
        isError={tasksQuery.isError}
        errorMessage={tasksQuery.error instanceof Error ? tasksQuery.error.message : 'Failed to load tasks.'}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onRefresh={handleRefresh}
        onTaskClick={handleTaskClick}
      />

      <Paper sx={{ px: 2, py: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {tasksQuery.data
              ? `Showing ${tasksQuery.data.items.length} of ${tasksQuery.data.totalItems} tasks`
              : 'Loading tasks...'}
          </Typography>
          <Pagination
            color="primary"
            page={page}
            count={tasksQuery.data?.totalPages ?? 0}
            onChange={handlePageChange}
            disabled={!tasksQuery.data || tasksQuery.data.totalPages <= 1}
          />
        </Stack>
      </Paper>

      <TaskDetailDrawer
        open={Boolean(selectedTaskId)}
        taskId={selectedTaskId}
        task={taskDetailQuery.data}
        isLoading={taskDetailQuery.isLoading}
        isError={taskDetailQuery.isError}
        errorMessage={taskDetailQuery.error instanceof Error ? taskDetailQuery.error.message : 'Failed to load task details.'}
        onClose={handleDrawerClose}
      />
    </Stack>
  );
}
