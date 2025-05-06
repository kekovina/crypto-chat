import { CSSProperties } from 'react';

type ChatStatusProps = {
  title: React.ReactNode;
  body: React.ReactNode;
  action?: React.ReactNode;
  style?: CSSProperties;
};

const ChatStatus: React.FC<ChatStatusProps> = ({ title, body, action, style }) => {
  return (
    <div className='chat-messages__status messages-status' style={style}>
      <div className='messages-status__wrapper'>
        <div className='messages-status__invite'>
          {title}
          {action}
        </div>
        <div className='messages-status__status'>{body}</div>
      </div>
    </div>
  );
};

export default ChatStatus;
