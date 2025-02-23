import CryptoMessanger from '@/shared/libs/CryptoMessanger';
import { ServerMessage } from '@/shared/types/socket';
import { useCallback, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export function useSocket(namespace: string, chatId?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [online, setOnline] = useState(0);
  const [login, setLogin] = useState<string | null>(null);
  const [mate, setMate] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const cryptoMessangerRef = useRef<CryptoMessanger>(new CryptoMessanger());

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const query = chatId ? { chatId } : {};
    const newSocket = io(`/${namespace}`, {
      query,
      transports: ['websocket'],
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log(`🔗 Connected to socket ${chatId ? 'pm' : 'chat'}`);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from socket');
    });

    newSocket.on('login', ({ username }) => {
      setLogin(username);
    });

    newSocket.on('aliceSentKey', async (data) => {
      if (role === 'bob') {
        const bobData = await cryptoMessangerRef.current.generateAsBob(data);
        console.log(bobData);
        newSocket.emit('bobSentKey', bobData);
      }
      if (!cryptoMessangerRef.current.getKey()) {
        await cryptoMessangerRef.current?.setKey(data.key);
      }
    });

    newSocket.on('bobSentKey', async (data) => {
      if (!cryptoMessangerRef.current.getKey()) {
        await cryptoMessangerRef.current?.setKey(data.key);
      }
    });

    newSocket.on(
      'pm:newMessage',
      async (data: ServerMessage & { payload: { users: number; mate: boolean } }) => {
        if (data.encrypted) {
          if (cryptoMessangerRef.current.getKey()) {
            data.text = await cryptoMessangerRef.current.decrypt(data.text);
          }
        }
        setMessages((prev) => [...prev, data]);

        if (data.payload?.users) setOnline(data.payload.users);
        if (data.payload?.mate) setMate(data.payload.mate);
        if (data.payload?.role) setRole(data.payload.role);
        if (data.payload?.mateLeft) {
          setMate(false);
        }

        setTimeout(
          () => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }),
          50
        );
      }
    );

    newSocket.on('main:newMessage', (data: ServerMessage & { payload: { users: number } }) => {
      setMessages((prev) => [...prev, data]);
      if (data.payload?.users) setOnline(data.payload.users);

      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 50);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [namespace, chatId]);

  useEffect(() => {
    if (!socket) return;
    const init = async () => {
      if (mate && role === 'alice') {
        const aliceData = await cryptoMessangerRef.current.generateAsAlice();
        console.log(aliceData);
        socket.emit('aliceSentKey', aliceData);
      }
    };
    init();
  }, [socket, mate]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!socket) return;
      const encryptedMessage = await cryptoMessangerRef.current.encrypt(message);
      socket.emit('newMessage', { text: encryptedMessage });
    },
    [socket]
  );

  return { socket, messages, online, login, mate, role, sendMessage, bottomRef };
}
