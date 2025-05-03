import { useSocket } from '@/shared/hooks/useSocket';
import {
  PrivateChatClientToServerEvents,
  PrivateChatServerToClientEvents,
} from '@/shared/types/socket';
import LockIcon from '@/shared/ui/LockIcon';
import { useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import ChatStatus from './ChatStatus';
import MessagesArea from './MessagesArea';
import { chatStore } from './model';

type ChatProps = {
  pid: number;
};

const Chat: React.FC<ChatProps> = ({ pid }) => {
  const bottomRef = useRef(null);
  const { online, mate } = useStore(chatStore);

  const { on, off, emit } = useSocket<
    PrivateChatServerToClientEvents,
    PrivateChatClientToServerEvents
  >();

  useEffect(() => {}, [on, off]);

  const isPrivateMessage = pid ? true : false;
  const isMateConnected = !!mate;
  const isDisabledMessages = isPrivateMessage && !isMateConnected;

  const onSendMessage = () => {
    emit('encrypted-message');
  };

  return (
    <div className='chat'>
      <div className='chat__header chat-header'>
        <div className='chat-header__title'>{pid ? 'Приватный чат' : 'Общий чат'}</div>
        <div className='chat-header__online'>
          {!pid ? (
            `${online} онлайн`
          ) : (
            <div style={{ color: 'green' }}>
              <LockIcon fill='green' /> защищено
            </div>
          )}
        </div>
      </div>
      <div className='chat__messages chat-messages'>
        {isPrivateMessage && !isMateConnected && <ChatStatus />}
        <div className='chat-messages__container'>
          <MessagesArea />
          <div ref={bottomRef}></div>
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
};
export default Chat;
