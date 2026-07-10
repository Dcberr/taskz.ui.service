import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getApiErrorMessage } from '../api/errors';
import { EmptyState, ErrorState, LoadingState } from '../components/FeedbackState';
import { TaskDetailDialog } from '../features/task/components/TaskDetailDialog';
import { useTaskDetail } from '../features/task/hooks/useTaskDetail';
import {
  BlockersCard,
  CriticalPathCard,
  DependencyMap,
  DownstreamImpactCard,
  ExecutionSequenceCard,
  InsightsCard,
  WorkflowHeader,
  WorkflowSummary,
  WorkflowTasksTable,
} from '../features/workflow/components/WorkflowDetailSections';
import { useWorkflow } from '../features/workflow/hooks/useWorkflow';
import { useAppTitle } from '../hooks/useAppTitle';

export function WorkflowDetailPage() {
  const { workflowId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTaskId = searchParams.get('taskId');

  useAppTitle(workflowId ? `Task | Workflow ${workflowId}` : 'Task | Workflow');

  const workflowQuery = useWorkflow(workflowId || null);
  const taskDetailQuery = useTaskDetail(selectedTaskId);

  const workflow = workflowQuery.data;
  const tasksById = useMemo(() => new Map((workflow?.tasks ?? []).filter((task) => task.id).map((task) => [task.id, task])), [workflow?.tasks]);
  const criticalPathIds = useMemo(() => new Set(workflow?.criticalPathTaskIds ?? []), [workflow?.criticalPathTaskIds]);

  const handleTaskClick = (taskId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('taskId', taskId);
    setSearchParams(nextParams, { replace: true });
  };

  const handleDetailClose = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('taskId');
    setSearchParams(nextParams, { replace: true });
  };

  if (workflowQuery.isLoading) {
    return <LoadingState title="Loading workflow" description="Fetching workflow sequence, blockers, and impact details." />;
  }

  if (workflowQuery.isError) {
    return (
      <ErrorState
        title="Unable to load workflow"
        description={getApiErrorMessage(workflowQuery.error, 'Failed to load workflow.')}
        action={
          <Tooltip title="Retry">
            <IconButton color="inherit" onClick={() => void workflowQuery.refetch()} size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      />
    );
  }

  if (!workflow) {
    return <EmptyState title="Workflow not found" description="No workflow data is available for this ID." />;
  }

  return (
    <Box sx={{ mx: 'auto', width: '100%' }}>
      <Stack spacing={3}>
        <WorkflowHeader workflow={workflow} />

        <WorkflowSummary summary={workflow.summary} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1fr 1fr' }, gap: 3 }}>
          <ExecutionSequenceCard
            taskIds={workflow.executionSequenceTaskIds}
            tasksById={tasksById}
            criticalPathIds={criticalPathIds}
            onTaskClick={handleTaskClick}
          />
          <CriticalPathCard
            taskIds={workflow.criticalPathTaskIds}
            tasksById={tasksById}
            risk={workflow.summary.workflowRisk}
            onTaskClick={handleTaskClick}
          />
        </Box>

        <DependencyMap
          dependencies={workflow.dependencies}
          tasksById={tasksById}
          fallbackTaskIds={workflow.executionSequenceTaskIds}
          selectedTaskId={selectedTaskId}
          criticalPathIds={criticalPathIds}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }, gap: 3 }}>
          <BlockersCard items={workflow.blockers} tasksById={tasksById} />
          <DownstreamImpactCard items={workflow.downstreamImpact} tasksById={tasksById} />
          <InsightsCard insights={workflow.insights} risk={workflow.summary.workflowRisk} taskCount={workflow.summary.taskCount} />
        </Box>

        <WorkflowTasksTable tasks={workflow.tasks} onTaskClick={handleTaskClick} />

        <TaskDetailDialog
          open={Boolean(selectedTaskId)}
          taskId={selectedTaskId}
          task={taskDetailQuery.data}
          isLoading={taskDetailQuery.isLoading}
          isError={taskDetailQuery.isError}
          errorMessage={getApiErrorMessage(taskDetailQuery.error, 'Failed to load task details.')}
          onClose={handleDetailClose}
        />
      </Stack>
    </Box>
  );
}
