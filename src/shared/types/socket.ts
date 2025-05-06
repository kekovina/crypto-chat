export const CLIENT_TO_SERVER_EVENTS_KEY = {
  //common
  LOGIN: 'login',
  //pm
  SEND_PUBLIC_KEY: 'send-public-key',
  ENCRYPTED_MESSAGE: 'encrypted-message',
  //public
  NEW_MESSAGE: 'new-message',
} as const;

export const SERVER_TO_CLIENT_EVENTS_KEY = {
  //common
  LOGIN: 'login',
  //pm
  RECIEVE_PUBLIC_KEY: 'receive-public-key',
  ENCRYPTED_MESSAGE: 'encrypted-message',
  ENCRYPTED_CONNECTION_CREATED: 'encrypted-connection-created',
  //public
  NEW_MESSAGE: 'new-message',
} as const;

export enum MessageType {
  NOTIFICATION = 'notification',
  MESSAGE = 'message',
  PUBLIC_KEY = 'public-key',
}

export type ServerMessage = {
  id: string;
  type: MessageType;
  text: string;
  username: string;
  date: Date;
  payload: Record<string, string | number>;
};

export interface ClientMessage {
  text: string;
  encrypted?: boolean;
  payload?: {
    users?: number;
    mate?: boolean;
    role?: string;
    mateLeft?: boolean;
    publicKey?: string;
  };
}

// pm chat
export interface PrivateChatClientToServerEvents {
  [CLIENT_TO_SERVER_EVENTS_KEY.SEND_PUBLIC_KEY]: (message: ClientMessage) => void;
  [CLIENT_TO_SERVER_EVENTS_KEY.ENCRYPTED_MESSAGE]: (message: ClientMessage) => void;
}

export interface PrivateChatServerToClientEvents {
  [SERVER_TO_CLIENT_EVENTS_KEY.LOGIN]: ({ username }: { username: string }) => void;
  [SERVER_TO_CLIENT_EVENTS_KEY.NEW_MESSAGE]: (message: ServerMessage) => void;
  [SERVER_TO_CLIENT_EVENTS_KEY.RECIEVE_PUBLIC_KEY]: (message: ServerMessage) => void;
  [SERVER_TO_CLIENT_EVENTS_KEY.ENCRYPTED_MESSAGE]: (message: ServerMessage) => void;
}

export type PrivateChatInterServerEvents = any;

export interface PrivateChatSocketData {
  username: string;
}

// main chat
export interface PublicChatClientToServerEvents {
  [CLIENT_TO_SERVER_EVENTS_KEY.NEW_MESSAGE]: (message: ClientMessage) => void;
}

export interface PublicChatServerToClientEvents {
  [SERVER_TO_CLIENT_EVENTS_KEY.NEW_MESSAGE]: (message: ServerMessage) => void;
  [SERVER_TO_CLIENT_EVENTS_KEY.LOGIN]: ({ username }: { username: string }) => void;
}
export type PublicChatInterServerEvents = any;
export interface PublicChatSocketData {
  username: string;
}

export enum ChatEvents {
  MATE_LEFT = 'mate_left',
  ALREADY_CONNECTED = 'already_connected',
}
