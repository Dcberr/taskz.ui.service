export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | string;
export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'CANCELLED' | string;

export type Task = {
  id: string;
  title: string;
  description: string | null;
  assignees: string[];
  requester: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
};

export type TaskDetail = Task & {
  source: string | null;
  sourceMessageId: string | null;
  aiConfidence: number | null;
  updatedAt: string | null;
  completedAt: string | null;
};

export type TaskEventType =
  | 'TASK_CREATED'
  | 'STATUS_CHANGED'
  | 'PRIORITY_CHANGED'
  | 'ASSIGNEE_CHANGED'
  | 'TASK_COMPLETED'
  | 'TASK_CANCELLED'
  | string;

export type TaskEvent = {
  id: string;
  type: TaskEventType;
  title: string;
  description: string | null;
  createdAt: string;
};

export type SortDirection = 'asc' | 'desc';

export type TaskListParams = {
  page: number;
  size: number;
  sortBy: 'title' | 'assignee' | 'requester' | 'priority' | 'status' | 'dueDate' | 'createdAt';
  sortDirection: SortDirection;
  status?: string;
  priority?: string;
  assignee?: string;
};

export type TaskListResponse = {
  items: Task[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};
