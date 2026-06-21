import type { Task } from './task';

export type DashboardTaskBucket = 'open' | 'completed';

export type DashboardSummary = {
  openTasks: number;
  completedTasks: number;
  blockedTasks: number;
  urgentTasks: number;
};

export type DashboardSection = {
  title: string;
  tasks: Task[];
};
