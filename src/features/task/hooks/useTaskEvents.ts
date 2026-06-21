import { useQuery } from '@tanstack/react-query';
import { fetchTaskEvents } from '../../../api/tasks';

export const taskEventQueryKeys = {
  all: ['task-events'] as const,
  list: (taskId: string) => [...taskEventQueryKeys.all, taskId] as const,
};

export function useTaskEvents(taskId: string | null) {
  return useQuery({
    queryKey: taskId ? taskEventQueryKeys.list(taskId) : taskEventQueryKeys.all,
    queryFn: () => {
      if (!taskId) {
        throw new Error('Task ID is required.');
      }

      return fetchTaskEvents(taskId);
    },
    enabled: Boolean(taskId),
  });
}
