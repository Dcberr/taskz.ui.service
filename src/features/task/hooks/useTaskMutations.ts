import { useMutation } from '@tanstack/react-query';
import { updateTaskAssignee, updateTaskPriority, updateTaskStatus } from '../../../api/tasks';
import type { TaskDetail } from '../../../types/task';
import { taskDetailQueryKeys } from './useTaskDetail';
import { queryClient } from '../../../app/queryClient';
import { taskQueryKeys } from './useTasks';

type UpdateTaskInput = {
  taskId: string;
  value: string;
};

function patchTaskDetail(taskId: string, updater: (current: TaskDetail) => TaskDetail) {
  queryClient.setQueryData(taskDetailQueryKeys.detail(taskId), (current: unknown) => {
    if (!current || typeof current !== 'object') {
      return current;
    }

    return updater(current as TaskDetail);
  });

  queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
  queryClient.invalidateQueries({ queryKey: ['dashboard'] });
}

export function useUpdateTaskStatusMutation() {
  return useMutation({
    mutationFn: ({ taskId, value }: UpdateTaskInput) => updateTaskStatus(taskId, { status: value }),
    onMutate: async ({ taskId, value }) => {
      await queryClient.cancelQueries({ queryKey: taskDetailQueryKeys.detail(taskId) });
      const previousTask = queryClient.getQueryData<TaskDetail>(taskDetailQueryKeys.detail(taskId));

      patchTaskDetail(taskId, (current) => ({ ...current, status: value }));

      return { previousTask, taskId };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(taskDetailQueryKeys.detail(context.taskId), context.previousTask);
      }
    },
    onSuccess: (updatedTask) => {
      patchTaskDetail(updatedTask.id, () => updatedTask);
    },
  });
}

export function useUpdateTaskPriorityMutation() {
  return useMutation({
    mutationFn: ({ taskId, value }: UpdateTaskInput) => updateTaskPriority(taskId, { priority: value }),
    onMutate: async ({ taskId, value }) => {
      await queryClient.cancelQueries({ queryKey: taskDetailQueryKeys.detail(taskId) });
      const previousTask = queryClient.getQueryData<TaskDetail>(taskDetailQueryKeys.detail(taskId));

      patchTaskDetail(taskId, (current) => ({ ...current, priority: value }));

      return { previousTask, taskId };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(taskDetailQueryKeys.detail(context.taskId), context.previousTask);
      }
    },
    onSuccess: (updatedTask) => {
      patchTaskDetail(updatedTask.id, () => updatedTask);
    },
  });
}

export function useUpdateTaskAssigneeMutation() {
  return useMutation({
    mutationFn: ({ taskId, value }: UpdateTaskInput) => updateTaskAssignee(taskId, { assignee: value }),
    onMutate: async ({ taskId, value }) => {
      await queryClient.cancelQueries({ queryKey: taskDetailQueryKeys.detail(taskId) });
      const previousTask = queryClient.getQueryData<TaskDetail>(taskDetailQueryKeys.detail(taskId));

      patchTaskDetail(taskId, (current) => ({ ...current, assignee: value.trim() === '' ? null : value }));

      return { previousTask, taskId };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(taskDetailQueryKeys.detail(context.taskId), context.previousTask);
      }
    },
    onSuccess: (updatedTask) => {
      patchTaskDetail(updatedTask.id, () => updatedTask);
    },
  });
}
