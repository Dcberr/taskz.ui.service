import { useMutation } from '@tanstack/react-query';
import { postMockMessage } from '../../../api/messages';

export function useMockMessageMutation() {
  return useMutation({
    mutationFn: postMockMessage,
  });
}
