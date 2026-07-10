import { useQuery } from '@tanstack/react-query';
import { fetchWorkflowById, fetchWorkflowByMessage } from '../../../api/workflows';

export const workflowQueryKeys = {
  all: ['workflow'] as const,
  detail: (workflowId: string) => [...workflowQueryKeys.all, workflowId] as const,
  byMessage: (messageId: string) => [...workflowQueryKeys.all, 'message', messageId] as const,
};

export function useWorkflow(workflowId: string | null) {
  return useQuery({
    queryKey: workflowId ? workflowQueryKeys.detail(workflowId) : workflowQueryKeys.all,
    queryFn: () => {
      if (!workflowId) {
        throw new Error('Workflow ID is required.');
      }

      return fetchWorkflowById(workflowId);
    },
    enabled: Boolean(workflowId),
  });
}

export function useWorkflowByMessage(messageId: string | null) {
  return useQuery({
    queryKey: messageId ? workflowQueryKeys.byMessage(messageId) : workflowQueryKeys.all,
    queryFn: () => {
      if (!messageId) {
        throw new Error('Message ID is required.');
      }

      return fetchWorkflowByMessage(messageId);
    },
    enabled: Boolean(messageId),
    retry: false,
  });
}
