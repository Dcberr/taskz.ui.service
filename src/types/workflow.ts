import type { Task } from './task';

export type WorkflowReasoning = {
  businessImpact: string | null;
  urgencyReason: string | null;
  confidenceReason: string | null;
};

export type WorkflowDetails = {
  workflowId: string | null;
  analysisId: string | null;
  workflowProposalId: string | null;
  taskProposalId: string | null;
  taskType: string | null;
  reasoning: WorkflowReasoning;
  evidence: string[];
  blockedByTaskIds: string[];
  blockedByTasks: Task[];
  blockedByProposalIds: string[];
  blocksTaskIds: string[];
  blocksTasks: Task[];
  blocksProposalIds: string[];
  dependencyCount: number;
  isCritical: boolean;
  workflowImpact: string | null;
};

export type WorkflowSummary = {
  isActionable: boolean;
  taskCount: number;
  workflowRisk: string | null;
  overallPriority: string | null;
  primaryAssignees: string[];
};

export type WorkflowDependency = {
  fromTaskId: string;
  toTaskId: string;
  dependencyType: string;
};

export type WorkflowImpactItem = {
  taskId: string;
  blockedTaskIds: string[];
  downstreamTaskIds: string[];
};

export type WorkflowResponse = {
  workflowId: string;
  analysisId: string | null;
  workflowProposalId: string | null;
  rawMessageId: string | null;
  metadata: Record<string, unknown>;
  summary: WorkflowSummary;
  executionSequenceTaskIds: string[];
  criticalPathTaskIds: string[];
  blockers: WorkflowImpactItem[];
  downstreamImpact: WorkflowImpactItem[];
  insights: string[];
  tasks: Task[];
  dependencies: WorkflowDependency[];
  createdAt: string | null;
};
