import next from 'next';
import { createServer } from 'node:http';
import { Namespace, Server } from 'socket.io';
import privateChatHandler from './shared/api/private-chat-handler';
import publicChatHandler from './shared/api/public-chat-handler';
import {
  PrivateChatClientToServerEvents,
  PrivateChatInterServerEvents,
  PrivateChatServerToClientEvents,
  PrivateChatSocketData,
  PublicChatClientToServerEvents,
  PublicChatInterServerEvents,
  PublicChatServerToClientEvents,
  PublicChatSocketData,
} from './shared/types/socket';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    path: '/api/socket',
    transports: process.env.VERCEL == '1' ? ['polling'] : ['websocket'],
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

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

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
