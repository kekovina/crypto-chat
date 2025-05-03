import { Socket } from 'socket.io';
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';
import generateSocketMessage from '../libs/generateSocketMessage';
import { ChatEvents, CLIENT_TO_SERVER_EVENTS_KEY, MessageType, PrivateChatClientToServerEvents, PrivateChatInterServerEvents, PrivateChatServerToClientEvents, PrivateChatSocketData, SERVER_TO_CLIENT_EVENTS_KEY } from '../types/socket';

export default function privateChatHandler(
  socket: Socket<PrivateChatClientToServerEvents, PrivateChatServerToClientEvents, PrivateChatInterServerEvents, PrivateChatSocketData>
) {
  const chatId = socket.handshake.query.chatId as string;
  const username = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    length: 2,
    separator: ' ',
  });
  socket.data.username = username;
  socket.data.encrypted = false;
  socket.emit(SERVER_TO_CLIENT_EVENTS_KEY.LOGIN, { username });
  if (chatId) {
    const chat = socket.nsp.adapter.rooms.get(chatId);
    if (chat) {
      if (chat.size < 2) {
        socket.join(chatId);
        socket.broadcast.to(chatId).emit(
          SERVER_TO_CLIENT_EVENTS_KEY.SERVER_NOTIFICATION,
          generateSocketMessage(socket.data.username, MessageType.NOTIFICATION, `${username} вошел в чат`, {
            mate: true,
          })
        );
        socket.emit(
          SERVER_TO_CLIENT_EVENTS_KEY.SERVER_NOTIFICATION,
          generateSocketMessage(socket.data.username, MessageType.NOTIFICATION, `${username} вошел в чат`, {
            mate: true,
            role: 'bob',
          })
        );
        socket.nsp
          .to(chatId)
          .emit(
            SERVER_TO_CLIENT_EVENTS_KEY.SERVER_NOTIFICATION,
            generateSocketMessage(
              socket.data.username,
              MessageType.NOTIFICATION,
              'Создаём безопасное соединение...'
            )
          );
      } else {
        socket.emit(
          SERVER_TO_CLIENT_EVENTS_KEY.SERVER_NOTIFICATION,
          generateSocketMessage(
            socket.data.username,
            MessageType.NOTIFICATION,
            'В этой комнате уже общаются два человека',
            { mate: 1 }
          )
        );
        socket.disconnect();
      }
    } else {
      socket.join(chatId);
      socket.nsp.to(chatId).emit(
        SERVER_TO_CLIENT_EVENTS_KEY.SERVER_NOTIFICATION,
        generateSocketMessage(socket.data.username, MessageType.NOTIFICATION, `${username} вошел в чат`, {
          mate: false,
          role: 'alice',
        })
      );
    }
  } else {
    socket.disconnect();
  }

  socket.on(CLIENT_TO_SERVER_EVENTS_KEY.SEND_PUBLIC_KEY, (data) => {
    socket.nsp
      .to(chatId).emit(SERVER_TO_CLIENT_EVENTS_KEY.RECIEVE_PUBLIC_KEY, generateSocketMessage(socket.data.username, MessageType.PUBLIC_KEY, data.text, {}, socket.data.encrypted));
  });

  socket.on(CLIENT_TO_SERVER_EVENTS_KEY.ENCRYPTED_MESSAGE, (data) => {
    socket.nsp
      .to(chatId)
      .emit(SERVER_TO_CLIENT_EVENTS_KEY.ENCRYPTED_MESSAGE, generateSocketMessage(socket.data.username, MessageType.MESSAGE, data.text, {}, socket.data.encrypted));
  });

  socket.on('disconnect', async () => {
    socket.nsp
      .to(chatId)
      .emit(
        SERVER_TO_CLIENT_EVENTS_KEY.SERVER_NOTIFICATION,
        generateSocketMessage(
          socket.data.username,
          MessageType.NOTIFICATION,
          `${username} покинул чат`,
          {
            type: ChatEvents.MATE_LEFT
          }
        )
      );
  });
}
