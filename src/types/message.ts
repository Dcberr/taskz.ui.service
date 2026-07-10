export type MessageRequest = {
  sender: string;
  content: string;
  currentMessage: string;
  channelName?: string;
  conversationId?: string;
  externalMessageId?: string;
  conversationMessages?: string[];
  participants?: string[];
};

export type MessageResponse = {
  id: string;
  sender: string;
  content: string;
  source: string | null;
  channelName: string | null;
  conversationId: string | null;
  externalMessageId: string | null;
  processed: boolean;
  createdAt: string | null;
};
