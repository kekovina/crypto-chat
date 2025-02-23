'use client';

import { useSocket } from '@/shared/hooks/useSocket';
import ChatStatus from './ChatStatus';
import MessagesArea from './MessagesArea';
import LockIcon from './icons/LockIcon';

export default function Chat({ pid }: { pid?: string }) {
  const { mate, sendMessage, online, messages, login, bottomRef } = useSocket(
    pid ? 'pm' : 'chat',
    pid
  );
  const onSendMessage = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const inputElement = (e.target as HTMLFormElement).elements[0] as HTMLInputElement;
    if (inputElement.value) {
      sendMessage(inputElement.value);
      inputElement.value = '';
    }
  };

  const isPrivateMessage = pid ? true : false;
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
            </div>
          )}
        </div>
      </div>
      <div className='chat__messages chat-messages'>
        {isPrivateMessage && !isMateConnected && <ChatStatus />}
        <div className='chat-messages__container'>
          {login && <MessagesArea messages={messages} login={login} />}
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
