import type { Task } from '../types/task';
import type {
  WorkflowDependency,
  WorkflowDetails,
  WorkflowImpactItem,
  WorkflowReasoning,
  WorkflowResponse,
  WorkflowSummary,
} from '../types/workflow';
import { normalizeAssignees } from '../utils/assignees';

export type UnknownRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

export function toStringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value : null;
}

export function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : String(item ?? '').trim()))
    .filter(Boolean);
}

export function toNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
    return Number(value);
  }

  return fallback;
}

export function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
  }

  return fallback;
}

export function toTask(value: unknown): Task {
  if (!isRecord(value)) {
    throw new Error('Invalid task payload received from server.');
  }

  const dueDate = toStringOrNull(value.dueDate ?? value.dueDateTime);
  const id = String(value.id ?? value.taskId ?? '');

  return {
    id,
    title: String(value.title ?? ''),
    description: toStringOrNull(value.description),
    assignees: normalizeAssignees(value.assignees ?? value.assignee),
    requester: toStringOrNull(value.requester),
    priority: String(value.priority ?? ''),
    status: String(value.status ?? ''),
    dueDate,
    createdAt: String(value.createdAt ?? ''),
  };
}

export function toWorkflowReasoning(value: unknown): WorkflowReasoning {
  const source = isRecord(value) ? value : {};

  return {
    businessImpact: toStringOrNull(source.businessImpact),
    urgencyReason: toStringOrNull(source.urgencyReason),
    confidenceReason: toStringOrNull(source.confidenceReason),
  };
}

export function toWorkflowDetails(value: unknown): WorkflowDetails | null {
  if (!isRecord(value)) {
    return null;
  }

  return {
    workflowId: toStringOrNull(value.workflowId),
    analysisId: toStringOrNull(value.analysisId),
    workflowProposalId: toStringOrNull(value.workflowProposalId),
    taskProposalId: toStringOrNull(value.taskProposalId),
    taskType: toStringOrNull(value.taskType),
    reasoning: toWorkflowReasoning(value.reasoning),
    evidence: toStringArray(value.evidence),
    blockedByTaskIds: toStringArray(value.blockedByTaskIds),
    blockedByTasks: Array.isArray(value.blockedByTasks) ? value.blockedByTasks.map(toTask) : [],
    blockedByProposalIds: toStringArray(value.blockedByProposalIds),
    blocksTaskIds: toStringArray(value.blocksTaskIds),
    blocksTasks: Array.isArray(value.blocksTasks) ? value.blocksTasks.map(toTask) : [],
    blocksProposalIds: toStringArray(value.blocksProposalIds),
    dependencyCount: toNumber(value.dependencyCount, 0),
    isCritical: toBoolean(value.isCritical),
    workflowImpact: toStringOrNull(value.workflowImpact),
  };
}

function toWorkflowSummary(value: unknown): WorkflowSummary {
  const source = isRecord(value) ? value : {};

  return {
    isActionable: toBoolean(source.isActionable),
    taskCount: toNumber(source.taskCount, 0),
    workflowRisk: toStringOrNull(source.workflowRisk),
    overallPriority: toStringOrNull(source.overallPriority),
    primaryAssignees: toStringArray(source.primaryAssignees),
  };
}

function toWorkflowDependency(value: unknown): WorkflowDependency | null {
  if (!isRecord(value)) {
    return null;
  }

  const fromTaskId = toStringOrNull(value.fromTaskId);
  const toTaskId = toStringOrNull(value.toTaskId);

  if (!fromTaskId || !toTaskId) {
    return null;
  }

  return {
    fromTaskId,
    toTaskId,
    dependencyType: String(value.dependencyType ?? 'BLOCKS'),
  };
}

function toWorkflowImpactItem(value: unknown): WorkflowImpactItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const taskId = toStringOrNull(value.taskId);

  if (!taskId) {
    return null;
  }

  return {
    taskId,
    blockedTaskIds: toStringArray(value.blockedTaskIds),
    downstreamTaskIds: toStringArray(value.downstreamTaskIds),
  };
}

export function toWorkflowResponse(value: unknown): WorkflowResponse {
  if (!isRecord(value)) {
    throw new Error('Invalid workflow payload received from server.');
  }

  const metadata = isRecord(value.metadata) ? value.metadata : {};

  return {
    workflowId: String(value.workflowId ?? ''),
    analysisId: toStringOrNull(value.analysisId),
    workflowProposalId: toStringOrNull(value.workflowProposalId),
    rawMessageId: toStringOrNull(value.rawMessageId),
    metadata,
    summary: toWorkflowSummary(value.summary),
    executionSequenceTaskIds: toStringArray(value.executionSequenceTaskIds),
    criticalPathTaskIds: toStringArray(value.criticalPathTaskIds),
    blockers: Array.isArray(value.blockers) ? value.blockers.map(toWorkflowImpactItem).filter((item): item is WorkflowImpactItem => Boolean(item)) : [],
    downstreamImpact: Array.isArray(value.downstreamImpact)
      ? value.downstreamImpact.map(toWorkflowImpactItem).filter((item): item is WorkflowImpactItem => Boolean(item))
      : [],
    insights: toStringArray(value.insights),
    tasks: Array.isArray(value.tasks) ? value.tasks.map(toTask) : [],
    dependencies: Array.isArray(value.dependencies)
      ? value.dependencies.map(toWorkflowDependency).filter((item): item is WorkflowDependency => Boolean(item))
      : [],
    createdAt: toStringOrNull(value.createdAt),
  };
}
