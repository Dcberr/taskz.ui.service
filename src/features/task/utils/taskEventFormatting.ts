import type { TaskEvent, TaskEventType } from '../../../types/task';

const eventLabels: Record<string, string> = {
  TASK_CREATED: 'Task Created',
  STATUS_CHANGED: 'Status Changed',
  PRIORITY_CHANGED: 'Priority Changed',
  ASSIGNEE_CHANGED: 'Assignees Changed',
  TASK_COMPLETED: 'Completed',
  TASK_CANCELLED: 'Cancelled',
};

export function formatTaskEventTitle(event: TaskEvent): string {
  return event.title.trim() || eventLabels[event.type] || event.type.replaceAll('_', ' ');
}

export function formatTaskEventDescription(event: TaskEvent): string | null {
  return event.description && event.description.trim() !== '' ? event.description : null;
}

export function formatTaskEventType(type: TaskEventType): string {
  return eventLabels[type] ?? type.replaceAll('_', ' ');
}
