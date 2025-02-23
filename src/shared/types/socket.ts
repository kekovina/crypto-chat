export type MessageType = 'notification' | 'message';

export type Message = {
  type: MessageType;
  text: string;
  username: string;
  encrypted: boolean;
  date: Date;
  payload: Record<string, string>;
};

// pm chat
export interface PrivateChatClientToServerEvents {
  aliceSentKey: (data: Message) => void;
  bobSentKey: (data: Message) => void;
  newMessage: (message: Message) => void;
}

export interface PrivateChatServerToClientEvents {
  login: ({ username }: { username: string }) => void;
  newMessage: (message: Message) => void;
  aliceSentKey: (data: Message) => void;
  bobSentKey: (data: Message) => void;
}

export type PrivateChatInterServerEvents = any;

export interface PrivateChatSocketData {
  username: string;
  encrypted: boolean;
}

// main chat
export interface PublicChatClientToServerEvents {
  newMessage: (message: Message) => void;
}

export interface PublicChatServerToClientEvents {
  newMessage: (message: Message) => void;
  login: ({ username }: { username: string }) => void;
}
export type PublicChatInterServerEvents = any;
export interface PublicChatSocketData {
  username: string;
}
