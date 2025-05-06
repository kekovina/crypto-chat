'use client';

import copyToClipboard from '@/shared/libs/copyToClipboard';
import LockIcon from '@/shared/ui/LockIcon';
import { chatStore } from '@/widget/Chat/model';
import ChatStatus from '@/widget/Chat/ui/ChatStatus';
import MessagesArea from '@/widget/Chat/ui/MessagesArea';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import ClockLoader from 'react-spinners/ClockLoader';
import { useStore } from 'zustand';
import { useSecureChat } from '../model/useSecureChat';

export default function SecureChat({ pid }: { pid?: string }) {
  const { username, messages, setUsername, addMessage, resetMessages } = useStore(chatStore);

  const bottomRef = useRef<HTMLDivElement>(null);
  const { onSendMessage, emoji, isMateConnected, error } = useSecureChat(pid, {
    onMessageReceived: (message) => {
      addMessage(message);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
    },
    onLogin: (username) => setUsername(username),
  });

  const navigate = useRouter();

  useEffect(() => {
    resetMessages();
  }, []);

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
        {error && (
          <ChatStatus
            title={<p className='chat-messages__error-title'>{error.title}</p>}
            body={error.message}
            action={
              <button
                className='btn btn--gray btn--sm mx-1'
                onClick={() => navigate.push('/api/create-room')}
              >
                Создать другой чат
              </button>
            }
          />
        )}
        {!isMateConnected && !error && (
          <ChatStatus
            title='Пригласите собеседника с помощью ссылки'
            action={
              <button
                className='btn btn--gray btn--sm mx-1'
                onClick={() => copyToClipboard(window.location.href)}
              >
                Скопировать
              </button>
            }
            body={
              <>
                <ClockLoader size={18} color={'#fff'} cssOverride={{ marginRight: 5 }} />
                <div>Ожидаем собеседника...</div>
              </>
            }
          />
        )}
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
