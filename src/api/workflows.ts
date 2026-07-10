import { httpClient } from './httpClient';
import { toWorkflowResponse } from './normalizers';
import type { WorkflowResponse } from '../types/workflow';

export async function fetchWorkflowById(workflowId: string): Promise<WorkflowResponse> {
  const response = await httpClient.get(`/api/workflows/${workflowId}`);
  return toWorkflowResponse(response.data);
}

export async function fetchWorkflowByMessage(messageId: string): Promise<WorkflowResponse> {
  const response = await httpClient.get(`/api/workflows/by-message/${messageId}`);
  return toWorkflowResponse(response.data);
}
