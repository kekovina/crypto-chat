// socketSingleton.ts
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

const sockets = new Map<string, Socket>();

export function getSocket(url = '/', options?: Partial<ManagerOptions & SocketOptions>): Socket {
  const fullUrl = url + (options?.path || '/api/socket');
  if (!sockets.has(fullUrl)) {
    const socket = io(url, {
      path: '/api/socket',
      transports: ['websocket'],
      autoConnect: true,
      ...options,
    });
    sockets.set(fullUrl, socket);
  }

  return sockets.get(fullUrl)!;
}
