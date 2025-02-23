export type MessageType = 'notification' | 'message';

export type ServerMessage = {
  type: MessageType;
  text: string;
  username: string;
  encrypted: boolean;
  date: Date;
  payload: Record<string, string>;
};

export interface ClientMessage {
  text: string;
  encrypted?: boolean;
  payload?: {
    users?: number;
    mate?: boolean;
    role?: string;
    mateLeft?: boolean;
  };
}

// pm chat
export interface PrivateChatClientToServerEvents {
  aliceSentKey: (data: ClientMessage) => void;
  bobSentKey: (data: ClientMessage) => void;
  newMessage: (message: ClientMessage) => void;
}

export interface PrivateChatServerToClientEvents {
  login: ({ username }: { username: string }) => void;
  'pm:newMessage': (message: ServerMessage) => void;
  aliceSentKey: (data: ServerMessage) => void;
  bobSentKey: (data: ServerMessage) => void;
}

export type PrivateChatInterServerEvents = any;

export interface PrivateChatSocketData {
  username: string;
  encrypted: boolean;
}

// main chat
export interface PublicChatClientToServerEvents {
  newMessage: (message: ClientMessage) => void;
}

export interface PublicChatServerToClientEvents {
  'main:newMessage': (message: ServerMessage) => void;
  login: ({ username }: { username: string }) => void;
}
export type PublicChatInterServerEvents = any;
export interface PublicChatSocketData {
  username: string;
}
