import { ServerMessage } from '@/shared/types/socket';
import classnames from 'classnames';
import dayjs from 'dayjs';
export default function MessagesArea({
  messages,
  login,
}: {
  messages: ServerMessage[];
  login: string;
}) {
  return messages.map(function (message, index, messages) {
    if (message.type === 'notification') {
      return (
        <div
          className='message message--notification'
          key={new Date(message?.date).getTime() + Math.round(Math.random() * 50)}
        >
          <div className='message__text'>{message.text}</div>
        </div>
      );
    } else if (message.type === 'message') {
      const authorClasses = classnames({
        message__author: true,
        'message__author--me': message.username == login,
      });
      const showHeader =
        message.username != messages[index - 1]?.username ||
        messages[index - 1]?.type == 'notification' ||
        dayjs(message.date).diff(dayjs(messages[index - 1]?.date), 'seconds') > 60;
      return (
        <div
          className='message message--message'
          key={new Date(message?.date).getTime() + Math.round(Math.random() * 1250)}
        >
          {showHeader ? (
            <div className='message__header'>
              <div className={authorClasses}>{message.username}</div>
              <div className='message__time'>{dayjs(message.date).format('HH:mm')}</div>
            </div>
          ) : null}
          <div className='message__text'>{message.text}</div>
        </div>
      );
    }
  });
}
