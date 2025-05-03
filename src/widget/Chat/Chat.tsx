'use client';

import useDH from '@/shared/hooks/useDH';
import { useSocket } from '@/shared/hooks/useSocket';
import {
  ChatEvents,
  CLIENT_TO_SERVER_EVENTS_KEY,
  SERVER_TO_CLIENT_EVENTS_KEY,
  ServerMessage,
} from '@/shared/types/socket';
import LockIcon from '@/shared/ui/LockIcon';
import ChatStatus from '@/widget/Chat/ChatStatus';
import { chatStore } from '@/widget/Chat/model';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from 'zustand';
import MessagesArea from './MessagesArea';

export const sha256 = async (data: Uint8Array): Promise<Uint8Array> => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
};

const emojiList = [
  '🐮',
  '🐭',
  '🐯',
  '🐨',
  '🐷',
  '🐹',
  '🐒',
  '🐱',
  '🐶',
  '🦊',
  '🦓',
  '🐣',
  '🐥',
  '🦉',
  '🐢',
  '🦞',
  '🐳',
  '🌷',
  '🌹',
  '🌸',
  '🌲',
  '🌵',
  '🌴',
  '🐻',
  '🐼',
];

const getEmoji = (sharedKeySHA: Uint8Array) => {
  const bytes = sharedKeySHA?.slice(0, 6);
  const emojies = bytes?.reduce(
    (emojies, byte) => emojies + emojiList[byte % emojiList.length],
    ''
  );
  return emojies;
};

export default function Chat({ pid }: { pid?: string }) {
  const [emoji, setEmoji] = useState<string | null>(null);
  const connectionOpts = useMemo(
    () => (pid ? { url: '/pm', query: { chatId: pid } } : { url: '/chat' }),
    [pid]
  );
  const { emit, on, off } = useSocket(connectionOpts);
  const { online, mate, username, messages, setUsername, addMessage, setOnline, setMate } =
    useStore(chatStore);
  const { encryptMessage, sharedKey, receiveTheirPublicKey, getMyPublicKeyBase64, decryptMessage } =
    useDH();
  const bottomRef = useRef<HTMLDivElement>(null);

  const isPrivateMessage = pid ? true : false;

  useEffect(() => {
    const loginHandler = ({ username }: ServerMessage) => setUsername(username);
    const messageHandler = (message: ServerMessage) => {
      if (isPrivateMessage) {
        const { mate, event } = message.payload;
        if (mate) {
          const publicKey = getMyPublicKeyBase64();
          emit(CLIENT_TO_SERVER_EVENTS_KEY.SEND_PUBLIC_KEY, { payload: { publicKey } });
          setMate(message.payload.mate);
        }
        if (event) {
          switch (event) {
            case ChatEvents.MATE_LEFT:
              setMate(false);
          }
        }
      } else {
        setOnline(message.payload.users as number);
      }
      addMessage(message);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
    };

    const encryptedMessageHandler = (message: ServerMessage) => {
      const decryptedMessage = { ...message, text: decryptMessage(message.text as string) };
      addMessage(decryptedMessage);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
    };

    const publicKeyRecievedHandler = (message: ServerMessage) => {
      receiveTheirPublicKey(message.payload.publicKey as string);
    };
    on(SERVER_TO_CLIENT_EVENTS_KEY.LOGIN, loginHandler);
    on(SERVER_TO_CLIENT_EVENTS_KEY.NEW_MESSAGE, messageHandler);
    on(SERVER_TO_CLIENT_EVENTS_KEY.RECIEVE_PUBLIC_KEY, publicKeyRecievedHandler);
    on(SERVER_TO_CLIENT_EVENTS_KEY.ENCRYPTED_MESSAGE, encryptedMessageHandler);
    return () => {
      off(SERVER_TO_CLIENT_EVENTS_KEY.LOGIN, loginHandler);
      off(SERVER_TO_CLIENT_EVENTS_KEY.NEW_MESSAGE, messageHandler);
      off(SERVER_TO_CLIENT_EVENTS_KEY.RECIEVE_PUBLIC_KEY, publicKeyRecievedHandler);
      off(SERVER_TO_CLIENT_EVENTS_KEY.ENCRYPTED_MESSAGE, encryptedMessageHandler);
    };
  }, [sharedKey]);

  useEffect(() => {
    if (sharedKey) {
      sha256(sharedKey).then((sharedKeySHA) => {
        setEmoji(getEmoji(sharedKeySHA));
      });
    }
  }, [sharedKey]);

  const onSendMessage = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const inputElement = (e.target as HTMLFormElement).elements[0] as HTMLInputElement;
    const message = inputElement.value;
    if (message) {
      if (isPrivateMessage) {
        emit(CLIENT_TO_SERVER_EVENTS_KEY.ENCRYPTED_MESSAGE, {
          text: encryptMessage(message),
          encrypted: true,
        });
      } else {
        emit(CLIENT_TO_SERVER_EVENTS_KEY.NEW_MESSAGE, { text: message });
      }
      inputElement.value = '';
    }
  };

  const isMateConnected = !!mate;
  const isDisabledMessages = isPrivateMessage && !isMateConnected;

  return (
    <div className='chat'>
      <div className='chat__header chat-header'>
        <div className='chat-header__title'>{pid ? 'Приватный чат' : 'Общий чат'}</div>
        <div className='chat-header__online'>
          {!pid ? (
            `${online} онлайн`
          ) : (
            <div className='chat-header__private'>
              <LockIcon fill='green' />
              <p>защищено</p>
              {emoji}
            </div>
          )}
        </div>
      </div>
      <div className='chat__messages chat-messages'>
        {isPrivateMessage && !isMateConnected && <ChatStatus />}
        <div className='chat-messages__container'>
          {username && <MessagesArea messages={messages} login={username} />}
          <div className='chat-messages__bottom' ref={bottomRef}></div>
        </div>
      </div>
      <div className='chat__input chat-input'>
        {isPrivateMessage && isMateConnected && (
          <form onSubmit={onSendMessage}>
            <input className='chat-input__input' placeholder='Напишите сообщение...' />
          </form>
        )}

        {!isPrivateMessage && (
          <form onSubmit={onSendMessage}>
            <input className='chat-input__input' placeholder='Напишите сообщение...' />
          </form>
        )}

        {isDisabledMessages && (
          <div className='chat-input__status'>Отправка сообщений недоступна</div>
        )}
      </div>
    </div>
  );
}
