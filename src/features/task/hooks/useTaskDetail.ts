import { useQuery } from '@tanstack/react-query';
import { fetchTaskById } from '../../../api/tasks';

export const taskDetailQueryKeys = {
  all: ['task-detail'] as const,
  detail: (taskId: string) => [...taskDetailQueryKeys.all, taskId] as const,
};

export function useTaskDetail(taskId: string | null) {
  return useQuery({
    queryKey: taskId ? taskDetailQueryKeys.detail(taskId) : taskDetailQueryKeys.all,
    queryFn: () => {
      if (!taskId) {
        throw new Error('Task ID is required.');
      }

      return fetchTaskById(taskId);
    },
    enabled: Boolean(taskId),
  });
}
