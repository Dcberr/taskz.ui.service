import { httpClient } from './httpClient';
import { isRecord, toBoolean, toStringOrNull } from './normalizers';
import type { MessageRequest, MessageResponse } from '../types/message';

function toMessageResponse(value: unknown): MessageResponse {
  if (!isRecord(value)) {
    throw new Error('Invalid message payload received from server.');
  }

  return {
    id: String(value.id ?? ''),
    sender: String(value.sender ?? ''),
    content: String(value.content ?? ''),
    source: toStringOrNull(value.source),
    channelName: toStringOrNull(value.channelName),
    conversationId: toStringOrNull(value.conversationId),
    externalMessageId: toStringOrNull(value.externalMessageId),
    processed: toBoolean(value.processed),
    createdAt: toStringOrNull(value.createdAt),
  };
}

export async function postMockMessage(payload: MessageRequest): Promise<MessageResponse> {
  const response = await httpClient.post('/api/mock/messages', payload);
  return toMessageResponse(response.data);
}
