// useSocket.ts
import { getSocket } from '@/shared/libs/getSocket';
import { useCallback, useEffect, useRef } from 'react';
import { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

type DefaultEventsMap = Record<string | symbol, (...args: any[]) => void>;

interface UseSocketOptions extends Partial<ManagerOptions & SocketOptions> {
  url?: string;
}

export function useSocket<
  ServerEvents extends DefaultEventsMap = DefaultEventsMap,
  ClientEvents extends DefaultEventsMap = DefaultEventsMap,
>(options: UseSocketOptions = {}) {
  const socketRef = useRef<Socket<ServerEvents, ClientEvents>>(null);

  if (!socketRef.current) {
    socketRef.current = getSocket(options.url ?? '/', options);
  }

  useEffect(() => {
    return () => {
      socketRef.current?.removeAllListeners();
    };
  }, []);

  const emit = useCallback(
    <K extends keyof ServerEvents>(event: K, ...args: Parameters<ServerEvents[K]>) => {
      // @ts-expect-error hard type
      socketRef.current?.emit(event as string, ...args);
    },
    []
  );

  const on = <K extends keyof ClientEvents>(event: K, callback: ClientEvents[K]) => {
    // @ts-expect-error hard type
    socketRef.current?.on(event as string, callback);
  };

  const off = <K extends keyof ClientEvents>(event: K, callback: ClientEvents[K]) => {
    // @ts-expect-error hard type
    socketRef.current?.off(event as string, callback);
  };

  return {
    socket: socketRef.current!,
    emit,
    on,
    off,
  };
}
