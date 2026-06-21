import { useSearchParams } from 'react-router-dom';

export type TaskFilters = {
  status: string;
  priority: string;
  assignee: string;
};

export const taskFilterQueryKeys = {
  status: 'status',
  priority: 'priority',
  assignee: 'assignee',
} as const;

export function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: TaskFilters = {
    status: searchParams.get(taskFilterQueryKeys.status) ?? '',
    priority: searchParams.get(taskFilterQueryKeys.priority) ?? '',
    assignee: searchParams.get(taskFilterQueryKeys.assignee) ?? '',
  };

  const updateFilters = (nextFilters: TaskFilters) => {
    const nextParams = new URLSearchParams(searchParams);

    (Object.entries(nextFilters) as Array<[keyof TaskFilters, string]>).forEach(([key, value]) => {
      if (value.trim() === '') {
        nextParams.delete(key);
        return;
      }

      nextParams.set(key, value.trim());
    });

    nextParams.set('page', '1');
    setSearchParams(nextParams, { replace: true });
  };

  const clearFilters = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete(taskFilterQueryKeys.status);
    nextParams.delete(taskFilterQueryKeys.priority);
    nextParams.delete(taskFilterQueryKeys.assignee);
    nextParams.set('page', '1');
    setSearchParams(nextParams, { replace: true });
  };

  return { filters, updateFilters, clearFilters };
}
