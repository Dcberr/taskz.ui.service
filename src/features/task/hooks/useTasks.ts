import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../../../api/tasks';
import type { TaskListParams } from '../../../types/task';

export const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (params: TaskListParams) => [...taskQueryKeys.lists(), params] as const,
};

export function useTasks(params: TaskListParams) {
  return useQuery({
    queryKey: taskQueryKeys.list(params),
    queryFn: () => fetchTasks(params),
  });
}
