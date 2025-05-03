import { useCallback, useEffect, useRef } from 'react';
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

type DefaultEventsMap = Record<string | symbol, (...args: any[]) => void>;

interface UseSocketOptions extends Partial<ManagerOptions & SocketOptions> {
  url?: string; // По умолчанию будет текущий хост
}

export function useSocket<
  ServerEvents extends DefaultEventsMap = DefaultEventsMap,
  ClientEvents extends DefaultEventsMap = DefaultEventsMap,
>(options: UseSocketOptions = {}) {
  const socketRef = useRef<Socket<ServerEvents, ClientEvents> | null>(null);

  useEffect(() => {
    const {
      url,
      path = '/api/socket',
      autoConnect = true,
      transports = ['websocket'],
      ...rest
    } = options;

    const socket: Socket<ServerEvents, ClientEvents> = io(url ?? undefined, {
      path,
      autoConnect,
      transports,
      ...rest,
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [options]);

  const emit = useCallback<
    <K extends keyof ServerEvents>(event: K, ...args: Parameters<ServerEvents[K]>) => void
  >((event, ...args) => {
    socketRef.current?.emit(event, ...args);
  }, []);

  const on = <K extends keyof ClientEvents>(event: K, callback: ClientEvents[K]) => {
    socketRef.current?.on(event, callback);
  };

  const off = <K extends keyof ClientEvents>(event: K, callback: ClientEvents[K]) => {
    socketRef.current?.off(event, callback);
  };

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
  };
}
