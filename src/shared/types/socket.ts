export const CLIENT_TO_SERVER_EVENTS_KEY = {
  //pm
  SEND_PUBLIC_KEY: 'send-public-key',
  ENCRYPTED_MESSAGE: 'encrypted-message',

  //public
  NEW_MESSAGE: 'new-message'
} as const

export const SERVER_TO_CLIENT_EVENTS_KEY = {
  //common
  LOGIN: 'login',
  //pm
  RECIEVE_PUBLIC_KEY: 'receive-public-key',
  ENCRYPTED_MESSAGE: 'encrypted-message',
  SERVER_NOTIFICATION: 'server-notification',
  //public
  NEW_MESSAGE: 'new-message'
} as const

export enum MessageType {
  NOTIFICATION = 'notification',
  MESSAGE = 'message',
  PUBLIC_KEY = 'public-key'
};

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
  [CLIENT_TO_SERVER_EVENTS_KEY.SEND_PUBLIC_KEY]: (message: Message) => void;
  [CLIENT_TO_SERVER_EVENTS_KEY.ENCRYPTED_MESSAGE]: (message: Message) => void
}

export interface PrivateChatServerToClientEvents {
  [SERVER_TO_CLIENT_EVENTS_KEY.LOGIN]: ({ username }: { username: string }) => void;
  [SERVER_TO_CLIENT_EVENTS_KEY.SERVER_NOTIFICATION]: (message: Message) => void;
  [SERVER_TO_CLIENT_EVENTS_KEY.RECIEVE_PUBLIC_KEY]: (message: Message) => void
  [SERVER_TO_CLIENT_EVENTS_KEY.ENCRYPTED_MESSAGE]: (message: Message) => void
}

export type PrivateChatInterServerEvents = any;

export interface PrivateChatSocketData {
  username: string;
  encrypted: boolean;
}

// main chat
export interface PublicChatClientToServerEvents {
  [CLIENT_TO_SERVER_EVENTS_KEY.NEW_MESSAGE]: (message: Message) => void;
}

export interface PublicChatServerToClientEvents {
  [SERVER_TO_CLIENT_EVENTS_KEY.NEW_MESSAGE]: (message: Message) => void;
  [SERVER_TO_CLIENT_EVENTS_KEY.LOGIN]: ({ username }: { username: string }) => void;
}
export type PublicChatInterServerEvents = any;
export interface PublicChatSocketData {
  username: string;
}

export enum ChatEvents {
  MATE_LEFT = 'mate_left'
}
