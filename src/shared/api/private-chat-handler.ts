import {
  PrivateChatClientToServerEvents,
  PrivateChatInterServerEvents,
  PrivateChatServerToClientEvents,
  PrivateChatSocketData,
} from '@/shared/types/socket';
import { Socket } from 'socket.io';
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';
import generateSocketMessage from '../libs/generateSocketMessage';

const debug = require('debug')('app:privateChatHandler');

export default function privateChatHandler(
  socket: Socket<
    PrivateChatClientToServerEvents,
    PrivateChatServerToClientEvents,
    PrivateChatInterServerEvents,
    PrivateChatSocketData
  >
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
      if (chat.size === 1) {
        debug('Bob connecting');
        socket.join(chatId);
        socket.broadcast.to(chatId).emit(
          'pm:newMessage',
          generateSocketMessage(socket.data.username, 'notification', `${username} вошел в чат`, {
            mate: true,
          })
        );
        socket.emit(
          'pm:newMessage',
          generateSocketMessage(socket.data.username, 'notification', `${username} вошел в чат`, {
            mate: true,
            role: 'bob',
          })
        );
        debug('Ready to chat');
        return socket.nsp
          .to(chatId)
          .emit(
            'pm:newMessage',
            generateSocketMessage(
              socket.data.username,
              'notification',
              'Создаём безопасное соединение...'
            )
          );
      } else {
        debug('Already 2 users in chat');
        socket.emit(
          'pm:newMessage',
          generateSocketMessage(
            socket.data.username,
            'notification',
            'В этой комнате уже общаются два человека',
            { mate: true }
          )
        );
        socket.disconnect();
      }
    } else {
      debug('Alice connecting');
      socket.join(chatId);
      socket.nsp.to(chatId).emit(
        'pm:newMessage',
        generateSocketMessage(socket.data.username, 'notification', `${username} вошел в чат`, {
          mate: false,
          role: 'alice',
        })
      );
    }
  } else {
    debug('Bad chatId');
    socket.disconnect();
  }

  socket.on('aliceSentKey', (data) => {
    debug('aliceSentKey');
    socket.broadcast.to(chatId).emit('aliceSentKey', {
      ...data,
      payload: {},
      encrypted: false,
      username: socket.data.username,
      type: 'notification',
      date: new Date(),
    });
    socket.broadcast
      .to(chatId)
      .emit(
        'pm:newMessage',
        generateSocketMessage(
          socket.data.username,
          'notification',
          'Произвели обмен ключами. Всё готово к общению!'
        )
      );
    socket.data.encrypted = true;
  });

  socket.on('bobSentKey', (data) => {
    debug('bobSentKey');
    socket.broadcast.to(chatId).emit('bobSentKey', {
      ...data,
      payload: {},
      encrypted: false,
      username: socket.data.username,
      type: 'notification',
      date: new Date(),
    });
    socket.broadcast
      .to(chatId)
      .emit(
        'pm:newMessage',
        generateSocketMessage(
          socket.data.username,
          'notification',
          'Произвели обмен ключами. Всё готово к общению!'
        )
      );
    socket.data.encrypted = true;
  });

  socket.on('newMessage', (data) => {
    debug('newMessage');
    socket.nsp
      .to(chatId)
      .emit(
        'pm:newMessage',
        generateSocketMessage(socket.data.username, 'message', data.text, {}, socket.data.encrypted)
      );
  });

  socket.on('disconnect', async () => {
    debug('disconnect');
    socket.nsp.to(chatId).emit(
      'pm:newMessage',
      generateSocketMessage(socket.data.username, 'notification', `${username} покинул чат`, {
        mateLeft: true,
      })
    );
  });
}
