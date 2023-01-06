import { Server } from 'socket.io'
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

const Message = (ctx, type, text, payload = [], encrypted = false) => {
  return {
    type,
    text,
    ctx,
    encrypted,
    date: new Date(),
    payload
  }
}

const ioHandler = async (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server(res.socket.server)
    const pm = io.of('/pm')
    const main = io.of('/chat')

    var configFifty = {
      rooms: [],
      players: [],
      queue: {}
    }

    pm.on('connection', socket => {
      const chatId = socket.handshake.query.chatId
      const username = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        length: 2,
        separator: ' '
      })
      socket.username = username
      socket.encrypted = false
      socket.emit('pm:login', {login: username})
      if(chatId){
        if(pm.adapter.rooms.get(chatId)){
          if(pm.adapter.rooms.get(chatId).size < 2){
            socket.join(chatId)
            socket.broadcast.to(chatId).emit('pm:new_message', Message(socket.username, 'notification', `${username} вошел в чат`, { mate: true }))
            socket.emit('pm:new_message', Message(socket.username, 'notification', `${username} вошел в чат`, { mate: true, role: 'bob' }))
            pm.to(chatId).emit('pm:new_message', Message(socket.username, 'notification', "Создаём безопасное соединение..."))
          } else {
            socket.emit('pm:new_message', Message(socket.username, 'notification', 'В этой комнате уже общаются два человека', { mate: 1 }))
            socket.disconnect()
          } 
        } else {
          socket.join(chatId)
          pm.to(chatId).emit('pm:new_message', Message(socket.username, 'notification', `${username} вошел в чат`, { mate: false, role: 'alice'}))
        }
      } else {
        socket.disconnect()
      }

      socket.on('pm:alice_send_key', data => {
        socket.broadcast.to(chatId).emit('pm:alice_send_key', data)
        socket.broadcast.to(chatId).emit('pm:new_message', Message(socket.username, 'notification', "Произвели обмен ключами. Всё готово к общению!"))
        socket.encrypted = true
      })

      socket.on('pm:bob_send_key', data => {
        socket.broadcast.to(chatId).emit('pm:bob_send_key', data)
        socket.broadcast.to(chatId).emit('pm:new_message', Message(socket.username, 'notification', "Произвели обмен ключами. Всё готово к общению!"))
        socket.encrypted = true
      })

      socket.on('pm:new_message', (data) => {
        pm.to(chatId).emit('pm:new_message', Message(socket.username, 'message', data.text, {},  socket.encrypted))
      })


      socket.on('disconnect', async () => {
        pm.to(chatId).emit('pm:new_message', Message(socket.username, 'notification', `${username} покинул чат`, { mateLeft: true}))
      })
    })

    main.on('connection', async (socket) => {

      socket.on('main:new_message', async (data) => {
        io.of('/chat').emit('main:new_message', Message(socket.username, 'message', data.text))
      })

      socket.on('disconnect', async () => {
        const users = await io.of('/chat').fetchSockets()
        io.of('/chat').emit('main:new_message', Message(socket.username, 'notification', `${socket.username} покинул чат`, {users: users.length}))
      })

    })




    main.on('connection', async (socket) => {
      const users = await io.of('/chat').fetchSockets()
      const username = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        length: 2,
        separator: ' '
      })
      socket.username = username
      socket.emit('main:login', {login: username})
      io.of('/chat').emit('main:new_message', Message(username, 'notification', `${username} вошел в чат`, {users: users.length}))
    })

    res.socket.server.io = io
  } else {
    console.log('socket.io already running')
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}



export default ioHandler