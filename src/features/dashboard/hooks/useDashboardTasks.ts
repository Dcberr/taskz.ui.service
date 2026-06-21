import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../../../api/httpClient';
import type { Task } from '../../../types/task';
import type { DashboardTaskBucket } from '../../../types/dashboard';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function toStringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value : null;
}

function toTask(value: unknown): Task {
  if (!isRecord(value)) {
    throw new Error('Invalid dashboard task payload received from server.');
  }

  return {
    id: String(value.id ?? ''),
    title: String(value.title ?? ''),
    description: typeof value.description === 'string' && value.description.trim() !== '' ? value.description : null,
    assignee: toStringOrNull(value.assignee),
    requester: toStringOrNull(value.requester),
    priority: String(value.priority ?? ''),
    status: String(value.status ?? ''),
    dueDate: toStringOrNull(value.dueDate ?? value.dueDateTime),
    createdAt: String(value.createdAt ?? ''),
  };
}

function normalizeTasks(data: unknown): Task[] {
  if (Array.isArray(data)) {
    return data.map(toTask);
  }

  if (!isRecord(data)) {
    throw new Error('Invalid dashboard tasks payload received from server.');
  }

  const itemsSource = Array.isArray(data.content)
    ? data.content
    : Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.data)
        ? data.data
        : [];

  return itemsSource.map(toTask);
}

async function fetchDashboardTasks(bucket: DashboardTaskBucket): Promise<Task[]> {
  const response = await httpClient.get(`/api/tasks/${bucket}`);
  return normalizeTasks(response.data);
}

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  tasks: () => [...dashboardQueryKeys.all, 'tasks'] as const,
  bucket: (bucket: DashboardTaskBucket) => [...dashboardQueryKeys.tasks(), bucket] as const,
};

export function useDashboardTasks(bucket: DashboardTaskBucket) {
  return useQuery({
    queryKey: dashboardQueryKeys.bucket(bucket),
    queryFn: () => fetchDashboardTasks(bucket),
  });
}
