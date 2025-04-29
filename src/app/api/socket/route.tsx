import privateChatHandler from '@/shared/api/private-chat-handler';
import publicChatHandler from '@/shared/api/public-chat-handler';
import {
  PrivateChatClientToServerEvents,
  PrivateChatInterServerEvents,
  PrivateChatServerToClientEvents,
  PrivateChatSocketData,
  PublicChatClientToServerEvents,
  PublicChatInterServerEvents,
  PublicChatServerToClientEvents,
  PublicChatSocketData,
} from '@/shared/types/socket';

import { NextRequest } from 'next/server';
import { Namespace, Server } from 'socket.io';

let io: Server | null = null;
const debug = require('debug')('api:socket');

export async function GET(req: NextRequest & { socket: any }) {
  if (!io) {
    debug('Socket.io сервер запускается');
    const httpServer = req.socket?.server as any;

    if (!httpServer.io) {
      io = new Server(httpServer, {
        path: '/api/socket',
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
        transports: ['websocket'],
      });

      httpServer.io = io;

      const privateChat: Namespace<
        PrivateChatClientToServerEvents,
        PrivateChatServerToClientEvents,
        PrivateChatInterServerEvents,
        PrivateChatSocketData
      > = io.of('/pm');
      const publicChat: Namespace<
        PublicChatClientToServerEvents,
        PublicChatServerToClientEvents,
        PublicChatInterServerEvents,
        PublicChatSocketData
      > = io.of('/chat');

      privateChat.on('connection', privateChatHandler);
      publicChat.on('connection', publicChatHandler);
    }
  }

  return new Response('Socket.io сервер запущен', { status: 200 });
}
