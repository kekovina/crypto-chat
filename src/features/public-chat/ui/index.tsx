'use client';

import { chatStore } from '@/widget/Chat/model';
import MessagesArea from '@/widget/Chat/ui/MessagesArea';
import { useRef } from 'react';
import { useStore } from 'zustand';
import { usePublicChat } from '../model/usePublicChat';

export default function PublicChat() {
  const { online, username, messages, setUsername, addMessage, setOnline } = useStore(chatStore);

  const bottomRef = useRef<HTMLDivElement>(null);

  const { onSendMessage } = usePublicChat({
    onLogin: (username) => setUsername(username),
    onMessageReceived: (message) => {
      addMessage(message);
      setOnline(message.payload.users as number);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
    },
  });

  return (
    <div className='chat'>
      <div className='chat__header chat-header'>
        <div className='chat-header__title'>Общий чат</div>
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
