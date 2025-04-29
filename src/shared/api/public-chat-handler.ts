import { Socket } from 'socket.io';
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';
import generateSocketMessage from '../libs/generateSocketMessage';
import { MessageType, PublicChatClientToServerEvents, PublicChatInterServerEvents, PublicChatServerToClientEvents, PublicChatSocketData } from '../types/socket';

export default async function publicChatHandler(
  socket: Socket<
    PublicChatClientToServerEvents,
    PublicChatServerToClientEvents,
    PublicChatInterServerEvents,
    PublicChatSocketData
  >
) {
  const users = await socket.nsp.fetchSockets();
  const username = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    length: 2,
    separator: ' ',
  });
  socket.data.username = username;
  socket.emit('login', { username });
  socket.nsp.emit(
    'newMessage',
    generateSocketMessage(username, MessageType.NOTIFICATION, `${username} вошел в чат`, {
      users: users.length,
    })
  );

  socket.on('newMessage', async (data) => {
    socket.nsp.emit(
      'newMessage',
      generateSocketMessage(socket.data.username, MessageType.MESSAGE, data.text)
    );
  });

  socket.on('disconnect', async () => {
    const users = await socket.nsp.fetchSockets();
    socket.nsp.emit(
      'newMessage',
      generateSocketMessage(
        socket.data.username,
        MessageType.NOTIFICATION,
        `${socket.data.username} покинул чат`,
        {
          users: users.length,
        }
      )
    );
  });
}
