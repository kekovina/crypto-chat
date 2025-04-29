import { useEffect, useRef } from 'react';
import ChatStatus from './ChatStatus';
import MessagesArea from './MessagesArea';
import { useSocket } from '@/shared/hooks/useSocket';
import { PrivateChatClientToServerEvents, PrivateChatServerToClientEvents } from '@/shared/types/socket';
import LockIcon from '@/shared/ui/LockIcon';



export default function Chat({ pid }) {
    const bottomRef = useRef(null);

    const { on, off } = useSocket<PrivateChatServerToClientEvents, PrivateChatClientToServerEvents>();

    useEffect(() => {

    }, [on, off]);

    const isPrivateMessage = pid ? true : false;
    // const isMateConnected = store.mate;
    // const isDisabledMessages =
    //   (store.mate !== true && store.mate) || (isPrivateMessage && !isMateConnected);

    return (
      <div className='chat'>
        <div className='chat__header chat-header'>
          <div className='chat-header__title'>{pid ? 'Приватный чат' : 'Общий чат'}</div>
          <div className='chat-header__online'>
            {!pid ? (
              `${store.online} онлайн`
            ) : (
              <div style={{ color: 'green' }}>
                <LockIcon fill='green'/> защищено
              </div>
            )}
          </div>
        </div>
        <div className='chat__messages chat-messages'>
          {isPrivateMessage && <ChatStatus isShow={!isMateConnected} />}
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
  })
);
