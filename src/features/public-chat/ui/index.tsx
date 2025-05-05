'use client';

import { useSocket } from '@/shared/hooks/useSocket';
import {
  CLIENT_TO_SERVER_EVENTS_KEY,
  SERVER_TO_CLIENT_EVENTS_KEY,
  ServerMessage,
} from '@/shared/types/socket';
import MessagesArea from '@/widget/Chat/MessagesArea';
import { chatStore } from '@/widget/Chat/model';
import { useEffect, useRef } from 'react';
import { useStore } from 'zustand';
export default function PublicChat({ pid }: { pid?: string }) {
  const { emit, on, off } = useSocket({ url: '/chat' });
  const { online, username, messages, setUsername, addMessage, setOnline } = useStore(chatStore);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loginHandler = ({ username }: ServerMessage) => setUsername(username);
    const messageHandler = (message: ServerMessage) => {
      setOnline(message.payload.users as number);
      addMessage(message);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
    };

    on(SERVER_TO_CLIENT_EVENTS_KEY.LOGIN, loginHandler);
    on(SERVER_TO_CLIENT_EVENTS_KEY.NEW_MESSAGE, messageHandler);
    return () => {
      off(SERVER_TO_CLIENT_EVENTS_KEY.LOGIN, loginHandler);
      off(SERVER_TO_CLIENT_EVENTS_KEY.NEW_MESSAGE, messageHandler);
    };
  }, []);

  const onSendMessage = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const inputElement = (e.target as HTMLFormElement).elements[0] as HTMLInputElement;
    const message = inputElement.value;
    if (message) {
      emit(CLIENT_TO_SERVER_EVENTS_KEY.NEW_MESSAGE, { text: message });
      inputElement.value = '';
    }
  };

  return (
    <div className='chat'>
      <div className='chat__header chat-header'>
        <div className='chat-header__title'>{pid ? 'Приватный чат' : 'Общий чат'}</div>
        <div className='chat-header__online'>{online} онлайн</div>
      </div>
      <div className='chat__messages chat-messages'>
        <div className='chat-messages__container'>
          {username && <MessagesArea messages={messages} login={username} />}
          <div className='chat-messages__bottom' ref={bottomRef}></div>
        </div>
      </div>
      <div className='chat__input chat-input'>
        <form onSubmit={onSendMessage}>
          <input className='chat-input__input' placeholder='Напишите сообщение...' />
        </form>
      </div>
    </div>
  );
}
