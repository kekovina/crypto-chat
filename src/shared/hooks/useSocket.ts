import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

type DefaultEventsMap = Record<string | symbol, (...args: any[]) => void>;

export function useSocket<
  ServerEvents extends DefaultEventsMap = DefaultEventsMap,
  ClientEvents extends DefaultEventsMap = DefaultEventsMap
>() {
  const socketRef = useRef<Socket<ServerEvents, ClientEvents> | null>(null);

  useEffect(() => {
    const socket: Socket<ServerEvents, ClientEvents> = io(undefined, {
      path: '/api/socket',
      autoConnect: true,
      transports: ['websocket'],
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const emit = useCallback<<K extends keyof ServerEvents>(
    event: K,
    ...args: Parameters<ServerEvents[K]>
  ) => void>(
    (event, ...args) => {
      socketRef.current?.emit(event, ...args);
    },
    []
  );

  const on = useCallback<<K extends keyof ClientEvents>(
    event: K,
    callback: ClientEvents[K]
  ) => void>(
    (event, callback) => {
      socketRef.current?.on(event, callback);
    },
    []
  );

  const off = useCallback<<K extends keyof ClientEvents>(
    event: K,
    callback: ClientEvents[K]
  ) => void>(
    (event, callback) => {
      socketRef.current?.off(event, callback);
    },
    []
  );

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
  };
}
