import { httpClient } from './httpClient';
import type { Task, TaskDetail, TaskEvent, TaskListParams, TaskListResponse } from '../types/task';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function toStringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value : null;
}

function toTask(value: unknown): Task {
  if (!isRecord(value)) {
    throw new Error('Invalid task payload received from server.');
  }

  const dueDate = toStringOrNull(value.dueDate ?? value.dueDateTime);

  return {
    id: String(value.id ?? ''),
    title: String(value.title ?? ''),
    description: toStringOrNull(value.description),
    assignee: toStringOrNull(value.assignee),
    requester: toStringOrNull(value.requester),
    priority: String(value.priority ?? ''),
    status: String(value.status ?? ''),
    dueDate,
    createdAt: String(value.createdAt ?? ''),
  };
}

function toTaskDetail(value: unknown): TaskDetail {
  if (!isRecord(value)) {
    throw new Error('Invalid task detail payload received from server.');
  }

  const aiConfidenceValue = value.aiConfidence;
  const aiConfidence =
    typeof aiConfidenceValue === 'number' && Number.isFinite(aiConfidenceValue)
      ? aiConfidenceValue
      : typeof aiConfidenceValue === 'string' && aiConfidenceValue.trim() !== '' && Number.isFinite(Number(aiConfidenceValue))
        ? Number(aiConfidenceValue)
        : null;

  return {
    ...toTask(value),
    source: toStringOrNull(value.source),
    sourceMessageId: toStringOrNull(value.sourceMessageId),
    aiConfidence,
    updatedAt: toStringOrNull(value.updatedAt),
    completedAt: toStringOrNull(value.completedAt),
  };
}

function toTaskEvent(value: unknown): TaskEvent {
  if (!isRecord(value)) {
    throw new Error('Invalid task event payload received from server.');
  }

  const eventType = String(value.type ?? value.eventType ?? '');

  return {
    id: String(value.id ?? `${eventType}-${String(value.createdAt ?? value.timestamp ?? '')}`),
    type: eventType,
    title: String(value.title ?? ''),
    description: toStringOrNull(value.description ?? value.details ?? value.message),
    createdAt: String(value.createdAt ?? value.timestamp ?? ''),
  };
}

function toNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeResponse(data: unknown, params: TaskListParams): TaskListResponse {
  if (Array.isArray(data)) {
    return {
      items: data.map(toTask),
      page: params.page,
      size: params.size,
      totalItems: data.length,
      totalPages: 1,
    };
  }

  if (!isRecord(data)) {
    throw new Error('Invalid task list payload received from server.');
  }

  const itemsSource = Array.isArray(data.content)
    ? data.content
    : Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.data)
        ? data.data
        : [];

  const totalItems = toNumber(data.totalElements ?? data.totalItems ?? data.total ?? itemsSource.length, itemsSource.length);
  const size = toNumber(data.size, params.size);
  const page = toNumber(data.number ?? data.page, params.page);
  const totalPages = toNumber(data.totalPages, Math.max(1, Math.ceil(totalItems / Math.max(size, 1))));

  return {
    items: itemsSource.map(toTask),
    page,
    size,
    totalItems,
    totalPages,
  };
}

export async function fetchTasks(params: TaskListParams): Promise<TaskListResponse> {
  const response = await httpClient.get('/api/tasks', {
    params: {
      page: params.page,
      size: params.size,
      sort: `${params.sortBy},${params.sortDirection}`,
      status: params.status || undefined,
      priority: params.priority || undefined,
      assignee: params.assignee || undefined,
    },
  });

  return normalizeResponse(response.data, params);
}

export async function fetchTaskById(taskId: string): Promise<TaskDetail> {
  const response = await httpClient.get(`/api/tasks/${taskId}`);
  return toTaskDetail(response.data);
}

type UpdateTaskStatusPayload = {
  status: string;
};

type UpdateTaskPriorityPayload = {
  priority: string;
};

type UpdateTaskAssigneePayload = {
  assignee: string;
};

export async function updateTaskStatus(taskId: string, payload: UpdateTaskStatusPayload): Promise<TaskDetail> {
  const response = await httpClient.patch(`/api/tasks/${taskId}/status`, payload);
  return toTaskDetail(response.data);
}

export async function updateTaskPriority(taskId: string, payload: UpdateTaskPriorityPayload): Promise<TaskDetail> {
  const response = await httpClient.patch(`/api/tasks/${taskId}/priority`, payload);
  return toTaskDetail(response.data);
}

export async function updateTaskAssignee(taskId: string, payload: UpdateTaskAssigneePayload): Promise<TaskDetail> {
  const response = await httpClient.patch(`/api/tasks/${taskId}/assignee`, payload);
  return toTaskDetail(response.data);
}

export async function fetchTaskEvents(taskId: string): Promise<TaskEvent[]> {
  const response = await httpClient.get(`/api/tasks/${taskId}/events`);

  if (Array.isArray(response.data)) {
    return response.data.map(toTaskEvent);
  }

  if (isRecord(response.data)) {
    const itemsSource = Array.isArray(response.data.content)
      ? response.data.content
      : Array.isArray(response.data.items)
        ? response.data.items
        : Array.isArray(response.data.data)
          ? response.data.data
          : [];

    return itemsSource.map(toTaskEvent);
  }

  throw new Error('Invalid task event payload received from server.');
}
