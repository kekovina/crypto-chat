export enum MessageType {
  NOTIFICATION = 'notification',
  MESSAGE = 'message',
  PUBLIC_KEY = 'public-key'
};

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
  'send-public-key': (message: Message) => void;
  'encrypted-message': (message: Message) => void

  [event: string | symbol]: (...args: any[]) => void;
}

export interface PrivateChatServerToClientEvents {
  login: ({ username }: { username: string }) => void;
  newMessage: (message: Message) => void;
  'receive-public-key': (message: Message) => void
  'encrypted-message': (message: Message) => void
  [event: string | symbol]: (...args: any[]) => void;
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

export enum ChatEvents {
  MATE_LEFT = 'mate_left'
}
