import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import type { TaskDetail, TaskPriority, TaskStatus } from '../../../types/task';
import { useUpdateTaskAssigneeMutation, useUpdateTaskPriorityMutation, useUpdateTaskStatusMutation } from '../hooks/useTaskMutations';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { useToast } from '../../../components/ToastProvider';

type TaskActionFormProps = {
  task: TaskDetail;
};

const statusOptions: Array<{ label: string; value: TaskStatus }> = [
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Blocked', value: 'BLOCKED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const priorityOptions: Array<{ label: string; value: TaskPriority }> = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Urgent', value: 'URGENT' },
];

type FormState = {
  status: string;
  priority: string;
  assignee: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.status.trim()) {
    errors.status = 'Status is required.';
  }

  if (!values.priority.trim()) {
    errors.priority = 'Priority is required.';
  }

  return errors;
}

export function TaskActionForm({ task }: TaskActionFormProps) {
  const { showToast } = useToast();
  const [values, setValues] = useState<FormState>({
    status: task.status,
    priority: task.priority,
    assignee: task.assignee ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const statusMutation = useUpdateTaskStatusMutation();
  const priorityMutation = useUpdateTaskPriorityMutation();
  const assigneeMutation = useUpdateTaskAssigneeMutation();

  const isSubmitting = statusMutation.isPending || priorityMutation.isPending || assigneeMutation.isPending;

  const hasChanges = useMemo(
    () =>
      values.status !== task.status ||
      values.priority !== task.priority ||
      values.assignee !== (task.assignee ?? ''),
    [task.assignee, task.priority, task.status, values.assignee, values.priority, values.status],
  );

  useEffect(() => {
    setValues({
      status: task.status,
      priority: task.priority,
      assignee: task.assignee ?? '',
    });
    setErrors({});
    setSuccessMessage(null);
    setConfirmOpen(false);
  }, [task.assignee, task.priority, task.status, task.id]);

  const handleSubmit = async () => {
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setConfirmOpen(true);
  };

  const executeSave = async () => {
    setConfirmOpen(false);

    try {
      const mutations: Array<Promise<unknown>> = [];

      if (values.status !== task.status) {
        mutations.push(statusMutation.mutateAsync({ taskId: task.id, value: values.status }));
      }

      if (values.priority !== task.priority) {
        mutations.push(priorityMutation.mutateAsync({ taskId: task.id, value: values.priority }));
      }

      if (values.assignee !== (task.assignee ?? '')) {
        mutations.push(assigneeMutation.mutateAsync({ taskId: task.id, value: values.assignee }));
      }

      await Promise.all(mutations);
      setSuccessMessage('Task updated successfully.');
      showToast({ message: 'Task updated successfully.', severity: 'success' });
    } catch {
      setSuccessMessage(null);
      showToast({ message: 'Unable to update task.', severity: 'error' });
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="subtitle1" fontWeight={700}>
          Update Task
        </Typography>
        <TextField
          select
          fullWidth
          label="Status"
          value={values.status}
          onChange={(event) => setValues((current) => ({ ...current, status: event.target.value }))}
          error={Boolean(errors.status)}
          helperText={errors.status}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          label="Priority"
          value={values.priority}
          onChange={(event) => setValues((current) => ({ ...current, priority: event.target.value }))}
          error={Boolean(errors.priority)}
          helperText={errors.priority}
        >
          {priorityOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Assignee"
          value={values.assignee}
          onChange={(event) => setValues((current) => ({ ...current, assignee: event.target.value }))}
          error={Boolean(errors.assignee)}
          helperText={errors.assignee ?? 'Leave blank to unassign the task.'}
        />
        {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleSubmit} variant="contained" disabled={!hasChanges || isSubmitting}>
            Save
          </Button>
        </Box>
        <ConfirmDialog
          open={confirmOpen}
          title="Save task changes?"
          description="This will update the selected task with the values shown in the form."
          confirmLabel="Save changes"
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            void executeSave();
          }}
          loading={isSubmitting}
        />
      </Stack>
    </Paper>
  );
}
