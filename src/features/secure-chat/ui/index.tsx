'use client';

import LockIcon from '@/shared/ui/LockIcon';
import { chatStore } from '@/widget/Chat/model';
import ChatStatus from '@/widget/Chat/ui/ChatStatus';
import MessagesArea from '@/widget/Chat/ui/MessagesArea';
import { useRef } from 'react';
import { useStore } from 'zustand';
import { useSecureChat } from '../model/useSecureChat';
export default function SecureChat({ pid }: { pid?: string }) {
  const { username, messages, setUsername, addMessage } = useStore(chatStore);

  const bottomRef = useRef<HTMLDivElement>(null);
  const { onSendMessage, emoji, isMateConnected } = useSecureChat(pid, {
    onMessageReceived: (message) => {
      addMessage(message);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
    },
    onLogin: (username) => setUsername(username),
  });

  const isDisabledMessages = !username || !isMateConnected;

  return (
    <div className='chat'>
      <div className='chat__header chat-header'>
        <div className='chat-header__title'>{pid ? 'Приватный чат' : 'Общий чат'}</div>
        <div className='chat-header__online'>
          <div className='chat-header__private'>
            <LockIcon fill='green' />
            <p>защищено</p>
            {emoji}
          </div>
        </div>
      </div>
      <div className='chat__messages chat-messages'>
        {!isMateConnected && <ChatStatus />}
        <div className='chat-messages__container'>
          {username && <MessagesArea messages={messages} login={username} />}
          <div className='chat-messages__bottom' ref={bottomRef}></div>
        </div>
      </div>
      <div className='chat__input chat-input'>
        {!isDisabledMessages && (
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
