import { Socket } from 'socket.io';
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';
import generateSocketMessage from '../libs/generateSocketMessage';

export default function privateChatHandler(
  socket: Socket<PMClientToServerEvents, PMServerToClientEvents, PMInterServerEvents, PMSocketData>
) {
  const chatId = socket.handshake.query.chatId as string;
  const username = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    length: 2,
    separator: ' ',
  });
  socket.data.username = username;
  socket.data.encrypted = false;
  socket.emit('login', { username });
  if (chatId) {
    const chat = socket.nsp.adapter.rooms.get(chatId);
    if (chat) {
      if (chat.size < 2) {
        socket.join(chatId);
        socket.broadcast.to(chatId).emit(
          'newMessage',
          generateSocketMessage(socket.data.username, 'notification', `${username} вошел в чат`, {
            mate: true,
          })
        );
        socket.emit(
          'newMessage',
          generateSocketMessage(socket.data.username, 'notification', `${username} вошел в чат`, {
            mate: true,
            role: 'bob',
          })
        );
        socket.nsp
          .to(chatId)
          .emit(
            'newMessage',
            generateSocketMessage(
              socket.data.username,
              'notification',
              'Создаём безопасное соединение...'
            )
          );
      } else {
        socket.emit(
          'newMessage',
          generateSocketMessage(
            socket.data.username,
            'notification',
            'В этой комнате уже общаются два человека',
            { mate: 1 }
          )
        );
        socket.disconnect();
      }
    } else {
      socket.join(chatId);
      socket.nsp.to(chatId).emit(
        'newMessage',
        generateSocketMessage(socket.data.username, 'notification', `${username} вошел в чат`, {
          mate: false,
          role: 'alice',
        })
      );
    }
  } else {
    socket.disconnect();
  }

  socket.on('aliceSentKey', (data) => {
    socket.broadcast.to(chatId).emit('aliceSentKey', data);
    socket.broadcast
      .to(chatId)
      .emit(
        'newMessage',
        generateSocketMessage(
          socket.data.username,
          'notification',
          'Произвели обмен ключами. Всё готово к общению!'
        )
      );
    socket.data.encrypted = true;
  });

  socket.on('bobSentKey', (data) => {
    socket.broadcast.to(chatId).emit('bobSentKey', data);
    socket.broadcast
      .to(chatId)
      .emit(
        'newMessage',
        generateSocketMessage(
          socket.data.username,
          'notification',
          'Произвели обмен ключами. Всё готово к общению!'
        )
      );
    socket.data.encrypted = true;
  });

  socket.on('newMessage', (data) => {
    socket.nsp
      .to(chatId)
      .emit(
        'newMessage',
        generateSocketMessage(socket.data.username, 'message', data.text, {}, socket.data.encrypted)
      );
  });

  socket.on('disconnect', async () => {
    socket.nsp
      .to(chatId)
      .emit(
        'newMessage',
        generateSocketMessage(
          socket.data.username,
          'notification',
          `${username} покинул чат`,
          ChatEvents.MATE_LEFT
        )
      );
  });
}
