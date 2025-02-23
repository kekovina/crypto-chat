import ClockLoader from 'react-spinners/ClockLoader';

export default function ChatStatus() {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  return (
    <div className='chat-messages__status messages-status' style={props}>
      <div className='messages-status__wrapper'>
        <div>
          Пригласите человека с помощью ссылки
          <button className='btn btn--gray btn--sm mx-1' onClick={copyLink}>
            Скопировать
          </button>
        </div>
        <div className='messages-status__status'>
          <ClockLoader size={18} color={'#fff'} cssOverride={{ marginRight: 5 }} />
          <div>Ожидаем собеседника...</div>
        </div>
      </div>
    </div>
  );
}
